import type { Match } from '@/data/sportsData';
import { TrendingUp, ShieldCheck } from 'lucide-react';

interface BettingInsightsProps {
  matches: Match[];
  onOpenMatch?: (matchId: string) => void;
}

export default function BettingInsights({ matches, onOpenMatch }: BettingInsightsProps) {
  const opportunities = matches
    .filter((m) => m.odds && m.prediction)
    .slice(0, 4)
    .map((m) => {
      const predicted = Math.max(m.prediction!.homeWin, m.prediction!.draw, m.prediction!.awayWin);
      const marketFavorite = Math.min(m.odds!.home, m.odds!.draw, m.odds!.away);
      const implied = (1 / marketFavorite) * 100;
      const edge = Math.max(0, predicted - implied);
      return { ...m, edge: edge.toFixed(1) };
    });

  return (
    <section className="bg-gray-900 rounded-xl border border-gray-800 p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Pro Betting SaaS Console</h2>
          <p className="text-sm text-gray-400">Real-time pricing + AI prediction engine</p>
        </div>
        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs bg-emerald-500/10 px-2 py-1 rounded-full">
          <ShieldCheck className="h-3 w-3" /> Risk Controls Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {opportunities.map((match) => (
          <button
            key={match.id}
            onClick={() => onOpenMatch?.(match.id)}
            className="text-left rounded-lg border border-gray-700 bg-gray-800 p-4 hover:border-orange-500 transition"
          >
            <p className="text-sm text-gray-400">{match.league}</p>
            <p className="font-semibold mt-1">{match.homeAbbr} vs {match.awayAbbr}</p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded bg-gray-900 p-2">
                <p className="text-gray-400">Home</p>
                <p className="font-semibold text-white">{match.odds?.home.toFixed(2)}</p>
              </div>
              <div className="rounded bg-gray-900 p-2">
                <p className="text-gray-400">Draw</p>
                <p className="font-semibold text-white">{match.odds?.draw.toFixed(2)}</p>
              </div>
              <div className="rounded bg-gray-900 p-2">
                <p className="text-gray-400">Away</p>
                <p className="font-semibold text-white">{match.odds?.away.toFixed(2)}</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-gray-300">Model edge</span>
              <span className="inline-flex items-center gap-1 text-orange-300">
                <TrendingUp className="h-4 w-4" /> +{match.edge}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
