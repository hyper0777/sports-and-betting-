/**
 * Predictions API Service
 * Fetches AI-powered daily match predictions
 */

import { MatchPrediction } from '@/data/sportsData';

export interface DailyPrediction {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  matchTime: string;
  prediction: MatchPrediction;
  model: string;
  accuracy: number;
  lastUpdated: string;
}

const API_KEY = import.meta.env.VITE_PREDICTIONS_API_KEY;
const BASE_URL = 'https://api-football-v1.p.rapidapi.com';

/**
 * Fetch daily predictions for upcoming matches
 */
export async function fetchDailyPredictions(): Promise<DailyPrediction[]> {
  if (!API_KEY) {
    console.warn('VITE_PREDICTIONS_API_KEY is not set. Using mock predictions.');
    return generateMockPredictions();
  }

  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const url = `${BASE_URL}/predictions/?date=${formattedDate}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(`Failed to fetch predictions: ${response.statusText}`);
      return generateMockPredictions();
    }

    const data = await response.json();

    if (!data.response || !Array.isArray(data.response)) {
      return generateMockPredictions();
    }

    // Transform API response to our format
    return data.response.map((pred: any) => ({
      matchId: pred.fixture?.id?.toString() || `match_${Date.now()}`,
      homeTeam: pred.teams?.home?.name || 'Unknown',
      awayTeam: pred.teams?.away?.name || 'Unknown',
      league: pred.league?.name || 'Unknown League',
      matchTime: pred.fixture?.date || new Date().toISOString(),
      prediction: {
        homeWin: pred.predictions?.win?.home || 0,
        draw: pred.predictions?.win?.draw || 0,
        awayWin: pred.predictions?.win?.away || 0,
        recommendation: determineBestPick(
          pred.predictions?.win?.home || 0,
          pred.predictions?.win?.draw || 0,
          pred.predictions?.win?.away || 0
        ),
        confidence: determineConfidence(
          Math.max(
            pred.predictions?.win?.home || 0,
            pred.predictions?.win?.draw || 0,
            pred.predictions?.win?.away || 0
          )
        ),
      },
      model: pred.predictions?.model || 'Standard AI Model',
      accuracy: pred.predictions?.accuracy || 0.75,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return generateMockPredictions();
  }
}

/**
 * Fetch predictions for a specific match
 */
export async function fetchMatchPrediction(matchId: string): Promise<MatchPrediction | null> {
  if (!API_KEY) {
    return generateMockMatchPrediction();
  }

  try {
    const url = `${BASE_URL}/predictions/?fixture=${matchId}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      return generateMockMatchPrediction();
    }

    const data = await response.json();

    if (!data.response || data.response.length === 0) {
      return generateMockMatchPrediction();
    }

    const pred = data.response[0];

    return {
      homeWin: pred.predictions?.win?.home || 0,
      draw: pred.predictions?.win?.draw || 0,
      awayWin: pred.predictions?.win?.away || 0,
      recommendation: determineBestPick(
        pred.predictions?.win?.home || 0,
        pred.predictions?.win?.draw || 0,
        pred.predictions?.win?.away || 0
      ),
      confidence: determineConfidence(
        Math.max(
          pred.predictions?.win?.home || 0,
          pred.predictions?.win?.draw || 0,
          pred.predictions?.win?.away || 0
        )
      ),
    };
  } catch (error) {
    console.error(`Error fetching prediction for match ${matchId}:`, error);
    return generateMockMatchPrediction();
  }
}

/**
 * Fetch predictions by league
 */
export async function fetchLeaguePredictions(league: string): Promise<DailyPrediction[]> {
  if (!API_KEY) {
    return generateMockPredictions();
  }

  try {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    const url = `${BASE_URL}/predictions/?league=${league}&date=${formattedDate}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      return generateMockPredictions();
    }

    const data = await response.json();

    if (!data.response || !Array.isArray(data.response)) {
      return generateMockPredictions();
    }

    return data.response.map((pred: any) => ({
      matchId: pred.fixture?.id?.toString() || `match_${Date.now()}`,
      homeTeam: pred.teams?.home?.name || 'Unknown',
      awayTeam: pred.teams?.away?.name || 'Unknown',
      league: pred.league?.name || league,
      matchTime: pred.fixture?.date || new Date().toISOString(),
      prediction: {
        homeWin: pred.predictions?.win?.home || 0,
        draw: pred.predictions?.win?.draw || 0,
        awayWin: pred.predictions?.win?.away || 0,
        recommendation: determineBestPick(
          pred.predictions?.win?.home || 0,
          pred.predictions?.win?.draw || 0,
          pred.predictions?.win?.away || 0
        ),
        confidence: determineConfidence(
          Math.max(
            pred.predictions?.win?.home || 0,
            pred.predictions?.win?.draw || 0,
            pred.predictions?.win?.away || 0
          )
        ),
      },
      model: pred.predictions?.model || 'Standard AI Model',
      accuracy: pred.predictions?.accuracy || 0.75,
      lastUpdated: new Date().toISOString(),
    }));
  } catch (error) {
    console.error(`Error fetching predictions for ${league}:`, error);
    return generateMockPredictions();
  }
}

/**
 * Helper function to determine best pick
 */
function determineBestPick(
  homeWin: number,
  draw: number,
  awayWin: number
): 'home' | 'draw' | 'away' {
  const max = Math.max(homeWin, draw, awayWin);
  if (max === homeWin) return 'home';
  if (max === awayWin) return 'away';
  return 'draw';
}

/**
 * Helper function to determine confidence level
 */
function determineConfidence(probability: number): 'low' | 'medium' | 'high' {
  if (probability >= 0.6) return 'high';
  if (probability >= 0.4) return 'medium';
  return 'low';
}

/**
 * Generate mock predictions for development/fallback
 */
function generateMockPredictions(): DailyPrediction[] {
  return [
    {
      matchId: 'mock_1',
      homeTeam: 'Manchester City',
      awayTeam: 'Liverpool',
      league: 'Premier League',
      matchTime: new Date().toISOString(),
      prediction: {
        homeWin: 55,
        draw: 25,
        awayWin: 20,
        recommendation: 'home',
        confidence: 'high',
      },
      model: 'AI Prediction Model v1.0',
      accuracy: 0.82,
      lastUpdated: new Date().toISOString(),
    },
    {
      matchId: 'mock_2',
      homeTeam: 'Barcelona',
      awayTeam: 'Real Madrid',
      league: 'La Liga',
      matchTime: new Date().toISOString(),
      prediction: {
        homeWin: 48,
        draw: 28,
        awayWin: 24,
        recommendation: 'home',
        confidence: 'medium',
      },
      model: 'AI Prediction Model v1.0',
      accuracy: 0.79,
      lastUpdated: new Date().toISOString(),
    },
  ];
}

/**
 * Generate mock prediction for a single match
 */
function generateMockMatchPrediction(): MatchPrediction {
  return {
    homeWin: 52,
    draw: 26,
    awayWin: 22,
    recommendation: 'home',
    confidence: 'high',
  };
}
