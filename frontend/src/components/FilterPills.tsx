import React from 'react';
import { Status } from '../types';
import { Layers, Clock, Activity, CheckCircle2 } from 'lucide-react';

type FilterType = Status | 'ALL';

interface FilterPillsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: Record<FilterType, number>;
}

const FilterPills: React.FC<FilterPillsProps> = ({ activeFilter, onFilterChange, counts }) => {
  const filters: { label: string; value: FilterType; icon: React.ReactNode; activeColor: string }[] = [
    { 
      label: 'All Sessions', 
      value: 'ALL', 
      icon: <Layers className="w-3.5 h-3.5" />,
      activeColor: 'bg-slate-900 text-white border-slate-900 shadow-sm' 
    },
    { 
      label: 'Pending Handshake', 
      value: Status.PENDING_COMMITMENT, 
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />,
      activeColor: 'bg-amber-600 text-white border-amber-600 shadow-sm' 
    },
    { 
      label: 'Active Follow-Up', 
      value: Status.ACTIVE_FOLLOW_UP, 
      icon: <Activity className="w-3.5 h-3.5 text-indigo-500" />,
      activeColor: 'bg-indigo-600 text-white border-indigo-600 shadow-sm' 
    },
    { 
      label: 'Closed / Archived', 
      value: Status.CLOSED, 
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />,
      activeColor: 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
    },
  ];

  return (
    <div className="flex flex-wrap gap-2.5">
      {filters.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = counts[filter.value] || 0;
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
              isActive
                ? filter.activeColor
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-2xs'
            }`}
          >
            {filter.icon}
            <span>{filter.label}</span>
            <span
              className={`ml-1 text-[11px] font-mono px-2 py-0.5 rounded-full ${
                isActive 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterPills;
