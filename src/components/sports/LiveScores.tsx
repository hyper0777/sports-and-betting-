import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Match } from '@/data/sportsData';
import LiveScoreCard from './LiveScoreCard';

interface LiveScoresProps {
  matches: Match[];
  onMatchClick?: (matchId: string) => void;
}

export default function LiveScores({ matches, onMatchClick }: LiveScoresProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'finished' | 'scheduled'>('all');
  const [leagueFilter, setLeagueFilter] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'time' | 'league'>('time');

  // Get unique leagues
  const leagues = Array.from(new Set(matches.map((m) => m.league))).sort();

  // Filter matches
  let filteredMatches = matches.filter((match) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      match.homeTeam.toLowerCase().includes(searchLower) ||
      match.awayTeam.toLowerCase().includes(searchLower) ||
      match.league.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;

    // Status filter
    if (statusFilter !== 'all' && match.status !== statusFilter) return false;

    // League filter
    if (leagueFilter !== 'all' && match.league !== leagueFilter) return false;

    // Favorites filter
    if (showFavoritesOnly && !match.isFavorite) return false;

    return true;
  });

  // Sort matches
  if (sortBy === 'time') {
    filteredMatches.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  } else if (sortBy === 'league') {
    filteredMatches.sort((a, b) => a.league.localeCompare(b.league));
  }

  const liveCount = matches.filter((m) => m.status === 'live').length;
  const finishedCount = matches.filter((m) => m.status === 'finished').length;
  const scheduledCount = matches.filter((m) => m.status === 'scheduled').length;

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search teams, leagues..."
              className="w-full pl-10 pr-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm text-gray-400 font-semibold mb-2">
              <Filter className="h-4 w-4 inline mr-2" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 transition"
            >
              <option value="all">All Status</option>
              <option value="live">Live ({liveCount})</option>
              <option value="finished">Finished ({finishedCount})</option>
              <option value="scheduled">Upcoming ({scheduledCount})</option>
            </select>
          </div>

          {/* League Filter */}
          <div>
            <label className="block text-sm text-gray-400 font-semibold mb-2">League</label>
            <select
              value={leagueFilter}
              onChange={(e) => setLeagueFilter(e.target.value)}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 transition"
            >
              <option value="all">All Leagues</option>
              {leagues.map((league) => (
                <option key={league} value={league}>
                  {league}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm text-gray-400 font-semibold mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 transition"
            >
              <option value="time">By Time</option>
              <option value="league">By League</option>
            </select>
          </div>

          {/* Favorites Toggle */}
          <div className="flex items-end">
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`w-full py-2 px-3 rounded-lg font-semibold transition ${
                showFavoritesOnly
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500'
                  : 'bg-gray-900 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {showFavoritesOnly ? '⭐ Favorites' : '☆ Favorites'}
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-400">
          Showing {filteredMatches.length} of {matches.length} matches
        </div>
      </div>

      {/* Matches Grid */}
      {filteredMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMatches.map((match) => (
            <LiveScoreCard
              key={match.id}
              match={match}
              onCardClick={onMatchClick}
              onFavoriteToggle={(matchId) => {
                // Handle favorite toggle
                match.isFavorite = !match.isFavorite;
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No matches found</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your filters or search query</p>
        </div>
      )}
    </div>
  );
}
