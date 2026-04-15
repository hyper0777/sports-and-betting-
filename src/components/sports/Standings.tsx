import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import { Standing } from '@/data/sportsData';

interface StandingsProps {
  standings: Standing[];
}

type SortField = 'rank' | 'team' | 'played' | 'points' | 'goalDifference';

export default function Standings({ standings }: StandingsProps) {
  const [sortBy, setSortBy] = useState<SortField>('points');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Group by league
  const leagues = Array.from(new Set(standings.map((s) => s.league)));
  const [selectedLeague, setSelectedLeague] = useState<string>(leagues[0] || '');

  const leagueStandings = standings
    .filter((s) => s.league === selectedLeague)
    .sort((a, b) => {
      let aVal: number | string = 0;
      let bVal: number | string = 0;

      switch (sortBy) {
        case 'rank':
          aVal = a.rank;
          bVal = b.rank;
          break;
        case 'team':
          aVal = a.team;
          bVal = b.team;
          break;
        case 'played':
          aVal = a.played;
          bVal = b.played;
          break;
        case 'points':
          aVal = a.points;
          bVal = b.points;
          break;
        case 'goalDifference':
          aVal = a.goalDifference;
          bVal = b.goalDifference;
          break;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal);
      }

      return sortOrder === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

  const handleSort = (field: SortField) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getFormColor = (result: string) => {
    switch (result) {
      case 'W':
        return 'bg-green-500/30 text-green-400 border-green-500/50';
      case 'D':
        return 'bg-yellow-500/30 text-yellow-400 border-yellow-500/50';
      case 'L':
        return 'bg-red-500/30 text-red-400 border-red-500/50';
      default:
        return 'bg-gray-700 text-gray-400';
    }
  };

  const SortHeader = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-2 hover:text-orange-400 transition font-semibold"
    >
      {label}
      <ArrowUpDown
        className={`h-4 w-4 transition ${
          sortBy === field ? 'text-orange-500' : 'text-gray-600'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">League Standings</h2>

        {/* League Selector */}
        {leagues.length > 1 && (
          <div className="flex gap-2 mb-4">
            {leagues.map((league) => (
              <button
                key={league}
                onClick={() => setSelectedLeague(league)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedLeague === league
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {league}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header */}
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm">
                  <SortHeader field="rank" label="Pos" />
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm">
                  <SortHeader field="team" label="Team" />
                </th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">
                  <SortHeader field="played" label="P" />
                </th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">W</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">D</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">L</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">GF</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">GA</th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">
                  <SortHeader field="goalDifference" label="GD" />
                </th>
                <th className="px-4 py-3 text-center text-gray-400 font-semibold text-sm">
                  <SortHeader field="points" label="Pts" />
                </th>
                <th className="px-4 py-3 text-left text-gray-400 font-semibold text-sm">Form</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-gray-700">
              {leagueStandings.map((standing, index) => (
                <tr
                  key={standing.team}
                  className={`hover:bg-gray-700/50 transition ${
                    index < 4 ? 'bg-green-500/5' : index >= leagueStandings.length - 3 ? 'bg-red-500/5' : ''
                  }`}
                >
                  {/* Position */}
                  <td className="px-4 py-3 text-white font-bold">{standing.rank}</td>

                  {/* Team */}
                  <td className="px-4 py-3 text-white font-semibold">{standing.team}</td>

                  {/* Played */}
                  <td className="px-4 py-3 text-center text-gray-300">{standing.played}</td>

                  {/* Wins */}
                  <td className="px-4 py-3 text-center text-green-400 font-semibold">{standing.wins}</td>

                  {/* Draws */}
                  <td className="px-4 py-3 text-center text-yellow-400 font-semibold">{standing.draws}</td>

                  {/* Losses */}
                  <td className="px-4 py-3 text-center text-red-400 font-semibold">{standing.losses}</td>

                  {/* Goals For */}
                  <td className="px-4 py-3 text-center text-gray-300">{standing.goalsFor}</td>

                  {/* Goals Against */}
                  <td className="px-4 py-3 text-center text-gray-300">{standing.goalsAgainst}</td>

                  {/* Goal Difference */}
                  <td
                    className={`px-4 py-3 text-center font-semibold ${
                      standing.goalDifference > 0
                        ? 'text-green-400'
                        : standing.goalDifference < 0
                          ? 'text-red-400'
                          : 'text-gray-300'
                    }`}
                  >
                    {standing.goalDifference > 0 ? '+' : ''}
                    {standing.goalDifference}
                  </td>

                  {/* Points */}
                  <td className="px-4 py-3 text-center text-orange-400 font-bold text-lg">{standing.points}</td>

                  {/* Form */}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {standing.form.split('').map((result, i) => (
                        <div
                          key={i}
                          className={`w-6 h-6 rounded-sm flex items-center justify-center text-xs font-bold border ${getFormColor(result)}`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/30 border border-green-500/50 rounded-sm" />
          <span>Champion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500/30 border border-blue-500/50 rounded-sm" />
          <span>Europa League</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500/30 border border-red-500/50 rounded-sm" />
          <span>Relegation</span>
        </div>
        <div className="flex items-center gap-2">
          <span>P = Played, W = Wins, D = Draws, L = Losses</span>
        </div>
      </div>
    </div>
  );
}
