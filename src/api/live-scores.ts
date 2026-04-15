import { liveMatches } from '@/data/sportsData';
import type { Match } from '@/data/sportsData';
import { getSupabaseClientConfig } from '@/lib/supabaseConfig';

interface EdgeFunctionResponse {
  matches: Match[];
  source: 'api' | 'simulated' | 'error';
  apiInfo?: {
    provider: string;
    matchCount: number;
    timestamp: string;
  };
  message?: string;
  error?: string;
}

export async function fetchLiveScores() {
  try {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseClientConfig();

    const response = await fetch(
      `${supabaseUrl}/functions/v1/live-scores`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Edge function failed: ${response.status}`);
    }

    const data: EdgeFunctionResponse = await response.json();

    return {
      matches: data.matches || [],
      source: data.source,
      message: data.message || data.error,
    };
  } catch (error) {
    console.error('Error fetching live scores:', error);

    const simulatedMatches = liveMatches.map((match) => {
      if (match.status === 'live') {
        const elapsed = Math.floor(Math.random() * 90);
        const progressFactor = elapsed / 90;

        const homeScore = Math.floor(match.homeScore + Math.random() * progressFactor * 3);
        const awayScore = Math.floor(match.awayScore + Math.random() * progressFactor * 3);

        return {
          ...match,
          homeScore,
          awayScore,
        };
      }
      return match;
    });

    return {
      matches: simulatedMatches,
      source: 'simulated' as const,
      message: `Using fallback simulated data: ${error instanceof Error ? error.message : 'API unavailable'}`,
    };
  }
}

export default fetchLiveScores;
