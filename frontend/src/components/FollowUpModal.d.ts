import React from 'react';
import { CoachingSession, FollowUpClosePayload } from '../types';
interface FollowUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: CoachingSession | null;
    onSubmit: (data: FollowUpClosePayload) => Promise<void>;
}
declare const FollowUpModal: React.FC<FollowUpModalProps>;
export default FollowUpModal;
//# sourceMappingURL=FollowUpModal.d.ts.map