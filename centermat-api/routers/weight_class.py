from fastapi import APIRouter,  HTTPException
from datetime import datetime, timezone
from starlette import status
from database import db_dependency
import models
import schemas 
from .auth import user_dependency, checkUserRoles, checkValidUser


router = APIRouter(prefix="/weight-class", tags=["weight-class"])


@router.get('/{tournament_id}', response_model=list[schemas.WeightClassResponse], status_code=status.HTTP_200_OK)
def get_tournament_weight_classes(tournament_id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    weight_classes = (
        db.query(models.WeightClass)
        .filter(models.WeightClass.tournament_id == tournament_id)
        .all()
    )
    return weight_classes

@router.post('/{tournament_id}', response_model=schemas.WeightClassResponse, status_code=status.HTTP_201_CREATED)
def create_weight_class(tournament_id: str, user: user_dependency, db: db_dependency, weight_class: schemas.WeightClassCreate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")
    

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    new_weight_class = models.WeightClass(
        tournament_id = tournament.id,
        name = weight_class.name,
        max_weight = weight_class.max_weight,
        min_weight = weight_class.min_weight,
        weight_type = weight_class.weight_type,
        division = weight_class.division
    )

    db.add(new_weight_class)
    db.commit()
    db.refresh(new_weight_class)
    return new_weight_class

@router.patch('/{tournament_id}/{weight_class_id}', response_model=schemas.WeightClassResponse, status_code=status.HTTP_200_OK)
def update_weight_class(tournament_id: str, weight_class_id: str, user: user_dependency, db: db_dependency, weight_class: schemas.WeightClassUpdate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")
    
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    existing = db.query(models.WeightClass).filter(models.WeightClass.tournament_id == tournament_id,models.WeightClass.id == weight_class_id).first()

    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Weight class not found")

    for field, value in weight_class.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)


    db.commit()
    db.refresh(existing)
    return existing

@router.delete('/{tournament_id}/{weight_class_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_weight_class(tournament_id: str, weight_class_id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")
    
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()

    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    existing = db.query(models.WeightClass).filter(models.WeightClass.tournament_id == tournament_id,models.WeightClass.id == weight_class_id).first()

    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Weight class not found")

    db.delete(existing)
    db.commit()