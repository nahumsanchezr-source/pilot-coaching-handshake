import type { CoachingSession, SessionCreatePayload, PilotCommitmentPayload, FollowUpClosePayload, Status } from '../types';
export declare const createSession: (data: SessionCreatePayload) => Promise<import("axios").AxiosResponse<CoachingSession, any, {}, any>>;
export declare const listSessions: (status?: Status) => Promise<import("axios").AxiosResponse<CoachingSession[], any, {}, any>>;
export declare const getSession: (id: string) => Promise<import("axios").AxiosResponse<CoachingSession, any, {}, any>>;
export declare const closeSession: (id: string, data: FollowUpClosePayload) => Promise<import("axios").AxiosResponse<CoachingSession, any, {}, any>>;
export declare const getHandshake: (token: string) => Promise<import("axios").AxiosResponse<CoachingSession, any, {}, any>>;
export declare const submitCommitment: (token: string, data: PilotCommitmentPayload) => Promise<import("axios").AxiosResponse<CoachingSession, any, {}, any>>;
//# sourceMappingURL=client.d.ts.map