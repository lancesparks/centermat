from fastapi import APIRouter,  HTTPException
from datetime import datetime, timezone
from starlette import status
from database import db_dependency
import models
import schemas 
from .auth import user_dependency, checkUserRoles, checkValidUser


router = APIRouter(prefix="/registration", tags=["registration"])


@router.get('/{tournament_id}', response_model=list[schemas.RegistrationResponse], status_code=status.HTTP_200_OK)
def get_all_tournament_registrations(tournament_id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    registrations = (
        db.query(models.Registration)
        .filter(models.Registration.tournament_id == tournament_id)
        .all()
    )
    return registrations


@router.get('/{tournament_id}/{athlete_id}', response_model=list[schemas.RegistrationResponse], status_code=status.HTTP_200_OK)
def get_tournament_registrations_by_athlete(tournament_id: str, athlete_id:str, user: user_dependency, db: db_dependency):
    checkValidUser(user)

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    registrations = (
        db.query(models.Registration)
        .filter(models.Registration.tournament_id == tournament_id, models.Registration.athlete_profile_id == athlete_id)
        .all()
    )
    return registrations

@router.post('/{tournament_id}', response_model=schemas.RegistrationResponse, status_code=status.HTTP_201_CREATED)
def create_registration(tournament_id: str, user: user_dependency, db: db_dependency, registration: schemas.RegistrationCreate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")
    

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    new_registration = models.Registration(
        tournament_id = tournament.id,
        athlete_profile_id = registration.athlete_profile_id,
        weight_class_id = registration.weight_class_id,
    )

    db.add(new_registration)
    db.commit()
    db.refresh(new_registration)
    return new_registration

@router.patch('/{tournament_id}/{id}', response_model=schemas.RegistrationResponse, status_code=status.HTTP_200_OK)
def update_registration_class(tournament_id: str, id: str, user: user_dependency, db: db_dependency, registration: schemas.RegistrationUpdate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")
    
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    existing = db.query(models.Registration).filter(models.Registration.tournament_id == tournament_id,models.Registration.id == id).first()

    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration class not found")

    for field, value in registration.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)


    db.commit()
    db.refresh(existing)
    return existing

@router.delete('/{tournament_id}/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_registration(tournament_id: str, id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")
    
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    existing = db.query(models.Registration).filter(models.Registration.tournament_id == tournament_id,models.Registration.id == id).first()

    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Registration class not found")

    db.delete(existing)
    db.commit()