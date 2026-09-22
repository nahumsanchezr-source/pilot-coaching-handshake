import React, { useEffect, useState } from 'react';
import { 
  Copy, 
  Check, 
  Eye, 
  Search, 
  Clock, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Filter, 
  RefreshCw 
} from 'lucide-react';
import { CoachingSession, Status, FollowUpClosePayload } from '../types';
import { listSessions, closeSession } from '../api/client';
import StatusBadge from '../components/StatusBadge';
import FilterPills from '../components/FilterPills';
import FollowUpModal from '../components/FollowUpModal';
import SessionDetailsModal from '../components/SessionDetailsModal';

type FilterType = Status | 'ALL';

const Dashboard: React.FC = () => {
  const [sessions, setSessions] = useState<CoachingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CoachingSession | null>(null);
  const [viewingSession, setViewingSession] = useState<CoachingSession | null>(null);
  
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await listSessions();
      // Sort desc by created_at
      const sorted = res.data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setSessions(sorted);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const counts = {
    'ALL': sessions.length,
    [Status.PENDING_COMMITMENT]: sessions.filter(s => s.status === Status.PENDING_COMMITMENT).length,
    [Status.ACTIVE_FOLLOW_UP]: sessions.filter(s => s.status === Status.ACTIVE_FOLLOW_UP).length,
    [Status.CLOSED]: sessions.filter(s => s.status === Status.CLOSED).length,
  };

  const isOverdue = (dateStr: string | null, status: Status) => {
    if (!dateStr || status !== Status.ACTIVE_FOLLOW_UP) return false;
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  const overdueCount = sessions.filter(s => isOverdue(s.follow_up_date, s.status)).length;

  const filteredSessions = sessions.filter(s => {
    const matchesFilter = filter === 'ALL' || s.status === filter;
    const matchesSearch = searchQuery === '' || 
      s.pilot_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.leader_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.site.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.coaching_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyLink = (token: string, id: string) => {
    const url = `${window.location.origin}/handshake/${token}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResolve = (session: CoachingSession) => {
    setSelectedSession(session);
    setFollowUpModalOpen(true);
  };

  const handleViewDetails = (session: CoachingSession) => {
    setViewingSession(session);
    setDetailsModalOpen(true);
  };

  const submitResolve = async (data: FollowUpClosePayload) => {
    if (!selectedSession) return;
    await closeSession(selectedSession.id, data);
    setFollowUpModalOpen(false);
    setSelectedSession(null);
    fetchSessions(); // refresh
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 py-6 space-y-6 animate-in fade-in duration-300">
      
      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Sessions */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">Total Sessions</span>
            <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 font-mono">{counts['ALL']}</div>
          <p className="text-[11px] text-slate-500 mt-1">Lifetime recorded cases</p>
        </div>

        {/* Pending Handshake */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider">Pending Signature</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 font-mono">{counts[Status.PENDING_COMMITMENT]}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting pilot debrief</p>
        </div>

        {/* Active Follow-Up */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider">Active Follow-Up</span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-indigo-800 font-mono">{counts[Status.ACTIVE_FOLLOW_UP]}</div>
          <p className="text-[11px] text-slate-500 mt-1">Under observation cycle</p>
        </div>

        {/* Overdue / Due Now */}
        <div className={`bg-white p-5 rounded-2xl border shadow-sm relative overflow-hidden group ${
          overdueCount > 0 ? 'border-rose-300 bg-rose-50/40' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-rose-700 uppercase tracking-wider">Review Due</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-800 font-mono flex items-center gap-2">
            {overdueCount}
            {overdueCount > 0 && (
              <span className="text-[10px] font-sans px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200 font-bold">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Past target follow-up date</p>
        </div>

      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <FilterPills activeFilter={filter} onFilterChange={setFilter} counts={counts as Record<FilterType, number>} />

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pilot, leader, site..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-900 text-xs outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400 shadow-2xs"
            />
          </div>
          <button
            onClick={fetchSessions}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all cursor-pointer whitespace-nowrap shadow-2xs"
            title="Refresh Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
        {loading ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-mono text-slate-500">Loading audit ledger...</p>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="p-16 text-center space-y-2">
            <Filter className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-800">No sessions match current filter</p>
            <p className="text-xs text-slate-500">Adjust the state filter or clear the search term.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase tracking-wider text-[11px] font-mono">
                <tr>
                  <th className="px-6 py-4 font-semibold">Pilot Identification</th>
                  <th className="px-6 py-4 font-semibold">Leader / Coach</th>
                  <th className="px-6 py-4 font-semibold">Category & Shift</th>
                  <th className="px-6 py-4 font-semibold">Audit Status</th>
                  <th className="px-6 py-4 font-semibold">Date Recorded</th>
                  <th className="px-6 py-4 font-semibold">Follow-up Milestone</th>
                  <th className="px-6 py-4 text-right min-w-[250px] pr-8 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSessions.map((s) => {
                  const overdue = isOverdue(s.follow_up_date, s.status);
                  const initial = s.pilot_name ? s.pilot_name.charAt(0).toUpperCase() : 'P';

                  return (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                      
                      {/* Pilot Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                            {initial}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {s.pilot_name}
                            </div>
                            <div className="text-xs text-slate-500 font-mono">{s.pilot_email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Leader */}
                      <td className="px-6 py-4 text-slate-700 text-xs font-medium">
                        {s.leader_name}
                      </td>

                      {/* Category & Shift */}
                      <td className="px-6 py-4">
                        <div className="text-xs font-semibold text-slate-800">{s.coaching_type}</div>
                        <div className="text-[11px] text-slate-500">{s.site} • {s.shift}</div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <StatusBadge status={s.status} />
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-slate-600 text-xs font-mono">
                        {new Date(s.created_at).toLocaleDateString()}
                      </td>

                      {/* Follow-up Milestone */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-mono ${overdue ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                            {s.follow_up_date ? new Date(s.follow_up_date).toLocaleDateString() : '—'}
                          </span>
                          {overdue && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 uppercase tracking-wide flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                              Due
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right min-w-[250px] pr-8">
                        <div className="inline-flex items-center gap-2">
                          
                          {/* Copy Link for Pending */}
                          {s.status === Status.PENDING_COMMITMENT && (
                            <button
                              onClick={() => handleCopyLink(s.pilot_token, s.id)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                              title="Copy Pilot Handshake Link"
                            >
                              {copiedId === s.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700">Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Copy Link</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Resolve Button */}
                          {s.status === Status.ACTIVE_FOLLOW_UP && (
                            <button
                              onClick={() => handleResolve(s)}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm text-xs font-bold transition-all cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Resolve</span>
                            </button>
                          )}

                          {/* View Report Button for all items */}
                          <button
                            onClick={() => handleViewDetails(s)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-semibold transition-all cursor-pointer"
                            title="Inspect complete coaching dossier"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-600" />
                            <span>View Report</span>
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Follow-Up Resolution Modal */}
      <FollowUpModal
        isOpen={followUpModalOpen}
        onClose={() => setFollowUpModalOpen(false)}
        session={selectedSession}
        onSubmit={submitResolve}
      />

      {/* Session Details / Audit Dossier Modal */}
      <SessionDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        session={viewingSession}
      />
    </div>
  );
};

export default Dashboard;
