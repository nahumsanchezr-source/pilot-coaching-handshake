import React from 'react';
import { RootCauseType } from '../types';
import { Target, BookOpen, Flame, Check } from 'lucide-react';

interface RootCauseCardsProps {
  selected: RootCauseType | null;
  onSelect: (type: RootCauseType) => void;
}

const RootCauseCards: React.FC<RootCauseCardsProps> = ({ selected, onSelect }) => {
  const causes = [
    {
      type: RootCauseType.SKILL,
      icon: Target,
      badge: 'EXECUTION & REPETITION',
      title: 'Skill Gap',
      description: 'Knows the expectation and standard, but requires deliberate practice, coaching, or technique refinement.',
      accentColor: 'text-indigo-600',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/50',
      badgeBg: 'bg-indigo-50 text-indigo-700',
    },
    {
      type: RootCauseType.KNOWLEDGE,
      icon: BookOpen,
      badge: 'SOP & UNDERSTANDING',
      title: 'Knowledge Gap',
      description: 'Unaware of updated bulletins, ambiguous procedure, or lack of conceptual comprehension of standard.',
      accentColor: 'text-blue-600',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/50',
      badgeBg: 'bg-blue-50 text-blue-700',
    },
    {
      type: RootCauseType.WILL,
      icon: Flame,
      badge: 'MOTIVATION & ATTITUDE',
      title: 'Will / Commitment',
      description: 'Fully capable and knowledgeable, but demonstrates inconsistent adherence, complacency, or disengagement.',
      accentColor: 'text-amber-600',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/50',
      badgeBg: 'bg-amber-50 text-amber-800',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {causes.map((cause) => {
        const isSelected = selected === cause.type;
        const IconComponent = cause.icon;
        
        return (
          <button
            key={cause.type}
            type="button"
            onClick={() => onSelect(cause.type)}
            className={`relative group text-left p-5 rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
              isSelected
                ? `${cause.activeBorder} shadow-md`
                : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm text-slate-700'
            }`}
          >
            {/* Selection Checkmark */}
            {isSelected && (
              <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2.5 rounded-xl bg-slate-50 border border-slate-200 ${cause.accentColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cause.badgeBg}`}>
                {cause.badge}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-1.5 flex items-center gap-2">
              {cause.title}
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              {cause.description}
            </p>
          </button>
        );
      })}
    </div>
  );
};

export default RootCauseCards;
