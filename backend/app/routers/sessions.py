from datetime import datetime, timezone
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CoachingSession
from app.schemas import SessionCreate, SessionResponse, FollowUpClose, StatusEnum

router = APIRouter(prefix="/api/sessions", tags=["sessions"])

@router.post("/", response_model=SessionResponse, status_code=status.HTTP_201_CREATED)
def create_session(session_in: SessionCreate, db: Session = Depends(get_db)):
    db_session = CoachingSession(
        **session_in.model_dump(exclude_none=True),
        status=StatusEnum.PENDING_COMMITMENT.value
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

@router.get("/", response_model=List[SessionResponse])
def list_sessions(status: Optional[StatusEnum] = None, db: Session = Depends(get_db)):
    query = db.query(CoachingSession)
    if status:
        query = query.filter(CoachingSession.status == status.value)
    return query.order_by(CoachingSession.created_at.desc()).all()

@router.get("/{session_id}", response_model=SessionResponse)
def get_session(session_id: str, db: Session = Depends(get_db)):
    db_session = db.query(CoachingSession).filter(CoachingSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session

@router.patch("/{session_id}/close", response_model=SessionResponse)
def close_session(session_id: str, close_in: FollowUpClose, db: Session = Depends(get_db)):
    db_session = db.query(CoachingSession).filter(CoachingSession.id == session_id).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    if db_session.status != StatusEnum.ACTIVE_FOLLOW_UP.value:
        raise HTTPException(status_code=409, detail="Session is not in ACTIVE_FOLLOW_UP state")
    
    current_utc_date = datetime.now(timezone.utc).date()
    if db_session.follow_up_date and db_session.follow_up_date > current_utc_date:
        raise HTTPException(status_code=422, detail="Cannot close before the scheduled follow-up date")
        
    db_session.status = StatusEnum.CLOSED.value
    db_session.closed_at = datetime.now(timezone.utc)
    db_session.follow_up_outcome = close_in.follow_up_outcome.value
    db_session.follow_up_notes = close_in.follow_up_notes
    
    db.commit()
    db.refresh(db_session)
    return db_session
