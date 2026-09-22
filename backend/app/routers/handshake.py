from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import CoachingSession
from app.schemas import PilotCommitment, SessionResponse, StatusEnum

router = APIRouter(prefix="/api/handshake", tags=["handshake"])

@router.get("/{token}", response_model=SessionResponse)
def get_handshake_session(token: str, db: Session = Depends(get_db)):
    db_session = db.query(CoachingSession).filter(CoachingSession.pilot_token == token).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_session

@router.patch("/{token}/commit", response_model=SessionResponse)
def commit_handshake(token: str, commit_in: PilotCommitment, db: Session = Depends(get_db)):
    db_session = db.query(CoachingSession).filter(CoachingSession.pilot_token == token).first()
    if not db_session:
        raise HTTPException(status_code=404, detail="Session not found")
        
    if db_session.status != StatusEnum.PENDING_COMMITMENT.value:
        raise HTTPException(status_code=409, detail="Session is not in PENDING_COMMITMENT state")
        
    db_session.pilot_commitment = commit_in.pilot_commitment
    db_session.pilot_ack_status = commit_in.pilot_ack_status.value
    db_session.pilot_signed_at = datetime.now(timezone.utc)
    db_session.status = StatusEnum.ACTIVE_FOLLOW_UP.value
    
    db.commit()
    db.refresh(db_session)
    return db_session
