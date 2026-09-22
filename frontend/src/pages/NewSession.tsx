import React, { useState } from 'react';
import { 
  Send, 
  FileText, 
  Activity, 
  Layers, 
  Calendar, 
  User, 
  Mail, 
  UserCheck, 
  Clock, 
  MapPin, 
  Bookmark, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  Shift,
  CoachingType,
  Recurrence,
  RootCauseType,
  ActionOwner,
  SessionCreatePayload
} from '../types';
import { createSession } from '../api/client';
import RootCauseCards from '../components/RootCauseCards';
import SubmissionModal from '../components/SubmissionModal';

const NewSession: React.FC = () => {
  const [formData, setFormData] = useState<Partial<SessionCreatePayload>>({
    shift: Shift.MORNING,
    coaching_type: CoachingType.PERFORMANCE,
    is_recurrent: Recurrence.NO,
    action_owner: ActionOwner.PILOT,
    follow_up_required: false,
    root_cause_type: RootCauseType.SKILL,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pilotToken, setPilotToken] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRootCauseSelect = (type: RootCauseType) => {
    setFormData((prev) => ({ ...prev, root_cause_type: type }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = formData as SessionCreatePayload;
      const res = await createSession(payload);
      setPilotToken(res.data.pilot_token);
      setModalOpen(true);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create session. Please verify all inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-mono font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              LEADER DIAGNOSTIC CONSOLE
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              New Coaching Session
            </h2>
            <p className="text-slate-500 text-sm mt-0.5 max-w-xl">
              Execute standardized diagnostic triage, document root causes, and dispatch digital handshake for pilot debrief.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-700 text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">STANDARD PROTOCOL</span>
              <span className="text-indigo-600 font-bold">NON-PUNITIVE ALIGNMENT</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl flex items-center gap-3 animate-in shake duration-200">
          <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Section 1: Pilot & Operational Baseline */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">1. Pilot & Operational Baseline</h3>
                <p className="text-xs text-slate-500">Specify operational personnel and location context</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Step 1 of 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-600" /> Pilot Name
              </label>
              <input
                required
                type="text"
                name="pilot_name"
                onChange={handleChange}
                placeholder="e.g. Elena Rostova"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-600" /> Pilot Email
              </label>
              <input
                required
                type="email"
                name="pilot_email"
                onChange={handleChange}
                placeholder="erostova@skyfleet.io"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-indigo-600" /> Leader / Coach
              </label>
              <input
                required
                type="text"
                name="leader_name"
                onChange={handleChange}
                placeholder="e.g. Marcus Vance"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Operational Shift
              </label>
              <select
                required
                name="shift"
                onChange={handleChange}
                value={formData.shift}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                {Object.values(Shift).map((s) => (
                  <option key={s} value={s}>{s} Shift</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" /> Site / Base Station
              </label>
              <input
                required
                type="text"
                name="site"
                onChange={handleChange}
                placeholder="e.g. SEA-Tactical-1"
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-indigo-600" /> Coaching Category
              </label>
              <select
                required
                name="coaching_type"
                onChange={handleChange}
                value={formData.coaching_type}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                {Object.values(CoachingType).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Section 2: Split-Screen Incident Comparison */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">2. Incident & Standard Comparison</h3>
                <p className="text-xs text-slate-500">Contrapose empirical observation against expected procedural benchmark</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Step 2 of 4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* What Happened */}
            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" /> What Happened? (Observation)
                </label>
                <span className="text-[10px] font-mono text-rose-600 uppercase font-semibold">Fact-Based Only</span>
              </div>
              <textarea
                required
                name="what_happened"
                onChange={handleChange}
                rows={5}
                placeholder="Describe the specific incident or observation with concrete facts and metrics..."
                className="w-full p-4 rounded-xl bg-white border border-rose-200 text-slate-900 text-sm outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-100 resize-none transition-all placeholder:text-slate-400"
              />
            </div>

            {/* Expected Standard */}
            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-200/80 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Operational Standard / Expectation
                </label>
                <span className="text-[10px] font-mono text-emerald-600 uppercase font-semibold">Standard SOP</span>
              </div>
              <textarea
                required
                name="correct_expectation"
                onChange={handleChange}
                rows={5}
                placeholder="Describe the benchmark operational standard, SOP clause, or procedural callout..."
                className="w-full p-4 rounded-xl bg-white border border-emerald-200 text-slate-900 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 resize-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Recurrence Toggle */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Has this pilot been coached before for the same procedural gap?
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              {Object.values(Recurrence).map((rec) => {
                const isSelected = formData.is_recurrent === rec;
                return (
                  <button
                    key={rec}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, is_recurrent: rec }))}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {rec === Recurrence.YES ? '🚨 Yes (Recurrent)' : rec === Recurrence.NO ? '✨ No (First Time)' : '❓ Unknown'}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Section 3: Root Cause Triage */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">3. Root Cause Triage Matrix</h3>
                <p className="text-xs text-slate-500">Classify the underlying driver according to standard diagnostic framework</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Step 3 of 4</span>
          </div>

          <RootCauseCards 
            selected={formData.root_cause_type as RootCauseType} 
            onSelect={handleRootCauseSelect} 
          />

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Root Cause Diagnostics & Leader Notes
            </label>
            <textarea
              required
              name="root_cause_details"
              onChange={handleChange}
              rows={3}
              placeholder="Provide context on why this driver was selected (e.g., Unaware of SOP v4 revisions, hurried turnaround...)"
              className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-400"
            />
          </div>
        </section>

        {/* Section 4: Action Plan & Follow-Up Agreement */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">4. Action Plan & Follow-Up Agreement</h3>
                <p className="text-xs text-slate-500">Establish concrete corrective steps and accountability owner</p>
              </div>
            </div>
            <span className="text-[11px] font-mono text-slate-400 uppercase">Step 4 of 4</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Committed Action Steps
            </label>
            <textarea
              required
              name="action_plan_steps"
              onChange={handleChange}
              rows={4}
              placeholder="1. Review checklist protocol bulletin v4.&#10;2. Complete 1-on-1 audit flight verification.&#10;3. Debrief with shift lead..."
              className="w-full p-4 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none transition-all placeholder:text-slate-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Action Owner
              </label>
              <select
                required
                name="action_owner"
                onChange={handleChange}
                value={formData.action_owner}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
              >
                {Object.values(ActionOwner).map((ao) => (
                  <option key={ao} value={ao}>{ao}</option>
                ))}
              </select>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Follow-Up Required?
              </label>
              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="follow_up_required"
                    checked={formData.follow_up_required}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
                <span className="text-xs font-semibold text-slate-700">
                  {formData.follow_up_required ? 'Yes, schedule check' : 'No follow-up needed'}
                </span>
              </div>
            </div>

            {formData.follow_up_required && (
              <div className="animate-in fade-in zoom-in-95 duration-200">
                <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">
                  Follow-Up Review Date
                </label>
                <input
                  required
                  type="date"
                  name="follow_up_date"
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                />
              </div>
            )}
          </div>
        </section>

        {/* Submit Action */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4.5 px-8 rounded-2xl shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-base"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Recording Coaching Protocol...</span>
              </div>
            ) : (
              <>
                <Send className="w-5 h-5 text-indigo-200" />
                <span>Publish Coaching Session & Generate Handshake</span>
                <ArrowRight className="w-5 h-5 opacity-70" />
              </>
            )}
          </button>
        </div>
      </form>

      <SubmissionModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        pilotToken={pilotToken} 
      />
    </div>
  );
};

export default NewSession;
