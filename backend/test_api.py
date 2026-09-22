import sys
import os
from datetime import date, timedelta
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app
from app.schemas import (
    ShiftEnum, CoachingTypeEnum, RecurrenceEnum, 
    RootCauseTypeEnum, ActionOwnerEnum, AckStatusEnum, FollowUpOutcomeEnum
)

client = TestClient(app)

def test_full_workflow():
    print("1. Testing GET /api/sessions (listing)...")
    res = client.get("/api/sessions")
    assert res.status_code == 200, f"Expected 200, got {res.status_code}: {res.text}"
    sessions = res.json()
    print(f"   Found {len(sessions)} existing sessions.")
    assert len(sessions) >= 6, f"Expected at least 6 seeded sessions, got {len(sessions)}"

    print("2. Testing POST /api/sessions (Leader diagnostic creation)...")
    new_payload = {
        "pilot_name": "Elena Rostova",
        "pilot_email": "erostova@skyfleet.io",
        "leader_name": "Marcus Vance",
        "shift": ShiftEnum.MORNING.value,
        "site": "SEA-Tactical-1",
        "coaching_type": CoachingTypeEnum.PROCESS.value,
        "what_happened": "Deviated from standard pre-flight checklist protocol at waypoint delta.",
        "correct_expectation": "Adhere strictly to procedural step checklist without skipping checklist callouts.",
        "is_recurrent": RecurrenceEnum.NO.value,
        "root_cause_type": RootCauseTypeEnum.KNOWLEDGE.value,
        "root_cause_details": "Unaware of revised SOP v4 bulletin issued last week.",
        "action_plan_steps": "Review updated checklist documentation and complete verification audit.",
        "action_owner": ActionOwnerEnum.PILOT.value,
        "follow_up_required": True,
        "follow_up_date": (date.today() - timedelta(days=1)).isoformat()  # set to past so closing test passes
    }
    create_res = client.post("/api/sessions", json=new_payload)
    assert create_res.status_code == 201, f"Create failed: {create_res.text}"
    session_data = create_res.json()
    session_id = session_data["id"]
    token = session_data["pilot_token"]
    assert session_data["status"] == "PENDING_COMMITMENT"
    print(f"   Created session ID: {session_id}, pilot_token: {token}")

    print("3. Testing GET /api/handshake/{token} (Pilot Portal access)...")
    portal_res = client.get(f"/api/handshake/{token}")
    assert portal_res.status_code == 200
    portal_data = portal_res.json()
    assert portal_data["id"] == session_id
    assert portal_data["pilot_commitment"] is None
    print("   Pilot retrieved session data successfully.")

    print("4. Testing PATCH /api/handshake/{token}/commit (Pilot Handshake commitment)...")
    commit_payload = {
        "pilot_commitment": "Starting today, I commit to reviewing the daily bulletin and following all pre-flight callouts.",
        "pilot_ack_status": AckStatusEnum.UNDERSTOOD.value
    }
    commit_res = client.patch(f"/api/handshake/{token}/commit", json=commit_payload)
    assert commit_res.status_code == 200, f"Commit failed: {commit_res.text}"
    committed_data = commit_res.json()
    assert committed_data["status"] == "ACTIVE_FOLLOW_UP"
    assert committed_data["pilot_commitment"] == commit_payload["pilot_commitment"]
    assert committed_data["pilot_signed_at"] is not None
    print("   Pilot commitment sealed. Status transitioned to ACTIVE_FOLLOW_UP.")

    print("5. Testing state machine guard: pilot cannot commit twice (409 expected)...")
    double_commit = client.patch(f"/api/handshake/{token}/commit", json=commit_payload)
    assert double_commit.status_code == 409
    print("   State guard passed: 409 Conflict properly returned.")

    print("6. Testing PATCH /api/sessions/{id}/close (Leader Follow-Up Resolution)...")
    close_payload = {
        "follow_up_outcome": FollowUpOutcomeEnum.SUSTAINED.value,
        "follow_up_notes": "Follow-up audit confirmed 100% adherence over the past shifts. Excellent diligence."
    }
    close_res = client.patch(f"/api/sessions/{session_id}/close", json=close_payload)
    assert close_res.status_code == 200, f"Close failed: {close_res.text}"
    closed_data = close_res.json()
    assert closed_data["status"] == "CLOSED"
    assert closed_data["closed_at"] is not None
    assert closed_data["follow_up_outcome"] == FollowUpOutcomeEnum.SUSTAINED.value
    print("   Leader resolution closed session. Status transitioned to CLOSED.")

    print("7. Testing state machine guard: cannot close already CLOSED session (409 expected)...")
    double_close = client.patch(f"/api/sessions/{session_id}/close", json=close_payload)
    assert double_close.status_code == 409
    print("   State guard passed: 409 Conflict returned.")

    print("\nALL BACKEND API & STATE MACHINE WORKFLOW TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_full_workflow()
