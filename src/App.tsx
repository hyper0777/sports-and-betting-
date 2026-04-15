import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import MatchDetail from './pages/MatchDetail';
import BettingDashboard from './pages/BettingDashboard';
import NotFound from './pages/NotFound';
import { BettingProvider } from './context/BettingContext';

const App = () => {
  return (
    <BettingProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />} />
          <Route path="/match/:matchId" element={<MatchDetail />} />
          <Route path="/betting" element={<BettingDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </BettingProvider>
  );
};

export default App;
