import React from 'react';
import { Status } from '../types';
import { Activity, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  switch (status) {
    case Status.PENDING_COMMITMENT:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          Pending Handshake
        </span>
      );
    case Status.ACTIVE_FOLLOW_UP:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs">
          <Activity className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
          Active Follow-Up
        </span>
      );
    case Status.CLOSED:
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Archived & Closed
        </span>
      );
    default:
      return null;
  }
};

export default StatusBadge;
