import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Player } from '@/data/sportsData';

interface TopScorersProps {
  players: Player[];
}

export default function TopScorers({ players }: TopScorersProps) {
  const [selectedLeague, setSelectedLeague] = useState<'Premier League' | 'NBA'>('Premier League');

  const leagueChoices: Array<'Premier League' | 'NBA'> = ['Premier League', 'NBA'];
  
  const filteredPlayers = players
    .filter((p) => p.league === selectedLeague)
    .sort((a, b) => (b.goals + b.assists) - (a.goals + a.assists));

  const isSoccer = selectedLeague === 'Premier League';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Top Performers</h2>
        <p className="text-gray-400">Leading scorers and playmakers</p>
      </div>

      {/* League Tabs */}
      <div className="flex gap-4 border-b border-gray-700">
        {leagueChoices.map((league) => (
          <button
            key={league}
            onClick={() => setSelectedLeague(league)}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              selectedLeague === league
                ? 'border-orange-500 text-orange-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            {league}
          </button>
        ))}
      </div>

      {/* Players Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredPlayers.map((player, index) => (
          <div key={player.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 transition group">
            {/* Rank Badge */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2">
              <p className="text-white font-bold text-lg">#{index + 1}</p>
            </div>

            {/* Content */}
            <div className="p-4">
              {/* Player Name and Team */}
              <p className="text-white font-bold text-lg mb-1">{player.name}</p>
              <p className="text-gray-400 text-sm mb-4">{player.team}</p>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                {/* Primary Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
                      {isSoccer ? 'Goals' : 'Points/Game'}
                    </p>
                    <p className="text-2xl font-bold text-orange-400">{player.goals}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs font-semibold uppercase mb-1">
                      {isSoccer ? 'Assists' : 'Assists/Game'}
                    </p>
                    <p className="text-2xl font-bold text-blue-400">{isSoccer ? player.assists : player.assists.toFixed(1)}</p>
                  </div>
                </div>

                {/* Secondary Stats */}
                <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-700 pt-3">
                  <div>
                    <p className="text-gray-500 mb-1">Matches</p>
                    <p className="text-white font-semibold">{player.matches}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Position</p>
                    <p className="text-white font-semibold">{player.position}</p>
                  </div>
                </div>
              </div>

              {/* Trend Indicator */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs">{player.nationality}</p>
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                    player.trend === 'up'
                      ? 'bg-green-500/20 text-green-400'
                      : player.trend === 'down'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-gray-700/50 text-gray-400'
                  }`}
                >
                  {player.trend === 'up' && <TrendingUp className="h-3 w-3" />}
                  {player.trend === 'down' && <TrendingDown className="h-3 w-3" />}
                  <span className="text-xs font-semibold capitalize">{player.trend}</span>
                </div>
              </div>
            </div>

            {/* Footer - Click to view profile */}
            <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 text-center">
              <p className="text-orange-400 text-xs font-semibold group-hover:text-orange-300 transition cursor-pointer">
                View Profile →
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
