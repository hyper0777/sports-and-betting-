import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, PlayCircle, Radio, ShieldCheck, TrendingUp } from 'lucide-react';
import { liveMatches } from '@/data/sportsData';
import { useScoreSimulator } from '@/components/sports/useScoreSimulator';
import QuickBet from '@/components/betting/QuickBet';

export default function MatchDetail() {
  const { matchId } = useParams();
  const scoreState = useScoreSimulator(liveMatches);
  const match = scoreState.matches.find((m) => m.id === matchId);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <p className="mt-8 text-gray-300">Match not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300">
          <ArrowLeft className="h-4 w-4" /> Back to live center
        </Link>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <p className="text-sm text-orange-400">{match.league}</p>
          <h1 className="text-3xl font-bold mt-2">{match.homeTeam} vs {match.awayTeam}</h1>
          <p className="text-gray-400 mt-2">{match.venue} · Matchday {match.matchday}</p>
          <div className="mt-4 text-4xl font-bold">{match.homeScore} - {match.awayScore}</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="aspect-video rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex flex-col items-center justify-center">
                <PlayCircle className="h-16 w-16 text-orange-400 mb-3" />
                <p className="text-lg font-semibold">Stream Player Placeholder</p>
                <p className="text-sm text-gray-400">Choose a source from the panel to start viewing.</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Pro Betting SaaS Insights</h2>
                <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 inline-flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> Verified Model
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                <div className="rounded-lg bg-gray-800 p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">Home Win Odds</p>
                  <p className="text-2xl font-semibold">{match.odds?.home.toFixed(2) ?? '-'}</p>
                </div>
                <div className="rounded-lg bg-gray-800 p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">Draw Odds</p>
                  <p className="text-2xl font-semibold">{match.odds?.draw.toFixed(2) ?? '-'}</p>
                </div>
                <div className="rounded-lg bg-gray-800 p-3 border border-gray-700">
                  <p className="text-xs text-gray-400">Away Win Odds</p>
                  <p className="text-2xl font-semibold">{match.odds?.away.toFixed(2) ?? '-'}</p>
                </div>
              </div>

              {match.prediction && (
                <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                  <p className="text-sm text-orange-300">AI Prediction</p>
                  <p className="text-xl font-semibold mt-1">
                    {match.prediction.recommendation.toUpperCase()} ({match.prediction.confidence.toUpperCase()} confidence)
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <p>H: <span className="font-semibold">{match.prediction.homeWin}%</span></p>
                    <p>D: <span className="font-semibold">{match.prediction.draw}%</span></p>
                    <p>A: <span className="font-semibold">{match.prediction.awayWin}%</span></p>
                  </div>
                  <p className="mt-2 text-sm text-emerald-300 inline-flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" /> Positive expected value detected
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {match.odds && (
              <QuickBet
                matchId={match.id}
                matchName={`${match.homeTeam} vs ${match.awayTeam}`}
                odds={match.odds}
                teamNames={{ home: match.homeTeam, away: match.awayTeam }}
              />
            )}

            <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <h2 className="text-lg font-semibold mb-4">Streaming sources</h2>
              <div className="space-y-3">
                {match.streamSources?.map((source) => (
                  <a
                    key={source.id}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg border border-gray-700 bg-gray-800 p-3 hover:border-orange-500 transition"
                  >
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{source.label}</p>
                      <span className="text-xs px-2 py-1 rounded-full bg-orange-500/20 text-orange-300">{source.quality}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1"><Radio className="h-3 w-3" /> {source.latency}</span>
                      <span>{source.language}</span>
                      {source.isOfficial && <span className="inline-flex items-center gap-1 text-emerald-400"><ShieldCheck className="h-3 w-3" /> Official</span>}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
