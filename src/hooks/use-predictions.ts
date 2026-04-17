import { useState, useEffect } from 'react';
import { fetchDailyPredictions, fetchMatchPrediction, DailyPrediction } from '@/api/predictions-api';
import { MatchPrediction } from '@/data/sportsData';

interface UsePredictionsState {
  predictions: DailyPrediction[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

interface UseMatchPredictionState {
  prediction: MatchPrediction | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch daily predictions for all matches
 * Automatically refetches every 6 hours for updates
 */
export function useDailyPredictions(refreshInterval = 6 * 60 * 60 * 1000) {
  const [state, setState] = useState<UsePredictionsState>({
    predictions: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const fetchPredictions = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const dailyPredictions = await fetchDailyPredictions();
        setState({
          predictions: dailyPredictions,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch predictions',
        }));
      }
    };

    // Fetch immediately
    fetchPredictions();

    // Set up interval for periodic updates
    const interval = setInterval(fetchPredictions, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  return state;
}

/**
 * Hook to fetch prediction for a specific match
 */
export function useMatchPrediction(matchId: string | null) {
  const [state, setState] = useState<UseMatchPredictionState>({
    prediction: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!matchId) {
      setState({
        prediction: null,
        loading: false,
        error: null,
      });
      return;
    }

    const fetchPrediction = async () => {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const prediction = await fetchMatchPrediction(matchId);
        setState({
          prediction,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : 'Failed to fetch prediction',
        }));
      }
    };

    fetchPrediction();
  }, [matchId]);

  return state;
}

/**
 * Hook to search/filter predictions
 */
export function useFilteredPredictions(
  predictions: DailyPrediction[],
  searchTerm: string,
  league?: string
) {
  return predictions.filter((pred) => {
    const matchesSearch = !searchTerm ||
      pred.homeTeam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pred.awayTeam.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLeague = !league || pred.league.toLowerCase() === league.toLowerCase();

    return matchesSearch && matchesLeague;
  });
}
