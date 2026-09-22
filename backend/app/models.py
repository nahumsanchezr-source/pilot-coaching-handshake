import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Date, DateTime
from app.database import Base

class CoachingSession(Base):
    __tablename__ = "coaching_sessions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    status = Column(String(30), default='PENDING_COMMITMENT')
    pilot_name = Column(String(200), nullable=False)
    pilot_email = Column(String(200), nullable=False)
    leader_name = Column(String(200), nullable=False)
    shift = Column(String(20), nullable=False)
    site = Column(String(200), nullable=False)
    coaching_type = Column(String(30), nullable=False)
    what_happened = Column(Text, nullable=False)
    correct_expectation = Column(Text, nullable=False)
    is_recurrent = Column(String(10), nullable=False)
    root_cause_type = Column(String(20), nullable=False)
    root_cause_details = Column(Text, nullable=False)
    action_plan_steps = Column(Text, nullable=False)
    action_owner = Column(String(20), nullable=False)
    follow_up_required = Column(Boolean, nullable=False)
    follow_up_date = Column(Date, nullable=True)
    pilot_token = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()))
    pilot_commitment = Column(Text, nullable=True)
    pilot_ack_status = Column(String(30), nullable=True)
    pilot_signed_at = Column(DateTime, nullable=True)
    follow_up_outcome = Column(String(50), nullable=True)
    follow_up_notes = Column(Text, nullable=True)
    closed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
