import { useState, useEffect } from 'react';
import { fetchLiveMatches, LiveMatch } from '@/api/allsports-api';

interface UseLiveMatchesState {
  matches: LiveMatch[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

/**
 * Hook to fetch live matches from AllSportsAPI
 * Automatically refetches every 30 seconds for live updates
 */
export function useLiveMatches(refreshInterval = 30000) {
  const [state, setState] = useState<UseLiveMatchesState>({
    matches: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const fetchMatches = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const liveMatches = await fetchLiveMatches();
        setState({
          matches: liveMatches,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch live matches',
        }));
      }
    };

    // Fetch immediately
    fetchMatches();

    // Set up interval for live updates
    const interval = setInterval(fetchMatches, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return state;
}
