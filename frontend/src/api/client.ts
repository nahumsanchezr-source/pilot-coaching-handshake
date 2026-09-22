import axios from 'axios';
import type { CoachingSession, SessionCreatePayload, PilotCommitmentPayload, FollowUpClosePayload, Status } from '../types';

let rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Handle cases where VITE_API_URL is just the hostname (e.g. from Render property: host)
if (rawBaseURL && !rawBaseURL.startsWith('http://') && !rawBaseURL.startsWith('https://') && !rawBaseURL.startsWith('/')) {
  rawBaseURL = `https://${rawBaseURL}`;
}

const baseURL = rawBaseURL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createSession = (data: SessionCreatePayload) =>
  api.post<CoachingSession>('/api/sessions', data);

export const listSessions = (status?: Status) =>
  api.get<CoachingSession[]>('/api/sessions', { params: status ? { status } : {} });

export const getSession = (id: string) =>
  api.get<CoachingSession>(`/api/sessions/${id}`);

export const closeSession = (id: string, data: FollowUpClosePayload) =>
  api.patch<CoachingSession>(`/api/sessions/${id}/close`, data);

export const getHandshake = (token: string) =>
  api.get<CoachingSession>(`/api/handshake/${token}`);

export const submitCommitment = (token: string, data: PilotCommitmentPayload) =>
  api.patch<CoachingSession>(`/api/handshake/${token}/commit`, data);
