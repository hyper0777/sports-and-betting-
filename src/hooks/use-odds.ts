import { useState, useEffect } from 'react';
import { fetchOdds, findMatchOdds, OddsData } from '@/api/the-odds-api';
import { Match } from '@/data/sportsData';

interface UseOddsState {
  odds: Record<string, OddsData>;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch live odds for a list of matches
 */
export function useOdds(matches: Match[]) {
  const [state, setState] = useState<UseOddsState>({
    odds: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!matches || matches.length === 0) {
      setState({ odds: {}, loading: false, error: null });
      return;
    }

    const fetchAllOdds = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Group matches by league
        const leagueSet = new Set(matches.map((m) => m.league));
        const oddsData: Record<string, OddsData> = {};

        // Fetch odds for each league
        for (const league of Array.from(leagueSet)) {
          try {
            const leagueOdds = await fetchOdds(league);

            // Find odds for each match in this league
            const leagueMatches = matches.filter((m) => m.league === league);
            for (const match of leagueMatches) {
              const matchOdds = findMatchOdds(leagueOdds, match.homeTeam, match.awayTeam);
              if (matchOdds) {
                oddsData[match.id] = matchOdds;
              }
            }
          } catch (error) {
            console.error(`Error fetching odds for ${league}:`, error);
          }
        }

        setState({
          odds: oddsData,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          odds: {},
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch odds',
        });
      }
    };

    fetchAllOdds();
  }, [matches]);

  return state;
}
