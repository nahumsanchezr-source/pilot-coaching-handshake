import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Handshake, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  FileCheck2
} from 'lucide-react';
import { CoachingSession, Status, AckStatus } from '../types';
import { getHandshake, submitCommitment } from '../api/client';

const PilotHandshake: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [session, setSession] = useState<CoachingSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [commitment, setCommitment] = useState('');
  const [ackStatus, setAckStatus] = useState<AckStatus | ''>('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    const fetchSession = async () => {
      try {
        const res = await getHandshake(token);
        setSession(res.data);
      } catch (err: any) {
        setError(err.response?.data?.detail || 'Session not found or invalid debrief token');
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !commitment || !ackStatus) return;

    setSubmitting(true);
    setError(null);
    try {
      await submitCommitment(token, {
        pilot_commitment: commitment,
        pilot_ack_status: ackStatus as AckStatus,
      });
      setSubmittedSuccess(true);
      // Refresh session data
      const res = await getHandshake(token);
      setSession(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to submit digital commitment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-slate-50 text-slate-900 gap-4">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-xs text-slate-500">AUTHENTICATING PILOT DEBRIEF TOKEN...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-6 text-slate-900">
        <div className="bg-white p-8 rounded-3xl text-center max-w-md w-full border border-rose-200 shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <div className="text-xs font-mono text-slate-400">
            Please contact your Flight Operations Lead for a valid handshake link.
          </div>
        </div>
      </div>
    );
  }

  const isPending = session.status === Status.PENDING_COMMITMENT;

  // Post-submission success view
  if (submittedSuccess || (!isPending && session.pilot_signed_at)) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <header className="py-4 px-6 bg-white/90 backdrop-blur-xl border-b border-slate-200 flex justify-center items-center shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">SkyOps • Pilot Debrief Portal</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white p-8 sm:p-10 rounded-3xl text-center max-w-lg w-full border border-emerald-200 shadow-xl relative overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold mb-3">
              COMMITMENT SEALED & RECORDED
            </span>
            
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              Debrief Handshake Confirmed
            </h2>
            
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Thank you, <strong>{session.pilot_name}</strong>. Your commitment has been sealed with your digital signature and updated in the flight ops registry.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left space-y-2 mb-6 text-xs">
              <span className="text-slate-500 font-mono block uppercase">Your Registered Statement:</span>
              <p className="text-emerald-900 italic font-medium">"{session.pilot_commitment}"</p>
              <div className="pt-2 border-t border-slate-200 text-slate-500 flex justify-between">
                <span>Signed at:</span>
                <span className="font-mono text-slate-700 font-semibold">{new Date(session.pilot_signed_at!).toLocaleString()}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 font-mono">
              You may close this window. Fly safe!
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      
      {/* Header */}
      <header className="py-4 px-6 bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Handshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-slate-900 tracking-tight">SkyOps • Pilot Debrief Portal</h1>
            <p className="text-[11px] text-slate-500">Confidential Flight Crew Alignment & Handshake</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-mono bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
            PILOT: {session.pilot_name}
          </span>
        </div>
      </header>

      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* Banner */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-mono font-bold">
            <Sparkles className="w-4 h-4" />
            OPERATIONAL COACHING DEBRIEF
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Hello {session.pilot_name}, review your recent debrief notes
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm">
            This debrief is part of our non-punitive safety and standard operating excellence culture. Please review the observation, clarify any questions, and submit your personal action commitment.
          </p>
        </div>

        {/* Fact Sheet Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono">
                Shift: {session.shift}
              </span>
              <span className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 font-mono">
                Base: {session.site}
              </span>
              <span className="px-2.5 py-1 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-700 font-semibold">
                Category: {session.coaching_type}
              </span>
            </div>
            <div className="text-slate-500 font-mono">
              Lead Coach: <strong className="text-slate-800">{session.leader_name}</strong>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-6">
            
            <div className="bg-rose-50/60 border border-rose-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> What was observed?
              </span>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{session.what_happened}</p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-200 p-5 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Operational Standard / Expectation
              </span>
              <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{session.correct_expectation}</p>
            </div>

          </div>

          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-600">
            <div>
              Root Cause Classification: <strong className="text-indigo-700">{session.root_cause_type}</strong> ({session.root_cause_details})
            </div>
            {session.action_plan_steps && (
              <div className="mt-1 sm:mt-0">
                Action Owner: <strong className="text-slate-800">{session.action_owner}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Commitment Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 space-y-6 shadow-sm">
          
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Pilot Reflection & Digital Handshake</h3>
              <p className="text-xs text-slate-500">Declare your personal commitment to standard operational excellence</p>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs">
              {error}
            </div>
          )}

          {/* Commitment Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Starting today, I commit to...
            </label>
            <textarea
              required
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              rows={4}
              placeholder="e.g. Starting today, I will conduct the complete standard pre-flight callouts with my copilot without rushing..."
              className="w-full p-4 rounded-2xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-400"
            />
            <p className="text-[11px] text-slate-500">
              Please formulate an actionable, personal statement of how you will sustain standard performance.
            </p>
          </div>

          {/* Acknowledgment Radio Choices */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Debrief Understanding & Acknowledgment
            </label>
            
            <div className="space-y-3">
              <label 
                className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                  ackStatus === AckStatus.UNDERSTOOD 
                    ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-500 text-slate-900' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="ack"
                  value={AckStatus.UNDERSTOOD}
                  checked={ackStatus === AckStatus.UNDERSTOOD}
                  onChange={(e) => setAckStatus(e.target.value as AckStatus)}
                  className="w-4 h-4 text-indigo-600 border-slate-300 focus:ring-indigo-500 cursor-pointer"
                />
                <div className="ml-3">
                  <span className="text-sm font-bold block text-slate-900">I understand the feedback and agreed standard expectation</span>
                  <span className="text-xs text-slate-500">All points are clear and I have the tools to comply.</span>
                </div>
              </label>

              <label 
                className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                  ackStatus === AckStatus.NEEDS_CLARIFICATION 
                    ? 'bg-amber-50/70 border-amber-500 ring-1 ring-amber-500 text-slate-900' 
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="ack"
                  value={AckStatus.NEEDS_CLARIFICATION}
                  checked={ackStatus === AckStatus.NEEDS_CLARIFICATION}
                  onChange={(e) => setAckStatus(e.target.value as AckStatus)}
                  className="w-4 h-4 text-amber-600 border-slate-300 focus:ring-amber-500 cursor-pointer"
                />
                <div className="ml-3">
                  <span className="text-sm font-bold block text-slate-900">I have questions / require additional coaching clarification</span>
                  <span className="text-xs text-slate-500">I commit to discussing this further with my flight lead.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={submitting || !commitment || !ackStatus}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
          >
            {submitting ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sealing Handshake...</span>
              </div>
            ) : (
              <>
                <Handshake className="w-5 h-5" />
                <span>Seal Digital Commitment & Complete Handshake</span>
              </>
            )}
          </button>
        </form>

      </main>
    </div>
  );
};

export default PilotHandshake;
