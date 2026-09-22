import React, { useState } from 'react';
import { CoachingSession, FollowUpOutcome, FollowUpClosePayload, AckStatus } from '../types';
import { CheckCircle2, X, Bookmark, MessageSquare } from 'lucide-react';

interface FollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CoachingSession | null;
  onSubmit: (data: FollowUpClosePayload) => Promise<void>;
}

const FollowUpModal: React.FC<FollowUpModalProps> = ({ isOpen, onClose, session, onSubmit }) => {
  const [outcome, setOutcome] = useState<FollowUpOutcome | ''>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outcome) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit({
        follow_up_outcome: outcome as FollowUpOutcome,
        follow_up_notes: notes || undefined,
      });
      setOutcome('');
      setNotes('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Resolve Follow-Up</h2>
              <p className="text-xs text-slate-500">Coaching milestone resolution for <strong>{session.pilot_name}</strong></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pilot Context Summary */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 mb-6 space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-mono uppercase">Category</span>
            <span className="font-semibold text-indigo-700">{session.coaching_type}</span>
          </div>
          <div className="border-t border-slate-200 pt-2">
            <span className="text-slate-500 font-mono uppercase block mb-1">Pilot Commitment</span>
            <p className="text-slate-800 italic bg-white p-2.5 rounded-xl border border-slate-200">
              "{session.pilot_commitment || 'No commitment text registered'}"
            </p>
          </div>
          <div className="flex justify-between items-center text-slate-600 pt-1">
            <span>Acknowledgment:</span>
            <span className="font-semibold text-slate-800">
              {session.pilot_ack_status === AckStatus.UNDERSTOOD 
                ? 'Understood expectation' 
                : session.pilot_ack_status === AckStatus.NEEDS_CLARIFICATION 
                  ? 'Requested clarification' 
                  : 'N/A'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Bookmark className="w-3.5 h-3.5 text-indigo-600" /> Resolution Outcome
            </label>
            <select
              required
              value={outcome}
              onChange={(e) => setOutcome(e.target.value as FollowUpOutcome)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
            >
              <option value="" disabled className="text-slate-400">Select an outcome...</option>
              {Object.values(FollowUpOutcome).map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-600" /> Follow-Up Remarks & Audit Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-400"
              placeholder="e.g. Conducted observation on shift. 100% checklist adherence verified..."
            />
          </div>

          <div className="flex gap-3 pt-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!outcome || isSubmitting}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? 'Recording Closure...' : 'Close & Archive Session'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default FollowUpModal;
