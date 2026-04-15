import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBetting } from '@/context/BettingContext';
import { useAuth } from '@/context/AuthContext';
import { TrendingUp, TrendingDown, Target, DollarSign, Percent, LogOut, Loader } from 'lucide-react';

export default function BettingDashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const {
    bankroll,
    balance,
    bets,
    setBankroll,
    settleBet,
    getTotalProfit,
    getWinRate,
    getTotalBets,
    getWinCount,
    loading: bettingLoading,
  } = useBetting();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      alert('Error signing out');
    }
  };

  const [newBankroll, setNewBankroll] = useState('');
  const [showBankrollForm, setShowBankrollForm] = useState(bankroll === 0);

  const handleSetBankroll = () => {
    const amount = parseFloat(newBankroll);
    if (!amount || amount <= 0) {
      alert('Enter a valid bankroll amount');
      return;
    }

    try {
      setBankroll(amount);
      setNewBankroll('');
      setShowBankrollForm(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error setting bankroll');
    }
  };

  const handleSettleBet = (betId: string, result: 'win' | 'loss') => {
    try {
      settleBet(betId, result);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error settling bet');
    }
  };

  const totalProfit = getTotalProfit();
  const winRate = getWinRate();
  const totalBets = getTotalBets();
  const winCount = getWinCount();
  const lossCount = totalBets - winCount;

  const pendingBets = bets.filter((b) => b.result === 'pending');
  const settledBets = bets.filter((b) => b.result !== 'pending').slice().reverse();

  if (bettingLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader className="w-8 h-8 animate-spin text-orange-500" />
          <p>Loading your betting data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with User Info */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Betting Dashboard</h1>
            <p className="text-gray-400">Track your bets, manage your bankroll, and analyze your performance</p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm mb-2">Logged in as:</p>
            <p className="text-white font-semibold mb-4">{user?.email}</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Bankroll Section */}
        {showBankrollForm ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Set Your Starting Bankroll</h2>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter bankroll amount (e.g., 1000)"
                value={newBankroll}
                onChange={(e) => setNewBankroll(e.target.value)}
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSetBankroll();
                }}
              />
              <button
                onClick={handleSetBankroll}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded font-semibold transition"
              >
                Set Bankroll
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Bankroll */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Bankroll</span>
                <DollarSign className="w-5 h-5 text-orange-500" />
              </div>
              <p className="text-3xl font-bold">${bankroll.toFixed(2)}</p>
              <button
                onClick={() => setShowBankrollForm(true)}
                className="text-xs text-gray-400 hover:text-orange-400 mt-2"
              >
                Change
              </button>
            </div>

            {/* Current Balance */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Current Balance</span>
                <Target className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-2">
                {balance >= bankroll ? 'Up' : 'Down'} ${Math.abs(balance - bankroll).toFixed(2)}
              </p>
            </div>

            {/* Total Profit/Loss */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Profit/Loss</span>
                {totalProfit >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <p
                className={`text-3xl font-bold ${
                  totalProfit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                ${totalProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {totalProfit >= 0 ? '+' : ''}{((totalProfit / bankroll) * 100).toFixed(1)}% ROI
              </p>
            </div>

            {/* Win Rate */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Win Rate</span>
                <Percent className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-3xl font-bold">{winRate.toFixed(1)}%</p>
              <p className="text-xs text-gray-400 mt-2">
                {winCount} W - {lossCount} L
              </p>
            </div>
          </div>
        )}

        {/* Pending Bets */}
        {pendingBets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Pending Bets ({pendingBets.length})</h2>
            <div className="grid gap-4">
              {pendingBets.map((bet) => (
                <div key={bet.id} className="bg-gray-900 border border-gray-700 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Match</p>
                      <p className="font-semibold">{bet.matchName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Betting On</p>
                      <p className="font-semibold">{bet.bettingOn}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Stake / Odds</p>
                      <p className="font-semibold">
                        ${bet.stake.toFixed(2)} @ {bet.odds.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Potential Win</p>
                      <p className="font-semibold text-green-400">
                        ${((bet.stake * bet.odds) - bet.stake).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSettleBet(bet.id, 'win')}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                      >
                        Won
                      </button>
                      <button
                        onClick={() => handleSettleBet(bet.id, 'loss')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-semibold transition"
                      >
                        Lost
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settled Bets History */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Bet History</h2>
          {settledBets.length === 0 ? (
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 text-center">
              <p className="text-gray-400">No settled bets yet. Start placing bets to see your history!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {settledBets.map((bet) => (
                <div
                  key={bet.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-gray-400 text-sm">Match</p>
                      <p className="font-semibold">{bet.matchName}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Betting On</p>
                      <p className="font-semibold">{bet.bettingOn}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Stake / Odds</p>
                      <p className="font-semibold">${bet.stake.toFixed(2)} @ {bet.odds.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Result</p>
                      <p
                        className={`font-semibold ${
                          bet.result === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {bet.result.toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Profit</p>
                      <p
                        className={`font-semibold ${
                          bet.profit >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        ${bet.profit.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Date</p>
                      <p className="font-semibold text-sm">
                        {new Date(bet.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
