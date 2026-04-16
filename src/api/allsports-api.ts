/**
 * AllSportsAPI Service
 * Fetches live sports data from AllSportsAPI2
 */

export interface LiveMatch {
  id: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: string;
  startTime: string;
  venue?: string;
}

const API_KEY = import.meta.env.VITE_ALLSPORTS_API_KEY;
const API_HOST = 'allsportsapi2.p.rapidapi.com';
const BASE_URL = 'https://allsportsapi2.p.rapidapi.com/api';

/**
 * Fetch live matches from AllSportsAPI
 */
export async function fetchLiveMatches(): Promise<LiveMatch[]> {
  if (!API_KEY) {
    console.warn('VITE_ALLSPORTS_API_KEY is not set. Using mock data.');
    return [];
  }

  try {
    const url = `${BASE_URL}/matches/live`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(`Failed to fetch live matches: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // Transform API response to our format
    if (Array.isArray(data)) {
      return data.map((match: any) => ({
        id: match.id || `${match.home_team}-${match.away_team}-${match.start_time}`,
        league: match.league || 'Unknown',
        homeTeam: match.home_team || 'Unknown',
        awayTeam: match.away_team || 'Unknown',
        homeScore: match.home_score || 0,
        awayScore: match.away_score || 0,
        status: match.status || 'scheduled',
        startTime: match.start_time || new Date().toISOString(),
        venue: match.venue,
      }));
    }

    return [];
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
}

/**
 * Fetch matches for a specific league
 */
export async function fetchLeagueMatches(league: string): Promise<LiveMatch[]> {
  if (!API_KEY) {
    console.warn('VITE_ALLSPORTS_API_KEY is not set.');
    return [];
  }

  try {
    const url = `${BASE_URL}/matches/league/${encodeURIComponent(league)}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(`Failed to fetch ${league} matches: ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    if (Array.isArray(data)) {
      return data.map((match: any) => ({
        id: match.id || `${match.home_team}-${match.away_team}-${match.start_time}`,
        league: match.league || league,
        homeTeam: match.home_team || 'Unknown',
        awayTeam: match.away_team || 'Unknown',
        homeScore: match.home_score || 0,
        awayScore: match.away_score || 0,
        status: match.status || 'scheduled',
        startTime: match.start_time || new Date().toISOString(),
        venue: match.venue,
      }));
    }

    return [];
  } catch (error) {
    console.error(`Error fetching ${league} matches:`, error);
    return [];
  }
}

/**
 * Fetch a specific match by ID
 */
export async function fetchMatchById(matchId: string): Promise<LiveMatch | null> {
  if (!API_KEY) {
    console.warn('VITE_ALLSPORTS_API_KEY is not set.');
    return null;
  }

  try {
    const url = `${BASE_URL}/matches/${encodeURIComponent(matchId)}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': API_KEY,
        'x-rapidapi-host': API_HOST,
        'Content-Type': 'application/json',
      },
    };

    const response = await fetch(url, options);

    if (!response.ok) {
      console.error(`Failed to fetch match ${matchId}: ${response.statusText}`);
      return null;
    }

    const match = await response.json();

    return {
      id: match.id || matchId,
      league: match.league || 'Unknown',
      homeTeam: match.home_team || 'Unknown',
      awayTeam: match.away_team || 'Unknown',
      homeScore: match.home_score || 0,
      awayScore: match.away_score || 0,
      status: match.status || 'scheduled',
      startTime: match.start_time || new Date().toISOString(),
      venue: match.venue,
    };
  } catch (error) {
    console.error(`Error fetching match ${matchId}:`, error);
    return null;
  }
}
