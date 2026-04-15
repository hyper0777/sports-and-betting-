import { useState } from 'react';
import { Star } from 'lucide-react';
import { Match } from '@/data/sportsData';

interface LiveScoreCardProps {
  match: Match;
  onFavoriteToggle?: (matchId: string) => void;
  onCardClick?: (matchId: string) => void;
}

export default function LiveScoreCard({ match, onFavoriteToggle, onCardClick }: LiveScoreCardProps) {
  const [isFavorite, setIsFavorite] = useState(match.isFavorite || false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(match.id);
  };

  const getStatusBadge = () => {
    switch (match.status) {
      case 'live':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-semibold rounded-full animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            LIVE
          </span>
        );
      case 'halftime':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full">
            HT
          </span>
        );
      case 'finished':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-400 text-xs font-semibold rounded-full">
            FT
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-semibold rounded-full">
            UPCOMING
          </span>
        );
    }
  };

  const getTimeString = () => {
    const date = new Date(match.startTime);
    const now = new Date();
    
    if (match.status === 'live' || match.status === 'halftime') {
      return 'In Progress';
    }
    
    if (match.status === 'finished') {
      return 'Finished';
    }
    
    if (match.status === 'scheduled') {
      const hours = Math.floor((date.getTime() - now.getTime()) / (1000 * 60 * 60));
      if (hours < 24) {
        return `in ${hours}h`;
      }
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  return (
    <div
      onClick={() => onCardClick?.(match.id)}
      className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-orange-500 transition cursor-pointer group"
    >
      {/* Header */}
      <div className="bg-gray-900 p-4 border-b border-gray-700 flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wide">{match.league}</p>
          <p className="text-gray-300 text-xs mt-1">{match.venue}</p>
        </div>
        <button
          onClick={handleFavoriteClick}
          className="ml-auto text-gray-400 hover:text-orange-500 transition"
        >
          <Star
            className="h-5 w-5"
            fill={isFavorite ? 'currentColor' : 'none'}
            color={isFavorite ? '#f97316' : 'currentColor'}
          />
        </button>
      </div>

      {/* Main Score */}
      <div className="p-6">
        {/* Status */}
        <div className="mb-4 flex justify-between items-start">
          <div>{getStatusBadge()}</div>
          <p className="text-gray-400 text-xs">{getTimeString()}</p>
        </div>

        {/* Teams and Scores */}
        <div className="space-y-3 mb-4">
          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: match.homeTeamColor }}
              >
                {match.homeAbbr[0]}
              </div>
              <p className="text-white font-semibold text-sm truncate flex-1">{match.homeTeam}</p>
            </div>
            <p className="text-white text-2xl font-bold ml-2 w-12 text-right">{match.homeScore}</p>
          </div>

          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: match.awayTeamColor }}
              >
                {match.awayAbbr[0]}
              </div>
              <p className="text-white font-semibold text-sm truncate flex-1">{match.awayTeam}</p>
            </div>
            <p className="text-white text-2xl font-bold ml-2 w-12 text-right">{match.awayScore}</p>
          </div>
        </div>

        {/* Odds */}
        {match.odds && (
          <div className="bg-gray-700/30 rounded-lg p-3 text-xs text-gray-300">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-orange-400 font-semibold">{match.odds.home}</p>
                <p className="text-gray-400 text-xs">Win</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-orange-400 font-semibold">{match.odds.draw}</p>
                <p className="text-gray-400 text-xs">Draw</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-orange-400 font-semibold">{match.odds.away}</p>
                <p className="text-gray-400 text-xs">Win</p>
              </div>
            </div>
          </div>
        )}

        {match.prediction && (
          <div className="mt-3 rounded-lg bg-orange-500/10 border border-orange-500/20 p-2">
            <p className="text-[11px] text-orange-300 font-semibold">AI Pick: {match.prediction.recommendation.toUpperCase()} ({match.prediction.confidence})</p>
            <p className="text-[11px] text-gray-300">Model: H {match.prediction.homeWin}% · D {match.prediction.draw}% · A {match.prediction.awayWin}%</p>
          </div>
        )}

      </div>

      {/* Footer - Click to expand */}
      <div className="px-6 py-3 bg-gray-900 border-t border-gray-700 text-center">
        <p className="text-orange-400 text-sm font-semibold group-hover:text-orange-300 transition">
          View Details →
        </p>
      </div>
    </div>
  );
}
