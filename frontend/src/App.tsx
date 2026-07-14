import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import BoothManagementPage from './pages/BoothManagementPage';

type BoothStatus = 'IDLE' | 'SMOKING' | 'WARNING' | 'FIRE_DETECTED';
type SprayMode = 'AUTO' | 'OFF';

type Booth = {
  id: string;
  name: string;
  floor: string;
  location: string;
  status: BoothStatus;
  aqi: number;
  cigarettePct: number;
  waterPct: number;
  sprayMode: SprayMode;
  lastSprayAt: string | null;
  sprayCount: number;
};

const initialBooths: Booth[] = [
  { id: 'B-001', name: '휴게실', floor: '2F', location: '휴게실 중앙', status: 'WARNING', aqi: 88, cigarettePct: 81, waterPct: 34, sprayMode: 'AUTO', lastSprayAt: '12:40', sprayCount: 3 },
  { id: 'B-002', name: '출입구', floor: '1F', location: '정문 입구', status: 'IDLE', aqi: 42, cigarettePct: 24, waterPct: 72, sprayMode: 'OFF', lastSprayAt: '09:12', sprayCount: 1 },
  { id: 'B-003', name: '회의실', floor: '3F', location: '회의실 복도', status: 'SMOKING', aqi: 118, cigarettePct: 92, waterPct: 21, sprayMode: 'AUTO', lastSprayAt: '13:05', sprayCount: 5 },
];

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [booths, setBooths] = useState<Booth[]>(initialBooths);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={setToken} />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={token ? <DashboardPage booths={booths} onLogout={() => setToken(null)} /> : <Navigate to="/login" replace />} />
        <Route path="/booths" element={token ? <BoothManagementPage booths={booths} setBooths={setBooths} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
