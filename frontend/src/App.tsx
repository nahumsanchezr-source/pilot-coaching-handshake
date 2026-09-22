import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import NewSession from './pages/NewSession';
import PilotHandshake from './pages/PilotHandshake';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  const location = useLocation();
  const isHandshakeRoute = location.pathname.startsWith('/handshake');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 bg-mesh-light flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-900">
      {!isHandshakeRoute && <Header />}
      
      <main className={`flex-1 ${!isHandshakeRoute ? 'pt-20' : ''}`}>
        <Routes>
          <Route path="/" element={<Navigate to="/new" replace />} />
          <Route path="/new" element={<NewSession />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/handshake/:token" element={<PilotHandshake />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
