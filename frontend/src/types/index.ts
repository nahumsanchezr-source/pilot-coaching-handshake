export enum Status {
  PENDING_COMMITMENT = 'PENDING_COMMITMENT',
  ACTIVE_FOLLOW_UP = 'ACTIVE_FOLLOW_UP',
  CLOSED = 'CLOSED',
}

export enum Shift {
  MORNING = 'Morning',
  AFTERNOON = 'Afternoon',
  NIGHT = 'Night',
}

export enum CoachingType {
  PERFORMANCE = 'Performance',
  QUALITY = 'Quality',
  PROCESS = 'Process',
  ATTENDANCE = 'Attendance',
  SAFETY = 'Safety',
  BEHAVIOR = 'Behavior',
  OTHER = 'Other',
}

export enum Recurrence {
  YES = 'Yes',
  NO = 'No',
  UNKNOWN = 'Unknown',
}

export enum RootCauseType {
  SKILL = 'Skill',
  KNOWLEDGE = 'Knowledge',
  WILL = 'Will',
}

export enum ActionOwner {
  PILOT = 'Pilot',
  LEADER = 'Leader',
  TRAINING = 'Training',
  OPERATIONS = 'Operations',
  OTHER = 'Other',
}

export enum AckStatus {
  UNDERSTOOD = 'understood',
  NEEDS_CLARIFICATION = 'needs_clarification',
}

export enum FollowUpOutcome {
  SUSTAINED = 'Corrected / Sustained improvement',
  IMPROVING = 'Improving',
  NO_IMPROVEMENT = 'No improvement',
  RECURRENCE = 'Recurrence',
  ADDITIONAL_TRAINING = 'Additional training required',
  ESCALATION = 'Escalation required',
}

export interface CoachingSession {
  id: string;
  status: Status;
  pilot_name: string;
  pilot_email: string;
  leader_name: string;
  shift: Shift;
  site: string;
  coaching_type: CoachingType;
  what_happened: string;
  correct_expectation: string;
  is_recurrent: Recurrence;
  root_cause_type: RootCauseType;
  root_cause_details: string;
  action_plan_steps: string;
  action_owner: ActionOwner;
  follow_up_required: boolean;
  follow_up_date: string | null;
  pilot_token: string;
  pilot_commitment: string | null;
  pilot_ack_status: AckStatus | null;
  pilot_signed_at: string | null;
  follow_up_outcome: FollowUpOutcome | null;
  follow_up_notes: string | null;
  closed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionCreatePayload {
  pilot_name: string;
  pilot_email: string;
  leader_name: string;
  shift: Shift;
  site: string;
  coaching_type: CoachingType;
  what_happened: string;
  correct_expectation: string;
  is_recurrent: Recurrence;
  root_cause_type: RootCauseType;
  root_cause_details: string;
  action_plan_steps: string;
  action_owner: ActionOwner;
  follow_up_required: boolean;
  follow_up_date?: string | null;
}

export interface PilotCommitmentPayload {
  pilot_commitment: string;
  pilot_ack_status: AckStatus;
}

export interface FollowUpClosePayload {
  follow_up_outcome: FollowUpOutcome;
  follow_up_notes?: string;
}
