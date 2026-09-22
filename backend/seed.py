import sys
import os
from datetime import datetime, timedelta, date, timezone

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, Base, SessionLocal
from app.models import CoachingSession
from app.schemas import (
    StatusEnum, ShiftEnum, CoachingTypeEnum, RecurrenceEnum, 
    RootCauseTypeEnum, ActionOwnerEnum, AckStatusEnum, FollowUpOutcomeEnum
)

def seed():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(CoachingSession).count() > 0:
            print("Database already seeded!")
            return

        print("Seeding records...")
        
        # 1. PENDING_COMMITMENT
        session1 = CoachingSession(
            status=StatusEnum.PENDING_COMMITMENT.value,
            pilot_name="Alex Rivera",
            pilot_email="arivera@example.com",
            leader_name="Sarah Connor",
            shift=ShiftEnum.MORNING.value,
            site="NYC-1",
            coaching_type=CoachingTypeEnum.PERFORMANCE.value,
            what_happened="Fell below quota twice this week.",
            correct_expectation="Maintain at least 95% quota.",
            is_recurrent=RecurrenceEnum.NO.value,
            root_cause_type=RootCauseTypeEnum.SKILL.value,
            root_cause_details="New to the system.",
            action_plan_steps="1. Review docs. 2. Shadow senior.",
            action_owner=ActionOwnerEnum.PILOT.value,
            follow_up_required=True,
            follow_up_date=date.today() + timedelta(days=7)
        )
        
        # 2. PENDING_COMMITMENT
        session2 = CoachingSession(
            status=StatusEnum.PENDING_COMMITMENT.value,
            pilot_name="Jordan Chen",
            pilot_email="jchen@example.com",
            leader_name="Mike Vance",
            shift=ShiftEnum.NIGHT.value,
            site="LAX-2",
            coaching_type=CoachingTypeEnum.ATTENDANCE.value,
            what_happened="Late to shift 3 times.",
            correct_expectation="Arrive 5 mins prior to shift.",
            is_recurrent=RecurrenceEnum.YES.value,
            root_cause_type=RootCauseTypeEnum.WILL.value,
            root_cause_details="Oversleeping.",
            action_plan_steps="1. Set multiple alarms.",
            action_owner=ActionOwnerEnum.PILOT.value,
            follow_up_required=False
        )

        # 3. ACTIVE_FOLLOW_UP (overdue)
        session3 = CoachingSession(
            status=StatusEnum.ACTIVE_FOLLOW_UP.value,
            pilot_name="Taylor Smith",
            pilot_email="tsmith@example.com",
            leader_name="Sarah Connor",
            shift=ShiftEnum.AFTERNOON.value,
            site="NYC-1",
            coaching_type=CoachingTypeEnum.QUALITY.value,
            what_happened="Missed critical QA step.",
            correct_expectation="Follow QA checklist step by step.",
            is_recurrent=RecurrenceEnum.NO.value,
            root_cause_type=RootCauseTypeEnum.KNOWLEDGE.value,
            root_cause_details="Didn't know checklist was updated.",
            action_plan_steps="1. Read updated checklist.",
            action_owner=ActionOwnerEnum.TRAINING.value,
            follow_up_required=True,
            follow_up_date=date.today() - timedelta(days=2),
            pilot_commitment="I will read the checklist.",
            pilot_ack_status=AckStatusEnum.UNDERSTOOD.value,
            pilot_signed_at=datetime.now(timezone.utc) - timedelta(days=5)
        )

        # 4. ACTIVE_FOLLOW_UP (today)
        session4 = CoachingSession(
            status=StatusEnum.ACTIVE_FOLLOW_UP.value,
            pilot_name="Casey Jones",
            pilot_email="cjones@example.com",
            leader_name="Mike Vance",
            shift=ShiftEnum.MORNING.value,
            site="LAX-2",
            coaching_type=CoachingTypeEnum.SAFETY.value,
            what_happened="Not wearing safety vest in zone.",
            correct_expectation="Always wear vest in red zones.",
            is_recurrent=RecurrenceEnum.UNKNOWN.value,
            root_cause_type=RootCauseTypeEnum.SKILL.value,
            root_cause_details="Forgot to grab it.",
            action_plan_steps="1. Leader to remind team.",
            action_owner=ActionOwnerEnum.LEADER.value,
            follow_up_required=True,
            follow_up_date=date.today(),
            pilot_commitment="Understood, I will wear my vest.",
            pilot_ack_status=AckStatusEnum.UNDERSTOOD.value,
            pilot_signed_at=datetime.now(timezone.utc) - timedelta(days=2)
        )

        # 5. CLOSED
        session5 = CoachingSession(
            status=StatusEnum.CLOSED.value,
            pilot_name="Morgan Freeman",
            pilot_email="mfreeman@example.com",
            leader_name="Sarah Connor",
            shift=ShiftEnum.NIGHT.value,
            site="NYC-1",
            coaching_type=CoachingTypeEnum.PROCESS.value,
            what_happened="Skipped verification step.",
            correct_expectation="Verify before submitting.",
            is_recurrent=RecurrenceEnum.NO.value,
            root_cause_type=RootCauseTypeEnum.KNOWLEDGE.value,
            root_cause_details="Unaware of verification rule.",
            action_plan_steps="1. Review SOP.",
            action_owner=ActionOwnerEnum.PILOT.value,
            follow_up_required=True,
            follow_up_date=date.today() - timedelta(days=10),
            pilot_commitment="I have reviewed the SOP.",
            pilot_ack_status=AckStatusEnum.UNDERSTOOD.value,
            pilot_signed_at=datetime.now(timezone.utc) - timedelta(days=15),
            closed_at=datetime.now(timezone.utc) - timedelta(days=5),
            follow_up_outcome=FollowUpOutcomeEnum.SUSTAINED.value,
            follow_up_notes="Pilot has consistently verified for past 2 weeks."
        )

        # 6. CLOSED
        session6 = CoachingSession(
            status=StatusEnum.CLOSED.value,
            pilot_name="Sam Williams",
            pilot_email="swilliams@example.com",
            leader_name="Mike Vance",
            shift=ShiftEnum.AFTERNOON.value,
            site="LAX-2",
            coaching_type=CoachingTypeEnum.BEHAVIOR.value,
            what_happened="Argued with teammate.",
            correct_expectation="Maintain professional behavior.",
            is_recurrent=RecurrenceEnum.YES.value,
            root_cause_type=RootCauseTypeEnum.WILL.value,
            root_cause_details="Anger management.",
            action_plan_steps="1. Take a break when frustrated.",
            action_owner=ActionOwnerEnum.PILOT.value,
            follow_up_required=True,
            follow_up_date=date.today() - timedelta(days=1),
            pilot_commitment="I will be professional.",
            pilot_ack_status=AckStatusEnum.UNDERSTOOD.value,
            pilot_signed_at=datetime.now(timezone.utc) - timedelta(days=7),
            closed_at=datetime.now(timezone.utc),
            follow_up_outcome=FollowUpOutcomeEnum.ADDITIONAL_TRAINING.value,
            follow_up_notes="Teammates reported another incident. Need HR training."
        )
        
        db.add_all([session1, session2, session3, session4, session5, session6])
        db.commit()
        
        print("Successfully created 6 records!")
        
    finally:
        db.close()

if __name__ == "__main__":
    seed()
