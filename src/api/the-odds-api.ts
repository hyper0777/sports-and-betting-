/**
 * The Odds API Service
 * Fetches live betting odds for various sports
 */

export interface OddsResponse {
  id: string;
  home_team: string;
  away_team: string;
  commence_time: string;
  sport_key: string;
  sport_title: string;
  bookmakers: Bookmaker[];
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: Market[];
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number;
}

export interface OddsData {
  home: number;
  draw: number;
  away: number;
}

const API_KEY = import.meta.env.VITE_THE_ODDS_API_KEY;
const BASE_URL = 'https://api.the-odds-api.com/v4';

// Sport mappings for The Odds API
export const SPORT_MAPPINGS: Record<string, string> = {
  'Premier League': 'soccer_epl',
  'La Liga': 'soccer_spain_la_liga',
  'Serie A': 'soccer_italy_serie_a',
  'Bundesliga': 'soccer_germany_bundesliga',
  'Ligue 1': 'soccer_france_ligue_one',
  'NBA': 'basketball_nba',
  'MLB': 'baseball_mlb',
};

/**
 * Fetch live odds for a specific sport
 */
export async function fetchOdds(league: string): Promise<OddsResponse[]> {
  if (!API_KEY) {
    console.warn('VITE_THE_ODDS_API_KEY is not set. Using mock data.');
    return [];
  }

  const sportKey = SPORT_MAPPINGS[league];
  if (!sportKey) {
    console.warn(`Sport mapping not found for league: ${league}`);
    return [];
  }

  try {
    const url = `${BASE_URL}/sports/${sportKey}/odds/?regions=eu&markets=h2h&oddsFormat=decimal&apiKey=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`Failed to fetch odds: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching odds:', error);
    return [];
  }
}

/**
 * Parse odds from bookmaker data
 */
export function parseOdds(bookmakers: Bookmaker[]): OddsData | null {
  if (!bookmakers || bookmakers.length === 0) return null;

  const firstBookmaker = bookmakers[0];
  const h2hMarket = firstBookmaker.markets.find((m) => m.key === 'h2h');

  if (!h2hMarket || !h2hMarket.outcomes || h2hMarket.outcomes.length === 0) {
    return null;
  }

  // For h2h markets, we expect 2 or 3 outcomes (home, away, or home, draw, away)
  const outcomes = h2hMarket.outcomes;

  if (outcomes.length === 2) {
    // Two-way bet (e.g., NBA, MLB)
    return {
      home: outcomes[0].price,
      draw: 0,
      away: outcomes[1].price,
    };
  } else if (outcomes.length === 3) {
    // Three-way bet (e.g., Soccer)
    return {
      home: outcomes[0].price,
      draw: outcomes[1].price,
      away: outcomes[2].price,
    };
  }

  return null;
}

/**
 * Find and parse odds for a specific match
 */
export function findMatchOdds(
  allOdds: OddsResponse[],
  homeTeam: string,
  awayTeam: string
): OddsData | null {
  const match = allOdds.find(
    (m) =>
      (m.home_team.toLowerCase() === homeTeam.toLowerCase() &&
        m.away_team.toLowerCase() === awayTeam.toLowerCase()) ||
      (m.away_team.toLowerCase() === homeTeam.toLowerCase() &&
        m.home_team.toLowerCase() === awayTeam.toLowerCase())
  );

  if (!match) return null;

  return parseOdds(match.bookmakers);
}
