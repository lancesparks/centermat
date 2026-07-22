from datetime import date, datetime
from enum import Enum as PyEnum
from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator, Field

class UserRole(str, PyEnum):
    organizer = "organizer"
    athlete = "athlete"
    coach = "coach"
    event_staff = "event_staff"
    fan = "fan"


class TournamentStatus(str, PyEnum):
    draft = "draft"
    registration_open = "registration_open"
    registration_closed = "registration_closed"
    in_progress = "in_progress"
    completed = "completed"


class RegistrationStatus(str, PyEnum):
    pending = "pending"
    confirmed = "confirmed"
    withdrawn = "withdrawn"
    disqualified = "disqualified"


class PaymentStatus(str, PyEnum):
    unpaid = "unpaid"
    paid = "paid"
    refunded = "refunded"


class PaymentTxStatus(str, PyEnum):
    pending = "pending"
    succeeded = "succeeded"
    failed = "failed"
    refunded = "refunded"


class BracketFormat(str, PyEnum):
    single_elimination = "single_elimination"
    double_elimination = "double_elimination"
    round_robin = "round_robin"


class MatchStatus(str, PyEnum):
    scheduled = "scheduled"
    in_progress = "in_progress"
    completed = "completed"
    bye = "bye"


class WinCondition(str, PyEnum):
    decision = "decision"
    major_decision = "major_decision"
    tech_fall = "tech_fall"
    pin = "pin"
    forfeit = "forfeit"
    disqualification = "disqualification"


class StaffRole(str, PyEnum):
    event_staff = "event_staff"
    head_official = "head_official"


class NotificationType(str, PyEnum):
    match_called = "match_called"
    match_result = "match_result"
    bracket_published = "bracket_published"
    schedule_change = "schedule_change"
    announcement = "announcement"
    registration_reminder = "registration_reminder"

class WeightType(str, PyEnum):
    lbs = "lbs"
    kg = "kg"



# ---------------------------------------------------------------------------
# Auth
# ---------------------------------------------------------------------------

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    user_id: Optional[str] = None

class RefreshRequest(BaseModel):
    refresh_token: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr  # Automatically validates that the string is a valid email structure

class ResetPasswordSubmit(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

# ---------------------------------------------------------------------------
# User
# ---------------------------------------------------------------------------

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    email: EmailStr
    phone: Optional[str] = None
    roles: list[UserRole]
    password: str = Field(min_length=6)
    @field_validator("date_of_birth")
    @classmethod
    def dob_must_be_valid(cls, v: date) -> date:
        today = date.today()
        if v > today:
            raise ValueError("Date of birth cannot be in the future.")
        age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
        if age > 99:
            raise ValueError("Date of birth is not valid.")
        if age < 13:
            raise ValueError("You must be at least 13 to create an account.")
        return v

    @field_validator("password")
    @classmethod
    def password_within_bcrypt_limit(cls, v: str) -> str:
        if len(v.encode("utf-8")) > 72:
            raise ValueError("Password is too long.")
        return v


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    roles: Optional[list[UserRole]] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    email: str
    first_name: str
    last_name: str
    date_of_birth: date
    roles: list[UserRole]
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Athlete Profile
# ---------------------------------------------------------------------------

class AthleteProfileCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: Optional[datetime] = None
    is_minor: bool = False
    guardian_id: Optional[str] = None
    team_id: Optional[str] = None


class AthleteProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    team_id: Optional[str] = None


class AthleteProfileResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    guardian_id: Optional[str] = None
    team_id: Optional[str] = None
    first_name: str
    last_name: str
    date_of_birth: Optional[datetime] = None
    is_minor: bool

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Team
# ---------------------------------------------------------------------------

class TeamCreate(BaseModel):
    name: str


class TeamUpdate(BaseModel):
    name: Optional[str] = None


class TeamResponse(BaseModel):
    id: str
    coach_id: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class TeamWithRosterResponse(TeamResponse):
    athletes: list[AthleteProfileResponse] = []

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Tournament
# ---------------------------------------------------------------------------

class TournamentCreate(BaseModel):
    name: str
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    registration_opens: Optional[datetime] = None
    registration_closes: Optional[datetime] = None


class TournamentUpdate(BaseModel):
    name: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    registration_opens: Optional[datetime] = None
    registration_closes: Optional[datetime] = None
    status: Optional[TournamentStatus] = None


class TournamentResponse(BaseModel):
    id: str
    organizer_id: str
    name: str
    event_date: Optional[datetime] = None
    location: Optional[str] = None
    registration_opens: Optional[datetime] = None
    registration_closes: Optional[datetime] = None
    status: TournamentStatus
    created_at: datetime

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Weight Class
# ---------------------------------------------------------------------------

class WeightClassCreate(BaseModel):
    name: str
    sport: str
    max_weight_lb: Optional[float] = None
    min_weight_lb: Optional[float] = None
    max_weight_kg: Optional[float] = None
    min_weight_lg: Optional[float] = None
    division: Optional[str] = None


class WeightClassUpdate(BaseModel):
    name: Optional[str] = None
    sport:  Optional[str] = None
    max_weight_lb: Optional[float] = None
    min_weight_lb: Optional[float] = None
    max_weight_kg: Optional[float] = None
    min_weight_kg: Optional[float] = None
    division: Optional[str] = None



class WeightClassResponse(BaseModel):
    id: str
    tournament_id: str
    name: str
    max_weight_lb: Optional[float] = None
    min_weight_lb: Optional[float] = None
    max_weight_kg: Optional[float] = None
    min_weight_kg: Optional[float] = None
    division: Optional[str] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Registration
# ---------------------------------------------------------------------------

class RegistrationCreate(BaseModel):
    tournament_id: str
    athlete_profile_id: str
    weight_class_id: str


class RegistrationUpdate(BaseModel):
    weight_class_id: Optional[str] = None
    status: Optional[RegistrationStatus] = None


class WaiverSign(BaseModel):
    signed: bool


class RegistrationResponse(BaseModel):
    id: str
    tournament_id: str
    athlete_profile_id: str
    weight_class_id: str
    registered_by: Optional[str] = None
    status: RegistrationStatus
    payment_status: PaymentStatus
    waiver_signed: bool
    waiver_signed_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class RegistrationWithDetailsResponse(RegistrationResponse):
    athlete_profile: AthleteProfileResponse
    weight_class: WeightClassResponse

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Payment
# ---------------------------------------------------------------------------

class PaymentCreate(BaseModel):
    registration_id: str
    amount: float


class PaymentResponse(BaseModel):
    id: str
    registration_id: str
    amount: float
    status: PaymentTxStatus
    stripe_intent_id: Optional[str] = None
    paid_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Bracket
# ---------------------------------------------------------------------------

class BracketCreate(BaseModel):
    published: bool = False
    format: BracketFormat = BracketFormat.single_elimination


class BracketResponse(BaseModel):
    id: str
    tournament_id: str
    weight_class_id: str
    format: BracketFormat
    published: bool
    published_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Match
# ---------------------------------------------------------------------------

class MatchUpdate(BaseModel):
    bracket_id:str
    round_number: Optional[int] = None
    match_number: Optional[int] = None
    mat_number: Optional[int] = None
    athlete_a_id: Optional[str] = None
    athlete_b_id: Optional[str] = None


class MatchResultCreate(BaseModel):
    winner_id: str
    score_a: int
    score_b: int
    win_condition: WinCondition

class MatchCreate(BaseModel):
    bracket_id:str
    round_number: int = 1
    match_number: int
    mat_number: Optional[int] = None
    athlete_a_id: Optional[str] = None
    athlete_b_id: Optional[str] = None

class MatchResponse(BaseModel):
    id: str
    bracket_id: str
    round_number: int
    match_number: int
    athlete_a_id: Optional[str] = None
    athlete_b_id: Optional[str] = None
    mat_number: Optional[int] = None
    scheduled_time: Optional[datetime] = None
    status: MatchStatus
    winner_id: Optional[str] = None
    score_a: Optional[int] = None
    score_b: Optional[int] = None
    win_condition: Optional[WinCondition] = None
    result_entered_by: Optional[str] = None
    result_entered_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Tournament Staff
# ---------------------------------------------------------------------------

class TournamentStaffCreate(BaseModel):
    user_id: str
    role: StaffRole


class TournamentStaffResponse(BaseModel):
    tournament_id: str
    user_id: str
    role: StaffRole

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Fan Follow
# ---------------------------------------------------------------------------

class FanFollowCreate(BaseModel):
    tournament_id: str
    athlete_profile_id: Optional[str] = None


class FanFollowResponse(BaseModel):
    id: str
    user_id: str
    tournament_id: str
    athlete_profile_id: Optional[str] = None

    class Config:
        from_attributes = True


# ---------------------------------------------------------------------------
# Notification
# ---------------------------------------------------------------------------

class NotificationResponse(BaseModel):
    id: str
    user_id: str
    tournament_id: Optional[str] = None
    match_id: Optional[str] = None
    type: NotificationType
    body: str
    read: bool
    sent_at: datetime

    class Config:
        from_attributes = True


class NotificationMarkRead(BaseModel):
    read: bool = True