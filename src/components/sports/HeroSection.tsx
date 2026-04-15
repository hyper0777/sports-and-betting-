import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Match } from '@/data/sportsData';
import { useOdds } from '@/hooks/use-odds';

interface HeroSectionProps {
  matches: Match[];
  onWatchClick?: (matchId: string) => void;
}

export default function HeroSection({ matches, onWatchClick }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const { odds: liveOdds } = useOdds(matches);

  const liveMatches = matches.filter((m) => m.status === 'live');
  const displayMatches = liveMatches.length > 0 ? liveMatches : matches.slice(0, 3);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayMatches.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, displayMatches.length]);

  const currentMatch = displayMatches[currentIndex];

  const goToPrevious = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + displayMatches.length) % displayMatches.length);
  };

  const goToNext = () => {
    setAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % displayMatches.length);
  };

  if (!currentMatch) return null;

  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg overflow-hidden mb-8">
      {/* Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left: Match Info */}
          <div>
            <div className="mb-4">
              <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                {currentMatch.status === 'live' ? '🔴 LIVE NOW' : 'FEATURED'}
              </span>
              <p className="text-gray-400 text-sm mt-2">{currentMatch.league}</p>
            </div>

            {/* Teams */}
            <div className="mb-8">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex-1 text-right">
                  <p className="text-white text-2xl md:text-4xl font-bold">{currentMatch.homeTeam}</p>
                  <p className="text-gray-400 text-sm">{currentMatch.homeAbbr}</p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="text-white text-4xl md:text-5xl font-bold">
                    {currentMatch.homeScore}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {currentMatch.status === 'live' && "LIVE"}
                    {currentMatch.status === 'halftime' && "HT"}
                    {currentMatch.status === 'finished' && "FT"}
                  </p>
                </div>

                <p className="text-gray-400 text-lg md:text-2xl font-bold">-</p>

                <div className="flex flex-col items-center">
                  <div className="text-white text-4xl md:text-5xl font-bold">
                    {currentMatch.awayScore}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-white text-2xl md:text-4xl font-bold">{currentMatch.awayTeam}</p>
                  <p className="text-gray-400 text-sm">{currentMatch.awayAbbr}</p>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex items-center justify-center gap-4 text-gray-300 text-sm">
                <span>📍 {currentMatch.venue}</span>
                {(liveOdds[currentMatch.id] || currentMatch.odds) && <span>•</span>}
                {(liveOdds[currentMatch.id] || currentMatch.odds) && (
                  <span className="text-orange-400">
                    {(() => {
                      const odds = liveOdds[currentMatch.id] || currentMatch.odds;
                      if (!odds) return null;
                      return odds.draw > 0
                        ? `Odds: ${odds.home.toFixed(2)}W - ${odds.draw.toFixed(2)}D - ${odds.away.toFixed(2)}A`
                        : `Odds: ${odds.home.toFixed(2)}W - ${odds.away.toFixed(2)}A`;
                    })()}
                  </span>
                )}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => onWatchClick?.(currentMatch.id)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
              >
                <Play className="h-5 w-5" />
                Watch Match
              </button>
              <button className="border border-gray-400 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold transition">
                View Stats
              </button>
            </div>
          </div>

          {/* Right: Live Ticker */}
          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              Live Updates
            </h3>

            {currentMatch.stats && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm text-gray-300 mb-2">
                    <span>Possession</span>
                    <span>{currentMatch.stats.possession.home}% - {currentMatch.stats.possession.away}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full"
                      style={{
                        width: `${currentMatch.stats.possession.home}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 border-t border-gray-700 pt-4">
                  <div>
                    <p className="text-orange-400 font-semibold">{currentMatch.stats.shots.home}</p>
                    <p className="text-xs text-gray-400">Shots</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-semibold">{currentMatch.stats.shots.away}</p>
                    <p className="text-xs text-gray-400">Shots</p>
                  </div>
                  <div>
                    <p className="text-blue-400 font-semibold">{currentMatch.stats.shotsOnTarget.home}</p>
                    <p className="text-xs text-gray-400">On Target</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-400 font-semibold">{currentMatch.stats.shotsOnTarget.away}</p>
                    <p className="text-xs text-gray-400">On Target</p>
                  </div>
                  <div>
                    <p className="text-green-400 font-semibold">{currentMatch.stats.corners.home}</p>
                    <p className="text-xs text-gray-400">Corners</p>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">{currentMatch.stats.corners.away}</p>
                    <p className="text-xs text-gray-400">Corners</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Carousel Controls */}
      <div className="relative z-10 flex justify-between items-center px-4 pb-4">
        <button
          onClick={goToPrevious}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="flex gap-2">
          {displayMatches.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setAutoplay(false);
                setCurrentIndex(index);
              }}
              className={`h-2 rounded-full transition ${
                index === currentIndex ? 'bg-orange-500 w-8' : 'bg-gray-600 w-2 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>

        <button
          onClick={goToNext}
          className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Auto-play Toggle */}
      <div className="relative z-10 px-4 pb-4 flex justify-center">
        <button
          onClick={() => setAutoplay(!autoplay)}
          className="text-sm text-gray-400 hover:text-white transition"
        >
          {autoplay ? '⏸ Auto-play' : '▶ Resume'}
        </button>
      </div>
    </section>
  );
}
