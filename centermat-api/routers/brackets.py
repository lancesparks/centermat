from fastapi import APIRouter,  HTTPException
from datetime import datetime, timezone
from starlette import status
from database import db_dependency
import models
import schemas 
from .auth import user_dependency, checkUserRoles, checkValidUser


router = APIRouter(prefix="/brackets", tags=["brackets"])


@router.get("/tournament/{tournament_id}", status_code=status.HTTP_200_OK)
def get_all_brackets_by_tournament(tournament_id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

    brackets = (
        db.query(models.Bracket)
        .filter(models.Bracket.tournament_id == tournament_id)
        .all()
    )
    return brackets


@router.post('/tournament/{tournament_id}/{weight_class_id}',status_code=status.HTTP_201_CREATED)
def create_bracket(tournament_id: str, weight_class_id:str, user: user_dependency, db: db_dependency, bracket: schemas.BracketCreate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")

    
    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    weight_class = db.query(models.WeightClass).filter(models.WeightClass.id == weight_class_id).first()
    
    if weight_class is None:
         raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Weight class not found")
    
    if weight_class.tournament_id != tournament_id:
        raise HTTPException(status_code=400, detail="Weight class not in this tournament")

    new_bracket = models.Bracket(
        tournament_id = tournament.id,
        weight_class_id = weight_class.id,
        format = bracket.format,
        published = bracket.published,
        published_at = datetime.now(timezone.utc).replace(tzinfo=None) if bracket.published else None
    )

    db.add(new_bracket)
    db.commit()
    db.refresh(new_bracket)
    return new_bracket


@router.delete('/{bracket_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_bracket(bracket_id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")

    bracket = db.query(models.Bracket).filter(models.Bracket.id == bracket_id).first()
    if bracket is None:
        raise HTTPException(status_code=404, detail="Bracket not found")
    
    if bracket.tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")
    
    if bracket.published:
        raise HTTPException(status_code=400, detail="Cannot delete a published bracket")

    db.delete(bracket)
    db.commit()