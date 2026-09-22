import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardPlus, LayoutDashboard, ShieldCheck, Radio } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 h-18 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 z-50 flex items-center px-4 sm:px-8 transition-all shadow-xs">
      <div className="flex items-center justify-between w-full">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-md shadow-indigo-500/10">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-slate-900">
                SkyOps
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-600 border border-indigo-100">
                PRO COACHING
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">Pilot Handshake Protocol</p>
          </div>
        </div>
        
        {/* Nav Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
          <NavLink
            to="/new"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`
            }
          >
            <ClipboardPlus className="w-4 h-4" />
            <span>New Session</span>
          </NavLink>
          
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`
            }
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Audit Dashboard</span>
          </NavLink>
        </nav>

        {/* Live System Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-600 font-medium">SYSTEM: ONLINE</span>
        </div>

      </div>
    </header>
  );
};

export default Header;
