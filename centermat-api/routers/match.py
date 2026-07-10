from fastapi import APIRouter,  HTTPException
from starlette import status
from database import db_dependency
import models
import schemas 
from sqlalchemy import or_
from .auth import user_dependency, checkUserRoles, checkValidUser


router = APIRouter(prefix="/match", tags=["match"])


@router.get("/tournament/{tournament_id}", status_code=status.HTTP_200_OK)
def get_all_matches_by_tournament(tournament_id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

    matches = (
    db.query(models.Match)
    .join(models.Bracket, models.Match.bracket_id == models.Bracket.id)
    .filter(models.Bracket.tournament_id == tournament.id)
    .order_by(models.Bracket.id, models.Match.round_number, models.Match.match_number)
    .all()
    )

    return matches


@router.get("/tournament/{tournament_id}/{athlete_id}", status_code=status.HTTP_200_OK)
def get_all_matches_by_athlete(tournament_id: str, athlete_id:str, user: user_dependency, db: db_dependency):
    checkValidUser(user)

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")

    matches = (
    db.query(models.Match)
    .join(models.Bracket, models.Match.bracket_id == models.Bracket.id)
    .filter(models.Bracket.tournament_id == tournament.id)
    .filter(or_(
    models.Match.athlete_a_id == athlete_id,
    models.Match.athlete_b_id == athlete_id,
    ))
    .order_by(models.Bracket.id, models.Match.round_number, models.Match.match_number)
    .all()
    )

    return matches


@router.post('/{tournament_id}/{bracket_id}', response_model=schemas.MatchResponse, status_code=status.HTTP_201_CREATED)
def create_match(user: user_dependency, db: db_dependency,tournament_id: str, bracket_id:str, new_match: schemas.MatchCreate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")

    tournament = db.query(models.Tournament).filter(models.Tournament.id == tournament_id).first()
    
    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")
    
    bracket = db.query(models.Bracket).filter(models.Bracket.id == bracket_id).first()
    if bracket is None: 
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bracket not found")
    
    if bracket.tournament_id != tournament_id:
        raise HTTPException(status_code=400, detail="Bracket not in this tournament")
    
    existing = (
        db.query(models.Match)
        .filter(
            models.Match.bracket_id == bracket_id,
            models.Match.round_number == new_match.round_number,
            models.Match.match_number == new_match.match_number,
        )
        .first()
    )
    
    if existing is not None:
        raise HTTPException(status_code=400, detail="A match with that round/number already exists in this bracket")
    
    match = models.Match(
        bracket_id=bracket.id,
        round_number=new_match.round_number,
        match_number=new_match.match_number,
        athlete_a_id=new_match.athlete_a_id,
        athlete_b_id=new_match.athlete_b_id,
    )

    db.add(match)
    db.commit()
    db.refresh(match)
    return match


@router.put('/{match_id}', response_model=schemas.MatchResponse, status_code=status.HTTP_200_OK)
def update_match(user: user_dependency, db: db_dependency, match_id: str, updated_match: schemas.MatchUpdate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")

    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if match is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

    if match.bracket.tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    for field, value in updated_match.model_dump(exclude_unset=True).items():
        setattr(match, field, value)

    db.commit()
    db.refresh(match)
    return match


@router.delete('/{match_id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_match(user: user_dependency, db: db_dependency, match_id: str, updated_match: schemas.MatchUpdate):
    checkValidUser(user)
    checkUserRoles(user, [models.UserRole.organizer, models.UserRole.coach], "You do not have permission")

    match = db.query(models.Match).filter(models.Match.id == match_id).first()
    if match is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Match not found")

    db.delete(match)
    db.commit()