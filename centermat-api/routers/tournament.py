from fastapi import APIRouter, HTTPException,Query
from datetime import datetime, timezone
from starlette import status
from database import db_dependency
from typing import Optional
from datetime import date
from database import db_dependency
import models
import schemas 
from .auth import user_dependency, checkValidUser, checkUserRoles
from services.geocoding import geocode


router = APIRouter(prefix="/tournament", tags=["tournament"])


@router.get("/", status_code=status.HTTP_200_OK)
def get_all_current_tournaments(user: user_dependency, db: db_dependency):
    checkValidUser(user)
    current_day = datetime.now(timezone.utc)
    upcoming_tournaments = (
        db.query(models.Tournament)
        .filter(models.Tournament.event_date >= current_day)
        .order_by(models.Tournament.event_date.asc())
        .all()
    )
    return upcoming_tournaments


@router.get("/range", status_code=status.HTTP_200_OK)
def get_tournaments_by_range(
    user: user_dependency,
    db: db_dependency,
    start: date = Query(...),
    end: Optional[date] = Query(default=None),
):
    checkValidUser(user)
    if end is not None and start > end:
        raise HTTPException(status_code=400, detail="start must be before end")

    if(start and end == None):
        query = db.query(models.Tournament).filter(models.Tournament.event_date >= start)
   
    if end is not None:
        query = query.filter(models.Tournament.event_date < end)

    return query.order_by(models.Tournament.event_date.asc()).all()

@router.get("/competing", status_code=status.HTTP_200_OK)
def get_competing_tournaments(user: user_dependency, db: db_dependency):
    checkValidUser(user)
    return (
        db.query(models.Tournament)
        .join(models.Registration, models.Registration.tournament_id == models.Tournament.id)
        .join(models.AthleteProfile, models.AthleteProfile.id == models.Registration.athlete_profile_id)
        .filter(models.AthleteProfile.user_id == user.id)
        .order_by(models.Tournament.event_date.asc())
        .all()
    )

@router.get("/managing", status_code=status.HTTP_200_OK)
def get_managed_tournaments(user: user_dependency, db: db_dependency):
    checkValidUser(user)
    return (
        db.query(models.Tournament)
        .join(models.Registration, models.Registration.tournament_id == models.Tournament.id)
        .filter(models.Registration.registered_by == user.id)
        .distinct()
        .order_by(models.Tournament.event_date.asc())
        .all()
    )

    
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_tournament(user: user_dependency, db: db_dependency, tournament: schemas.TournamentCreate):
    checkValidUser(user)
    checkUserRoles(user, ["organizer", "coach"], "You do not have permission to create tournaments")

    coords = geocode(tournament.location)
    if coords is None:
     raise HTTPException(status_code=422, detail="Could not locate that address")

    if models.UserRole.organizer not in user.roles:
        user.roles.append(models.UserRole.organizer)

    new_tournament = models.Tournament(
        organizer_id=user.id,
        latitude=coords.latitude,
        longitude=coords.longitude,
        **tournament.model_dump(),
    )
    
    db.add(new_tournament)
    db.commit()
    db.refresh(new_tournament)
    return new_tournament

@router.put('/{id}', status_code=status.HTTP_200_OK)
def update_tournament(id: str, user: user_dependency, db: db_dependency, tournament: schemas.TournamentUpdate):
    checkValidUser(user)
    checkUserRoles(user, ["organizer", "coach"], "You do not have permission to update tournaments")

    existing = db.query(models.Tournament).filter(models.Tournament.id == id).first()
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    if existing.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")

    for field, value in tournament.model_dump(exclude_unset=True).items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing

@router.delete('/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_tournament(id: str, user: user_dependency, db: db_dependency):
    checkValidUser(user)
    checkUserRoles(user, ["organizer", "coach"], "You do not have permission to update tournaments")

    tournament = db.query(models.Tournament).filter(models.Tournament.id == id).first()
    if tournament is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tournament not found")
    
    if tournament.organizer_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not your tournament")


    db.delete(tournament)
    db.commit()