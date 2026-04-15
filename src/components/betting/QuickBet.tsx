import { useState } from 'react';
import { useBetting } from '@/context/BettingContext';
import { AlertCircle } from 'lucide-react';

interface QuickBetProps {
  matchId: string;
  matchName: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
  teamNames?: {
    home: string;
    away: string;
  };
}

export default function QuickBet({
  matchId,
  matchName,
  odds,
  teamNames = { home: 'Home', away: 'Away' },
}: QuickBetProps) {
  const { balance, addBet } = useBetting();
  const [stake, setStake] = useState('');
  const [selectedBet, setSelectedBet] = useState<'home' | 'draw' | 'away' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const getOddsDisplay = () => {
    if (!selectedBet) return null;
    return odds[selectedBet];
  };

  const getPotentialWin = () => {
    if (!stake || !selectedBet) return 0;
    const stakeNum = parseFloat(stake);
    return (stakeNum * getOddsDisplay()!) - stakeNum;
  };

  const handlePlaceBet = () => {
    setError('');
    setSuccess(false);

    if (!selectedBet) {
      setError('Select a bet type');
      return;
    }

    const stakeNum = parseFloat(stake);
    if (!stake || stakeNum <= 0) {
      setError('Enter a valid stake amount');
      return;
    }

    if (stakeNum > balance) {
      setError('Insufficient balance');
      return;
    }

    const currentOdds = getOddsDisplay();
    if (!currentOdds) {
      setError('Invalid odds');
      return;
    }

    try {
      const betTypeDisplay =
        selectedBet === 'home'
          ? `${teamNames.home} Win`
          : selectedBet === 'away'
            ? `${teamNames.away} Win`
            : 'Draw';

      addBet(matchId, matchName, stakeNum, currentOdds, betTypeDisplay);

      setStake('');
      setSelectedBet(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error placing bet');
    }
  };

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
      <div className="mb-6">
        <h3 className="text-xl font-bold text-white mb-2">Place a Bet</h3>
        <p className="text-gray-400 text-sm">Available Balance: <span className="text-orange-400 font-semibold">${balance.toFixed(2)}</span></p>
      </div>

      {/* Bet Selection */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-semibold mb-3">Select Bet Type</label>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setSelectedBet('home')}
            className={`p-4 rounded-lg border-2 transition ${
              selectedBet === 'home'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <p className="text-white font-semibold text-sm mb-1">{teamNames.home}</p>
            <p className="text-orange-400 font-bold">{odds.home.toFixed(2)}</p>
          </button>

          <button
            onClick={() => setSelectedBet('draw')}
            className={`p-4 rounded-lg border-2 transition ${
              selectedBet === 'draw'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <p className="text-white font-semibold text-sm mb-1">Draw</p>
            <p className="text-orange-400 font-bold">{odds.draw.toFixed(2)}</p>
          </button>

          <button
            onClick={() => setSelectedBet('away')}
            className={`p-4 rounded-lg border-2 transition ${
              selectedBet === 'away'
                ? 'border-orange-500 bg-orange-500/10'
                : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
            }`}
          >
            <p className="text-white font-semibold text-sm mb-1">{teamNames.away}</p>
            <p className="text-orange-400 font-bold">{odds.away.toFixed(2)}</p>
          </button>
        </div>
      </div>

      {/* Stake Input */}
      <div className="mb-6">
        <label className="block text-gray-300 text-sm font-semibold mb-2">Stake Amount</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Enter stake amount"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-orange-500"
          />
          <button
            onClick={() => setStake(balance.toFixed(2))}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded text-sm font-semibold transition"
            title="Use all available balance"
          >
            Max
          </button>
        </div>
      </div>

      {/* Bet Summary */}
      {selectedBet && stake && (
        <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Stake</p>
              <p className="text-white font-bold">${parseFloat(stake).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Odds</p>
              <p className="text-orange-400 font-bold">{getOddsDisplay()?.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Potential Win</p>
              <p className="text-green-400 font-bold">${getPotentialWin().toFixed(2)}</p>
            </div>
            <div>
              <p className="text-gray-400">Return on Win</p>
              <p className="text-blue-400 font-bold">
                ${(parseFloat(stake) * getOddsDisplay()!).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg mb-4">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg mb-4">
          <p className="text-green-300 text-sm">✓ Bet placed successfully!</p>
        </div>
      )}

      {/* Place Bet Button */}
      <button
        onClick={handlePlaceBet}
        disabled={!selectedBet || !stake}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 disabled:text-gray-400 text-white font-semibold py-3 rounded-lg transition"
      >
        Place Bet
      </button>
    </div>
  );
}
