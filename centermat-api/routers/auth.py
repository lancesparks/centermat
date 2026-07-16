import secrets
import os
import models
import schemas 
import bcrypt
from datetime import datetime, timedelta, timezone
from typing import Optional, Annotated
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from utils import send_reset_password_email
from database import db_dependency

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

router = APIRouter(prefix="/auth", tags=["auth"])

# --- Password Hashing Helpers ---
def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_bytes = bcrypt.hashpw(password_bytes, salt)
    return hashed_bytes.decode('utf-8')
 
def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(
        plain.encode('utf-8'), 
        hashed.encode('utf-8')
    )

# --- JWT Token Generation & Verification ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    # Standard security practice: payload "sub" should represent user id as a string
    to_encode.update({"exp": expire, "sub": str(data.get("sub"))})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) 

def get_user_by_email(db: Session, email: str) -> models.User | None:
    return db.query(models.User).filter(models.User.email == email).first()

def authenticate_user(db: Session, email: str, password: str) -> models.User | None:
    user = get_user_by_email(db, email)
    if not user or not verify_password(password, user.password_hash):
        return None
    return user

async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: db_dependency,
) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id_raw = payload.get("sub")
        if user_id_raw is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
 
    # Cast user_id safely to match models.User.id type (UUID as str or int)
    # If your user IDs are integers, uncomment the line below:
    # user_id = int(user_id_raw)
    user_id = user_id_raw

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
 
user_dependency = Annotated[models.User, Depends(get_current_user)]

# --- Role & Auth Checks ---
def checkValidUser(user: user_dependency):
    if user is None:
        raise HTTPException(status_code=403, detail="Auth Failed")
    
def checkUserRoles(user: user_dependency, roles: list[models.UserRole], message: str):
    if not any(r in user.roles for r in roles):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=message)

# --- Routes ---

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: schemas.UserCreate, db: db_dependency):
    existing = get_user_by_email(db, data.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists",
        )
 
    user = models.User(
        email=data.email,
        password_hash=hash_password(data.password),
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
    )
    user.roles = data.roles
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login", response_model=schemas.Token)
def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency,
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
 
    access_token = create_access_token(
        data={"sub": user.id},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": access_token, "token_type": "bearer"}


# 1. Body(..., embed=True) or Pydantic schemas allow Next.js to pass JSON natively
@router.post("/forgot-password")
def forgot_password(
    payload: schemas.ForgotPasswordRequest, # Changed to use schemas for body extraction
    db: db_dependency, 
    background_tasks: BackgroundTasks
):
    # Lookup user using the schema object
    user = get_user_by_email(db, payload.email)
    
    # Anti-enumeration guard
    if not user:
        return {"message": "Password change request sent, check your email. "}
    
    # Remove existing active reset keys
    db.query(models.PasswordResetToken).filter(models.PasswordResetToken.user_id == user.id).delete()

    raw_token = secrets.token_urlsafe(32)
    expiration = datetime.now(timezone.utc) + timedelta(minutes=15)
    
    db_token = models.PasswordResetToken(
        user_id=user.id,
        token=raw_token,
        expires_at=expiration
    )
    db.add(db_token)
    db.commit()
    
    # Make sure this domain points to your local or staging deployment
    reset_link = f"https://http://localhost:3000/reset-password?token={raw_token}"
    background_tasks.add_task(send_reset_password_email, email=user.email, reset_link=reset_link)
    
    return {"message": "Password change request sent, check your email. "}


@router.post("/reset-password")
def reset_password(payload: schemas.ResetPasswordSubmit, db: db_dependency):
    db_token = db.query(models.PasswordResetToken).filter(
        models.PasswordResetToken.token == payload.token
    ).first()
    
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token."
        )
        
    # Standardize timezones safely depending on table mapping structure
    if db_token.expires_at < datetime.now(timezone.utc).replace(tzinfo=None):
        db.delete(db_token)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Reset token has expired."
        )
        
    user = db.query(models.User).filter(models.User.id == db_token.user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_442_UNPROCESSABLE_ENTITY,
            detail="User associated with this token not found."
        )
        
    user.password_hash = hash_password(payload.new_password)
    
    db.delete(db_token)
    db.commit()
    return {"message": "Password successfully reset. You can now log in with your new password."}
 
@router.get("/user", response_model=schemas.UserResponse)
def get_user(current_user: user_dependency):
    return current_user

@router.put("/user", response_model=schemas.UserResponse, status_code=status.HTTP_200_OK)
def update_user(
    data: schemas.UserUpdate,
    current_user: user_dependency,
    db: db_dependency,
):
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str, current_user: user_dependency, db: db_dependency):
    checkValidUser(current_user)

    # Coerce to string to avoid comparison mismatch if ID types are numeric
    if str(current_user.id) != str(user_id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You can only delete your own account")

    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()