from datetime import date, datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field, EmailStr, model_validator

class StatusEnum(str, Enum):
    PENDING_COMMITMENT = 'PENDING_COMMITMENT'
    ACTIVE_FOLLOW_UP = 'ACTIVE_FOLLOW_UP'
    CLOSED = 'CLOSED'

class ShiftEnum(str, Enum):
    MORNING = 'Morning'
    AFTERNOON = 'Afternoon'
    NIGHT = 'Night'

class CoachingTypeEnum(str, Enum):
    PERFORMANCE = 'Performance'
    QUALITY = 'Quality'
    PROCESS = 'Process'
    ATTENDANCE = 'Attendance'
    SAFETY = 'Safety'
    BEHAVIOR = 'Behavior'
    OTHER = 'Other'

class RecurrenceEnum(str, Enum):
    YES = 'Yes'
    NO = 'No'
    UNKNOWN = 'Unknown'

class RootCauseTypeEnum(str, Enum):
    SKILL = 'Skill'
    KNOWLEDGE = 'Knowledge'
    WILL = 'Will'

class ActionOwnerEnum(str, Enum):
    PILOT = 'Pilot'
    LEADER = 'Leader'
    TRAINING = 'Training'
    OPERATIONS = 'Operations'
    OTHER = 'Other'

class AckStatusEnum(str, Enum):
    UNDERSTOOD = 'understood'
    NEEDS_CLARIFICATION = 'needs_clarification'

class FollowUpOutcomeEnum(str, Enum):
    SUSTAINED = 'Corrected / Sustained improvement'
    IMPROVING = 'Improving'
    NO_IMPROVEMENT = 'No improvement'
    RECURRENCE = 'Recurrence'
    ADDITIONAL_TRAINING = 'Additional training required'
    ESCALATION = 'Escalation required'

class SessionCreate(BaseModel):
    pilot_name: str
    pilot_email: EmailStr
    leader_name: str
    shift: ShiftEnum
    site: str
    coaching_type: CoachingTypeEnum
    what_happened: str
    correct_expectation: str
    is_recurrent: RecurrenceEnum
    root_cause_type: RootCauseTypeEnum
    root_cause_details: str
    action_plan_steps: str
    action_owner: ActionOwnerEnum
    follow_up_required: bool
    follow_up_date: Optional[date] = None

    @model_validator(mode='after')
    def validate_follow_up_date(self) -> 'SessionCreate':
        if self.follow_up_required and not self.follow_up_date:
            raise ValueError("follow_up_date is required when follow_up_required is True")
        return self

class PilotCommitment(BaseModel):
    pilot_commitment: str = Field(min_length=1)
    pilot_ack_status: AckStatusEnum

class FollowUpClose(BaseModel):
    follow_up_outcome: FollowUpOutcomeEnum
    follow_up_notes: Optional[str] = None

class SessionResponse(BaseModel):
    id: str
    status: StatusEnum
    pilot_name: str
    pilot_email: str
    leader_name: str
    shift: ShiftEnum
    site: str
    coaching_type: CoachingTypeEnum
    what_happened: str
    correct_expectation: str
    is_recurrent: RecurrenceEnum
    root_cause_type: RootCauseTypeEnum
    root_cause_details: str
    action_plan_steps: str
    action_owner: ActionOwnerEnum
    follow_up_required: bool
    follow_up_date: Optional[date] = None
    pilot_token: str
    pilot_commitment: Optional[str] = None
    pilot_ack_status: Optional[AckStatusEnum] = None
    pilot_signed_at: Optional[datetime] = None
    follow_up_outcome: Optional[FollowUpOutcomeEnum] = None
    follow_up_notes: Optional[str] = None
    closed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
