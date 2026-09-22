import React from 'react';
import { 
  X, 
  FileText, 
  Calendar, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  ShieldCheck, 
  Tag, 
  MapPin, 
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { CoachingSession, Status, AckStatus } from '../types';
import StatusBadge from './StatusBadge';

interface SessionDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: CoachingSession | null;
}

const SessionDetailsModal: React.FC<SessionDetailsModalProps> = ({ isOpen, onClose, session }) => {
  if (!isOpen || !session) return null;

  const handshakeUrl = `${window.location.origin}/handshake/${session.pilot_token}`;
  const initial = session.pilot_name ? session.pilot_name.charAt(0).toUpperCase() : 'P';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl shadow-2xl max-w-5xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Dossier Header */}
        <div className="bg-slate-50/90 px-6 py-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900">Coaching & Audit Dossier</h2>
                <StatusBadge status={session.status} />
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                SESSION ID: <span className="text-indigo-600 font-semibold">{session.id}</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
              title="Print Dossier"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                {initial}
              </div>
              <div>
                <span className="text-slate-400 font-medium block">Pilot</span>
                <p className="font-bold text-slate-900 mt-0.5">{session.pilot_name}</p>
                <p className="text-slate-500 text-[11px] truncate font-mono">{session.pilot_email}</p>
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Leader</span>
              <p className="font-bold text-slate-900 mt-0.5">{session.leader_name}</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-indigo-600" /> Site & Shift</span>
              <p className="font-bold text-slate-900 mt-0.5">{session.site}</p>
              <p className="text-slate-500 text-[11px]">{session.shift} Shift</p>
            </div>
            <div>
              <span className="text-slate-400 font-medium flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-indigo-600" /> Category</span>
              <p className="font-bold text-slate-900 mt-0.5">{session.coaching_type}</p>
            </div>
          </div>

          {/* Section 1: Operational Diagnosis */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              1. Operational Diagnosis & Incident Comparison
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> What Happened (Observation)
                </span>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{session.what_happened}</p>
              </div>
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-1.5">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Correct Expectation / Standard
                </span>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{session.correct_expectation}</p>
              </div>
            </div>

            {/* Root Cause & Recurrence */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4">
              <div className="sm:w-1/3 space-y-1.5">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Root Cause Driver</span>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-lg text-xs font-bold">
                  {session.root_cause_type}
                </span>
                <div className="text-xs text-slate-600">
                  Recurrent: <strong className="text-slate-800">{session.is_recurrent}</strong>
                </div>
              </div>
              <div className="sm:w-2/3 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4 space-y-1">
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block">Diagnostic Context</span>
                <p className="text-sm text-slate-700 leading-relaxed">{session.root_cause_details}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Action Plan */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              2. Action Plan & Follow-Up Agreement
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider block mb-1">Agreed Corrective Steps</span>
                <p className="text-sm text-slate-800 whitespace-pre-wrap">{session.action_plan_steps}</p>
              </div>
              <div className="flex flex-wrap gap-4 pt-3 border-t border-slate-200 text-xs text-slate-600">
                <div>
                  Action Owner: <strong className="text-indigo-700">{session.action_owner}</strong>
                </div>
                <div>
                  Follow-Up Required: <strong className="text-slate-800">{session.follow_up_required ? 'Yes' : 'No'}</strong>
                </div>
                {session.follow_up_date && (
                  <div>
                    Follow-Up Milestone: <strong className="text-slate-800 font-mono">{new Date(session.follow_up_date).toLocaleDateString()}</strong>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Pilot Handshake */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              3. Pilot Debrief & Digital Handshake
            </h3>
            {session.pilot_signed_at ? (
              <div className="bg-emerald-50/60 border border-emerald-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Digitally Sealed by Pilot ({session.pilot_name})
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(session.pilot_signed_at).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Committed Statement</span>
                  <p className="text-sm text-slate-800 italic bg-white p-3.5 rounded-xl border border-emerald-200">
                    "{session.pilot_commitment}"
                  </p>
                </div>
                <div className="text-xs text-slate-600 pt-1">
                  Acknowledgment Status: <strong className="text-slate-900">
                    {session.pilot_ack_status === AckStatus.UNDERSTOOD ? 'Understood feedback and standard expectation' : 'Requested clarification'}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-800 text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Pending pilot digital signature and reflective commitment.</span>
                </div>
                <a
                  href={handshakeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 hover:bg-amber-200 text-xs font-bold transition-colors w-fit"
                >
                  Open Pilot Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Section 4: Resolution (if CLOSED) */}
          {session.status === Status.CLOSED && (
            <div className="space-y-3">
              <h3 className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                4. Leader Resolution & Archival
              </h3>
              <div className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Final Operational Outcome</span>
                    <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs">
                      {session.follow_up_outcome || 'Resolved'}
                    </span>
                  </div>
                  {session.closed_at && (
                    <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Closed: {new Date(session.closed_at).toLocaleString()}
                    </span>
                  )}
                </div>
                {session.follow_up_notes && (
                  <div className="pt-2 border-t border-indigo-100">
                    <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block mb-1">Closing Remarks</span>
                    <p className="text-sm text-slate-800">{session.follow_up_notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Timeline Footer */}
          <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 border-t border-slate-100 pt-3">
            <span>CREATED: {new Date(session.created_at).toLocaleString()}</span>
            <span>UPDATED: {new Date(session.updated_at).toLocaleString()}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close Dossier
          </button>
        </div>

      </div>
    </div>
  );
};

export default SessionDetailsModal;
