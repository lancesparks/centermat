import uuid
from datetime import datetime
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    Numeric,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import  Mapped, mapped_column, relationship
from database import Base

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def gen_uuid() -> str:
    return str(uuid.uuid4())


# ---------------------------------------------------------------------------
# Enums
# ---------------------------------------------------------------------------

class UserRole(PyEnum):
    organizer = "organizer"
    athlete = "athlete"
    coach = "coach"
    event_staff = "event_staff"
    fan = "fan"


class TournamentStatus(PyEnum):
    draft = "draft"
    registration_open = "registration_open"
    registration_closed = "registration_closed"
    in_progress = "in_progress"
    completed = "completed"


class RegistrationStatus(PyEnum):
    pending = "pending"
    confirmed = "confirmed"
    withdrawn = "withdrawn"
    disqualified = "disqualified"


class PaymentStatus(PyEnum):
    unpaid = "unpaid"
    paid = "paid"
    refunded = "refunded"


class PaymentTxStatus(PyEnum):
    pending = "pending"
    succeeded = "succeeded"
    failed = "failed"
    refunded = "refunded"


class BracketFormat(PyEnum):
    single_elimination = "single_elimination"


class MatchStatus(PyEnum):
    scheduled = "scheduled"
    in_progress = "in_progress"
    completed = "completed"
    bye = "bye"


class WinCondition(PyEnum):
    decision = "decision"
    major_decision = "major_decision"
    tech_fall = "tech_fall"
    pin = "pin"
    forfeit = "forfeit"
    disqualification = "disqualification"


class StaffRole(PyEnum):
    event_staff = "event_staff"
    head_official = "head_official"


class NotificationType(PyEnum):
    match_called = "match_called"
    match_result = "match_result"
    bracket_published = "bracket_published"
    schedule_change = "schedule_change"
    announcement = "announcement"
    registration_reminder = "registration_reminder"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------

class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str | None] = mapped_column(String(20))
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # relationships
    organized_tournaments: Mapped[list["Tournament"]] = relationship(back_populates="organizer")
    coached_teams: Mapped[list["Team"]] = relationship(back_populates="coach")
    guardian_profiles: Mapped[list["AthleteProfile"]] = relationship(
        back_populates="guardian", foreign_keys="AthleteProfile.guardian_id"
    )
    own_profile: Mapped["AthleteProfile | None"] = relationship(
        back_populates="user", foreign_keys="AthleteProfile.user_id"
    )
    staff_assignments: Mapped[list["TournamentStaff"]] = relationship(back_populates="user")
    fan_follows: Mapped[list["FanFollow"]] = relationship(back_populates="user")


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    coach_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(150), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # relationships
    coach: Mapped["User"] = relationship(back_populates="coached_teams")
    athletes: Mapped[list["AthleteProfile"]] = relationship(back_populates="team")


class AthleteProfile(Base):
    __tablename__ = "athlete_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"), unique=True)
    guardian_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    team_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("teams.id"))
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    date_of_birth: Mapped[datetime | None] = mapped_column(DateTime)
    is_minor: Mapped[bool] = mapped_column(Boolean, default=False)

    # relationships
    user: Mapped["User | None"] = relationship(back_populates="own_profile", foreign_keys=[user_id])
    guardian: Mapped["User | None"] = relationship(back_populates="guardian_profiles", foreign_keys=[guardian_id])
    team: Mapped["Team | None"] = relationship(back_populates="athletes")
    registrations: Mapped[list["Registration"]] = relationship(back_populates="athlete_profile")
    fan_follows: Mapped[list["FanFollow"]] = relationship(back_populates="athlete_profile")


class Tournament(Base):
    __tablename__ = "tournaments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    organizer_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    event_date: Mapped[datetime | None] = mapped_column(DateTime)
    location: Mapped[str | None] = mapped_column(String(300))
    registration_opens: Mapped[datetime | None] = mapped_column(DateTime)
    registration_closes: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[TournamentStatus] = mapped_column(
        Enum(TournamentStatus), default=TournamentStatus.draft, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # relationships
    organizer: Mapped["User"] = relationship(back_populates="organized_tournaments")
    weight_classes: Mapped[list["WeightClass"]] = relationship(back_populates="tournament")
    registrations: Mapped[list["Registration"]] = relationship(back_populates="tournament")
    brackets: Mapped[list["Bracket"]] = relationship(back_populates="tournament")
    staff: Mapped[list["TournamentStaff"]] = relationship(back_populates="tournament")
    fan_follows: Mapped[list["FanFollow"]] = relationship(back_populates="tournament")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="tournament")


class WeightClass(Base):
    __tablename__ = "weight_classes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    tournament_id: Mapped[str] = mapped_column(String(36), ForeignKey("tournaments.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    max_weight_lbs: Mapped[float | None] = mapped_column(Numeric(5, 1))
    division: Mapped[str | None] = mapped_column(String(100))

    # relationships
    tournament: Mapped["Tournament"] = relationship(back_populates="weight_classes")
    registrations: Mapped[list["Registration"]] = relationship(back_populates="weight_class")


class Registration(Base):
    __tablename__ = "registrations"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    tournament_id: Mapped[str] = mapped_column(String(36), ForeignKey("tournaments.id"), nullable=False)
    athlete_profile_id: Mapped[str] = mapped_column(String(36), ForeignKey("athlete_profiles.id"), nullable=False)
    weight_class_id: Mapped[str] = mapped_column(String(36), ForeignKey("weight_classes.id"), nullable=False)
    registered_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    status: Mapped[RegistrationStatus] = mapped_column(
        Enum(RegistrationStatus), default=RegistrationStatus.pending, nullable=False
    )
    payment_status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus), default=PaymentStatus.unpaid, nullable=False
    )
    waiver_signed: Mapped[bool] = mapped_column(Boolean, default=False)
    waiver_signed_at: Mapped[datetime | None] = mapped_column(DateTime)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    __table_args__ = (
        UniqueConstraint("tournament_id", "athlete_profile_id", name="uq_registration_athlete_tournament"),
    )

    # relationships
    tournament: Mapped["Tournament"] = relationship(back_populates="registrations")
    athlete_profile: Mapped["AthleteProfile"] = relationship(back_populates="registrations")
    weight_class: Mapped["WeightClass"] = relationship(back_populates="registrations")
    payment: Mapped["Payment | None"] = relationship(back_populates="registration")


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    registration_id: Mapped[str] = mapped_column(
        String(36), ForeignKey("registrations.id"), unique=True, nullable=False
    )
    amount: Mapped[float] = mapped_column(Numeric(8, 2), nullable=False)
    status: Mapped[PaymentTxStatus] = mapped_column(
        Enum(PaymentTxStatus), default=PaymentTxStatus.pending, nullable=False
    )
    stripe_intent_id: Mapped[str | None] = mapped_column(String(255))
    paid_at: Mapped[datetime | None] = mapped_column(DateTime)

    # relationships
    registration: Mapped["Registration"] = relationship(back_populates="payment")


class Bracket(Base):
    __tablename__ = "brackets"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    tournament_id: Mapped[str] = mapped_column(String(36), ForeignKey("tournaments.id"), nullable=False)
    weight_class_id: Mapped[str] = mapped_column(String(36), ForeignKey("weight_classes.id"), nullable=False)
    format: Mapped[BracketFormat] = mapped_column(
        Enum(BracketFormat), default=BracketFormat.single_elimination, nullable=False
    )
    published: Mapped[bool] = mapped_column(Boolean, default=False)
    published_at: Mapped[datetime | None] = mapped_column(DateTime)

    # relationships
    tournament: Mapped["Tournament"] = relationship(back_populates="brackets")
    matches: Mapped[list["Match"]] = relationship(back_populates="bracket")


class Match(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    bracket_id: Mapped[str] = mapped_column(String(36), ForeignKey("brackets.id"), nullable=False)
    round_number: Mapped[int] = mapped_column(Integer, nullable=False)
    match_number: Mapped[int] = mapped_column(Integer, nullable=False)
    athlete_a_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("athlete_profiles.id"))
    athlete_b_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("athlete_profiles.id"))
    mat_number: Mapped[int | None] = mapped_column(Integer)
    scheduled_time: Mapped[datetime | None] = mapped_column(DateTime)
    status: Mapped[MatchStatus] = mapped_column(
        Enum(MatchStatus), default=MatchStatus.scheduled, nullable=False
    )
    # result fields — nullable until event staff enters them
    winner_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("athlete_profiles.id"))
    score_a: Mapped[int | None] = mapped_column(Integer)
    score_b: Mapped[int | None] = mapped_column(Integer)
    win_condition: Mapped[WinCondition | None] = mapped_column(Enum(WinCondition))
    result_entered_by: Mapped[str | None] = mapped_column(String(36), ForeignKey("users.id"))
    result_entered_at: Mapped[datetime | None] = mapped_column(DateTime)

    # relationships
    bracket: Mapped["Bracket"] = relationship(back_populates="matches")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="match")


class TournamentStaff(Base):
    __tablename__ = "tournament_staff"

    tournament_id: Mapped[str] = mapped_column(String(36), ForeignKey("tournaments.id"), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), primary_key=True)
    role: Mapped[StaffRole] = mapped_column(Enum(StaffRole), nullable=False)

    # relationships
    tournament: Mapped["Tournament"] = relationship(back_populates="staff")
    user: Mapped["User"] = relationship(back_populates="staff_assignments")


class FanFollow(Base):
    __tablename__ = "fan_follows"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    tournament_id: Mapped[str] = mapped_column(String(36), ForeignKey("tournaments.id"), nullable=False)
    athlete_profile_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("athlete_profiles.id"))

    __table_args__ = (
        UniqueConstraint("user_id", "tournament_id", "athlete_profile_id", name="uq_fan_follow"),
    )

    # relationships
    user: Mapped["User"] = relationship(back_populates="fan_follows")
    tournament: Mapped["Tournament"] = relationship(back_populates="fan_follows")
    athlete_profile: Mapped["AthleteProfile | None"] = relationship(back_populates="fan_follows")


class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=gen_uuid)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), nullable=False)
    tournament_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("tournaments.id"))
    match_id: Mapped[str | None] = mapped_column(String(36), ForeignKey("matches.id"))
    type: Mapped[NotificationType] = mapped_column(Enum(NotificationType), nullable=False)
    body: Mapped[str] = mapped_column(String(500), nullable=False)
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    sent_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    # relationships
    tournament: Mapped["Tournament | None"] = relationship(back_populates="notifications")
    match: Mapped["Match | None"] = relationship(back_populates="notifications")