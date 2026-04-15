import { useState } from 'react';
import { Bell, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Match } from '@/data/sportsData';

interface UpcomingMatchesProps {
  matches: Match[];
  onMatchClick?: (matchId: string) => void;
}

export default function UpcomingMatches({ matches, onMatchClick }: UpcomingMatchesProps) {
  const [reminders, setReminders] = useState<Set<string>>(new Set());

  const upcomingMatches = matches
    .filter((m) => m.status === 'scheduled')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    .slice(0, 8);

  const toggleReminder = (matchId: string) => {
    const newReminders = new Set(reminders);
    if (newReminders.has(matchId)) {
      newReminders.delete(matchId);
    } else {
      newReminders.add(matchId);
    }
    setReminders(newReminders);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    const time = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    if (isToday) return `Today at ${time}`;
    if (isTomorrow) return `Tomorrow at ${time}`;
    return `${dateStr} at ${time}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Upcoming Matches</h2>
        <p className="text-gray-400 mb-6">Next {upcomingMatches.length} scheduled matches</p>
      </div>

      {upcomingMatches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {upcomingMatches.map((match) => (
            <div
              key={match.id}
              onClick={() => onMatchClick?.(match.id)}
              className="bg-gray-800 border border-gray-700 rounded-lg hover:border-orange-500 transition cursor-pointer overflow-hidden group"
            >
              {/* Header */}
              <div className="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs font-semibold uppercase">{match.league}</p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
                  UPCOMING
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Match Date/Time */}
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                  <Clock className="h-4 w-4 text-orange-400" />
                  <span>{formatDateTime(match.startTime)}</span>
                </div>

                {/* Teams */}
                <div className="space-y-3 mb-4">
                  {/* Home Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: match.homeTeamColor }}
                      >
                        {match.homeAbbr[0]}
                      </div>
                      <p className="text-white font-semibold text-sm truncate flex-1">{match.homeTeam}</p>
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <p className="text-gray-400 text-xs font-semibold">VS</p>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                        style={{ backgroundColor: match.awayTeamColor }}
                      >
                        {match.awayAbbr[0]}
                      </div>
                      <p className="text-white font-semibold text-sm truncate flex-1">{match.awayTeam}</p>
                    </div>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{match.venue}</span>
                </div>

                {/* Odds */}
                {match.odds && (
                  <div className="bg-gray-700/30 rounded-lg p-3 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-orange-400 font-semibold">{match.odds.home}</p>
                        <p className="text-gray-400 text-xs">Home</p>
                      </div>
                      <div>
                        <p className="text-orange-400 font-semibold">{match.odds.draw}</p>
                        <p className="text-gray-400 text-xs">Draw</p>
                      </div>
                      <div>
                        <p className="text-orange-400 font-semibold">{match.odds.away}</p>
                        <p className="text-gray-400 text-xs">Away</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reminder Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleReminder(match.id);
                  }}
                  className={`w-full py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    reminders.has(match.id)
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  {reminders.has(match.id) ? 'Reminder Set' : 'Set Reminder'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-800 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">No upcoming matches</p>
        </div>
      )}
    </div>
  );
}
