import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import MatchDetail from './pages/MatchDetail';
import BettingDashboard from './pages/BettingDashboard';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { BettingProvider } from './context/BettingContext';

const App = () => {
  return (
    <AuthProvider>
      <BettingProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />} />
            <Route path="/match/:matchId" element={<MatchDetail />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/betting"
              element={
                <ProtectedRoute>
                  <BettingDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </BettingProvider>
    </AuthProvider>
  );
};

export default App;
