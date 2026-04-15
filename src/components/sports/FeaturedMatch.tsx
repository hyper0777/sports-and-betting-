import { X } from 'lucide-react';
import { Match } from '@/data/sportsData';

interface FeaturedMatchProps {
  match: Match;
  isOpen: boolean;
  onClose: () => void;
}

export default function FeaturedMatch({ match, isOpen, onClose }: FeaturedMatchProps) {
  if (!isOpen) return null;

  const mockPlayByPlay = [
    { minute: 12, type: 'goal', team: match.homeTeam, player: 'Marcus Johnson', description: 'Goal' },
    { minute: 18, type: 'yellow', team: match.awayTeam, player: 'David Smith', description: 'Yellow Card' },
    { minute: 31, type: 'goal', team: match.awayTeam, player: 'James Wilson', description: 'Goal' },
    { minute: 45, type: 'yellow', team: match.homeTeam, player: 'Robert Brown', description: 'Yellow Card' },
    { minute: 67, type: 'goal', team: match.homeTeam, player: 'Marcus Johnson', description: 'Goal' },
    { minute: 78, type: 'substitution', team: match.awayTeam, player: 'John Davis', description: 'Substitution' },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{match.league} - Match Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Header */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="grid grid-cols-3 gap-6 items-center mb-4">
              {/* Home Team */}
              <div className="text-center">
                <p className="text-white text-lg font-bold mb-2">{match.homeTeam}</p>
                <div className="text-4xl font-bold text-white">{match.homeScore}</div>
                <p className="text-gray-400 text-sm mt-2">{match.homeAbbr}</p>
              </div>

              {/* Status */}
              <div className="text-center">
                <p className="text-gray-400 text-sm font-semibold uppercase">
                  {match.status === 'live' && '🔴 LIVE'}
                  {match.status === 'finished' && 'FINISHED'}
                  {match.status === 'halftime' && 'HALFTIME'}
                </p>
                <p className="text-gray-500 text-xs mt-2">{match.venue}</p>
              </div>

              {/* Away Team */}
              <div className="text-center">
                <p className="text-white text-lg font-bold mb-2">{match.awayTeam}</p>
                <div className="text-4xl font-bold text-white">{match.awayScore}</div>
                <p className="text-gray-400 text-sm mt-2">{match.awayAbbr}</p>
              </div>
            </div>

            {/* Match Info */}
            <div className="text-center text-gray-400 text-sm border-t border-gray-700 pt-4">
              <p>Matchday {match.matchday}</p>
              {match.odds && (
                <p className="mt-2">
                  Odds: {match.odds.home}W - {match.odds.draw}D - {match.odds.away}A
                </p>
              )}
            </div>
          </div>

          {/* Statistics */}
          {match.stats && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Match Statistics</h3>

              {/* Possession */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{match.stats.possession.home}%</span>
                  <span className="font-semibold">Possession</span>
                  <span>{match.stats.possession.away}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden flex">
                  <div
                    className="bg-orange-500"
                    style={{ width: `${match.stats.possession.home}%` }}
                  />
                  <div
                    className="bg-blue-500"
                    style={{ width: `${match.stats.possession.away}%` }}
                  />
                </div>
              </div>

              {/* Shots */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{match.stats.shots.home}</span>
                  <span className="font-semibold">Shots</span>
                  <span>{match.stats.shots.away}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-orange-500"
                    style={{
                      width: `${(match.stats.shots.home / (match.stats.shots.home + match.stats.shots.away)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-blue-500"
                    style={{
                      width: `${(match.stats.shots.away / (match.stats.shots.home + match.stats.shots.away)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Shots on Target */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{match.stats.shotsOnTarget.home}</span>
                  <span className="font-semibold">On Target</span>
                  <span>{match.stats.shotsOnTarget.away}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-green-500"
                    style={{
                      width: `${(match.stats.shotsOnTarget.home / (match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away || 1)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-green-400"
                    style={{
                      width: `${(match.stats.shotsOnTarget.away / (match.stats.shotsOnTarget.home + match.stats.shotsOnTarget.away || 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Corners */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{match.stats.corners.home}</span>
                  <span className="font-semibold">Corners</span>
                  <span>{match.stats.corners.away}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-yellow-500"
                    style={{
                      width: `${(match.stats.corners.home / (match.stats.corners.home + match.stats.corners.away)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-yellow-400"
                    style={{
                      width: `${(match.stats.corners.away / (match.stats.corners.home + match.stats.corners.away)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Fouls */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{match.stats.fouls.home}</span>
                  <span className="font-semibold">Fouls</span>
                  <span>{match.stats.fouls.away}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-red-500"
                    style={{
                      width: `${(match.stats.fouls.home / (match.stats.fouls.home + match.stats.fouls.away)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-red-400"
                    style={{
                      width: `${(match.stats.fouls.away / (match.stats.fouls.home + match.stats.fouls.away)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Passes */}
              <div>
                <div className="flex justify-between text-sm text-gray-300 mb-2">
                  <span>{match.stats.passes.home}</span>
                  <span className="font-semibold">Passes</span>
                  <span>{match.stats.passes.away}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden flex">
                  <div
                    className="bg-purple-500"
                    style={{
                      width: `${(match.stats.passes.home / (match.stats.passes.home + match.stats.passes.away)) * 100}%`,
                    }}
                  />
                  <div
                    className="bg-purple-400"
                    style={{
                      width: `${(match.stats.passes.away / (match.stats.passes.home + match.stats.passes.away)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Play-by-Play */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Play-by-Play</h3>
            <div className="space-y-2">
              {mockPlayByPlay.map((event, index) => (
                <div key={index} className="flex gap-4 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="text-gray-400 font-semibold min-w-12">{event.minute}'</div>
                  <div className="flex-1">
                    <p className="text-white font-semibold">{event.player}</p>
                    <p className="text-gray-400 text-sm">{event.team}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded">
                      {event.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
