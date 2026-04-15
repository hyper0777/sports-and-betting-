import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

type MatchStatus = 'live' | 'finished' | 'scheduled' | 'halftime';
type FootballResource =
  | 'live-scores'
  | 'live-events'
  | 'news'
  | 'highlights'
  | 'statistics'
  | 'players'
  | 'lineups'
  | 'team-statistics'
  | 'competitions'
  | 'leagues';

type GenericFixture = {
  fixtureId: number;
  date: string;
  statusShort: string;
  homeTeam: string;
  awayTeam: string;
  homeGoals: number | null;
  awayGoals: number | null;
  leagueName: string;
  venueName: string;
  round?: string;
};

interface APIFootballFixture {
  fixture: {
    id: number;
    date: string;
    status: {
      short: string;
    };
    venue: {
      name: string;
    };
  };
  teams: {
    home: {
      name: string;
    };
    away: {
      name: string;
    };
  };
  goals: {
    home: number | null;
    away: number | null;
  };
  league: {
    name: string;
    round: string;
  };
}

const teamColors: Record<string, { home: string; away: string }> = {
  'Manchester United': { home: '#DA291C', away: '#DA291C' },
  'Liverpool': { home: '#C8102E', away: '#C8102E' },
  'Arsenal': { home: '#EF0107', away: '#EF0107' },
  'Chelsea': { home: '#034694', away: '#034694' },
  'Manchester City': { home: '#6CABDA', away: '#6CABDA' },
  'Tottenham': { home: '#FFFFFF', away: '#FFFFFF' },
  'Paris Saint-Germain': { home: '#004687', away: '#004687' },
  'Marseille': { home: '#006BA6', away: '#006BA6' },
  'Real Madrid': { home: '#FFFFFF', away: '#FFFFFF' },
  'Barcelona': { home: '#004687', away: '#004687' },
  'Bayern Munich': { home: '#DC052D', away: '#DC052D' },
  'Borussia Dortmund': { home: '#FFD700', away: '#FFD700' },
  'Inter Milan': { home: '#000000', away: '#000000' },
  'AC Milan': { home: '#DC0000', away: '#DC0000' },
};

function mapFixtureStatus(status: string): MatchStatus {
  const normalized = status.toUpperCase();
  const statusMap: Record<string, MatchStatus> = {
    NS: 'scheduled',
    TBD: 'scheduled',
    SCHEDULED: 'scheduled',
    NOT_STARTED: 'scheduled',
    UPCOMING: 'scheduled',
    '1H': 'live',
    '2H': 'live',
    LIVE: 'live',
    IN_PLAY: 'live',
    ET: 'live',
    P: 'live',
    HT: 'halftime',
    HALFTIME: 'halftime',
    FT: 'finished',
    FINISHED: 'finished',
    ENDED: 'finished',
    AET: 'finished',
    PEN: 'finished',
    PST: 'finished',
    CANC: 'finished',
    ABD: 'finished',
    SUSP: 'live',
  };

  return statusMap[normalized] || 'scheduled';
}

function getTeamAbbreviation(teamName: string): string {
  const words = teamName.split(' ');
  if (words.length === 1) {
    return teamName.substring(0, 3).toUpperCase();
  }
  return words.map((w) => w[0]).join('').substring(0, 3).toUpperCase();
}

function toNumberOrNull(value: unknown): number | null {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
    return Number(value);
  }
  return null;
}

function extractFixtures(payload: unknown): GenericFixture[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  const data = payload as Record<string, unknown>;

  // API-Football shape
  if (Array.isArray(data.response)) {
    return data.response
      .map((item) => {
        const fixture = item as APIFootballFixture;
        if (!fixture?.fixture?.id || !fixture?.teams?.home?.name || !fixture?.teams?.away?.name) {
          return null;
        }

        return {
          fixtureId: fixture.fixture.id,
          date: fixture.fixture.date,
          statusShort: fixture.fixture.status?.short || 'NS',
          homeTeam: fixture.teams.home.name,
          awayTeam: fixture.teams.away.name,
          homeGoals: fixture.goals?.home ?? 0,
          awayGoals: fixture.goals?.away ?? 0,
          leagueName: fixture.league?.name || 'Unknown League',
          venueName: fixture.fixture.venue?.name || 'TBD',
          round: fixture.league?.round,
        };
      })
      .filter((item): item is GenericFixture => item !== null);
  }

  // Some free football APIs return an array directly or under data/events/results
  const candidateArrays: unknown[] = [];
  if (Array.isArray(data.data)) candidateArrays.push(data.data);
  if (Array.isArray(data.events)) candidateArrays.push(data.events);
  if (Array.isArray(data.results)) candidateArrays.push(data.results);
  if (Array.isArray(payload)) candidateArrays.push(payload);

  for (const candidate of candidateArrays) {
    const rows = candidate as Record<string, unknown>[];
    const normalized = rows
      .map((row) => {
        const fixtureId = toNumberOrNull(row.fixture_id ?? row.id ?? row.event_id ?? row.match_id);
        const homeTeam = String(
          row.homeTeam ?? row.home_team ?? row.event_home_team ?? row.team_home ?? ''
        ).trim();
        const awayTeam = String(
          row.awayTeam ?? row.away_team ?? row.event_away_team ?? row.team_away ?? ''
        ).trim();

        if (!fixtureId || !homeTeam || !awayTeam) {
          return null;
        }

        return {
          fixtureId,
          date: String(row.date ?? row.event_date ?? row.match_date ?? new Date().toISOString()),
          statusShort: String(
            row.status ?? row.event_status ?? row.state ?? row.match_status ?? 'NS'
          ),
          homeTeam,
          awayTeam,
          homeGoals: toNumberOrNull(
            row.homeGoals ?? row.home_score ?? row.event_home_final_result ?? row.goals_home
          ),
          awayGoals: toNumberOrNull(
            row.awayGoals ?? row.away_score ?? row.event_away_final_result ?? row.goals_away
          ),
          leagueName: String(row.league ?? row.league_name ?? row.tournament ?? 'Unknown League'),
          venueName: String(row.venue ?? row.stadium ?? row.location ?? 'TBD'),
          round: String(row.round ?? row.stage ?? ''),
        };
      })
      .filter((item): item is GenericFixture => item !== null);

    if (normalized.length > 0) {
      return normalized;
    }
  }

  return [];
}

function parseResource(resource: string | null): FootballResource {
  const normalized = (resource || 'live-scores').toLowerCase();
  const allowed: FootballResource[] = [
    'live-scores',
    'live-events',
    'news',
    'highlights',
    'statistics',
    'players',
    'lineups',
    'team-statistics',
    'competitions',
    'leagues',
  ];

  return allowed.includes(normalized as FootballResource)
    ? (normalized as FootballResource)
    : 'live-scores';
}

function buildFreeFootballEndpoint(
  resource: FootballResource,
  searchParams: URLSearchParams,
  today: string,
): string {
  const date = searchParams.get('date') || today;
  const eventId = searchParams.get('eventId');
  const teamId = searchParams.get('teamId');
  const playerId = searchParams.get('playerId');
  const leagueId = searchParams.get('leagueId');
  const competitionId = searchParams.get('competitionId');
  const season = searchParams.get('season') || new Date().getUTCFullYear().toString();

  const base = 'https://free-football-api-data.p.rapidapi.com';

  const withQuery = (path: string, query: Record<string, string | null | undefined>) => {
    const qs = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value && value.trim() !== '') {
        qs.set(key, value);
      }
    }
    const suffix = qs.toString();
    return `${base}${path}${suffix ? `?${suffix}` : ''}`;
  };

  switch (resource) {
    case 'live-events':
    case 'live-scores':
      return withQuery('/football-events', { date });
    case 'news':
      return withQuery('/football-news', { date, league_id: leagueId, team_id: teamId });
    case 'highlights':
      return withQuery('/football-highlights', { date, event_id: eventId, team_id: teamId });
    case 'statistics':
      return withQuery('/football-event-statistics', { event_id: eventId });
    case 'players':
      return withQuery('/football-players', { team_id: teamId, league_id: leagueId, season, player_id: playerId });
    case 'lineups':
      return withQuery('/football-lineups', { event_id: eventId });
    case 'team-statistics':
      return withQuery('/football-team-statistics', {
        team_id: teamId,
        league_id: leagueId,
        season,
      });
    case 'competitions':
      return withQuery('/football-competitions', {
        season,
        country: searchParams.get('country'),
        competition_id: competitionId,
      });
    case 'leagues':
      return withQuery('/football-leagues', { season, country: searchParams.get('country') });
    default:
      return withQuery('/football-events', { date });
  }
}

function getNestedValue(obj: Record<string, unknown>, path: string[]): unknown {
  return path.reduce<unknown>((acc, key) => {
    if (!acc || typeof acc !== 'object') {
      return undefined;
    }
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function toString(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    const resource = parseResource(url.searchParams.get('resource'));
    const passthroughParams = new URLSearchParams(url.searchParams);
    passthroughParams.delete('resource');

    const apiKey = Deno.env.get('FOOTBALL_API_KEY');
    const provider = (Deno.env.get('FOOTBALL_API_PROVIDER') || 'rapidapi').toLowerCase();

    if (!apiKey) {
      console.error('FOOTBALL_API_KEY not configured in Supabase secrets');
      return new Response(
        JSON.stringify({
          error: 'FOOTBALL_API_KEY not configured in Supabase Edge Function secrets',
          matches: [],
          source: 'error',
          message: 'Please add FOOTBALL_API_KEY and FOOTBALL_API_PROVIDER to your Edge Function secrets',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const today = new Date().toISOString().split('T')[0];
    const isApiSports = provider === 'apisports';
    const isFreeFootballData = provider === 'free-football-api-data';

    const endpoint = isApiSports
      ? `https://v3.football.api-sports.io/fixtures?date=${today}&timezone=UTC`
      : isFreeFootballData
      ? buildFreeFootballEndpoint(resource, passthroughParams, today)
      : `https://api-football-v1.p.rapidapi.com/v3/fixtures?date=${today}&timezone=UTC`;

    const headers: Record<string, string> = isApiSports
      ? {
          'x-apisports-key': apiKey,
        }
      : {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': isFreeFootballData
            ? 'free-football-api-data.p.rapidapi.com'
            : 'api-football-v1.p.rapidapi.com',
        };

    const response = await fetch(endpoint, { headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}. Provider=${provider}. Body=${errorText.slice(0, 300)}`
      );
    }

    const data = await response.json();
    const fixtures = extractFixtures(data);

    if (isFreeFootballData && resource !== 'live-scores' && resource !== 'live-events') {
      return new Response(
        JSON.stringify({
          resource,
          source: 'api',
          provider: 'Free-Football-API-Data',
          timestamp: new Date().toISOString(),
          data,
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    if (fixtures.length === 0) {
      return new Response(
        JSON.stringify({
          matches: [],
          source: 'api',
          message: 'No match events available for today',
        }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const matches = fixtures.map((fixture) => {
      const colors = teamColors[fixture.homeTeam] || { home: '#6B7280', away: '#9CA3AF' };

      return {
        id: `api-${fixture.fixtureId}`,
        homeTeam: fixture.homeTeam,
        awayTeam: fixture.awayTeam,
        homeScore: fixture.homeGoals ?? 0,
        awayScore: fixture.awayGoals ?? 0,
        status: mapFixtureStatus(fixture.statusShort),
        startTime: fixture.date,
        league: fixture.leagueName,
        venue: fixture.venueName || 'TBD',
        homeTeamColor: colors.home,
        awayTeamColor: colors.away,
        homeAbbr: getTeamAbbreviation(fixture.homeTeam),
        awayAbbr: getTeamAbbreviation(fixture.awayTeam),
        matchday: parseInt(fixture.round?.match(/\d+/)?.[0] || '1'),
        isFavorite: false,
        stats: {
          possession: { home: 55, away: 45 },
          shots: { home: 12, away: 8 },
          shotsOnTarget: { home: 5, away: 3 },
          corners: { home: 6, away: 4 },
          fouls: { home: 10, away: 12 },
          passes: { home: 487, away: 356 },
        },
      },
      {
        id: 'live-2',
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        homeScore: Math.floor(Math.random() * 3),
        awayScore: Math.floor(Math.random() * 3),
        status: 'live' as const,
        startTime: new Date().toISOString(),
        league: 'Premier League',
        venue: 'Emirates Stadium',
        homeTeamColor: '#EF0107',
        awayTeamColor: '#034694',
        homeAbbr: 'ARS',
        awayAbbr: 'CHE',
        matchday: 22,
        isFavorite: false,
        stats: {
          possession: { home: 52, away: 48 },
          shots: { home: 10, away: 9 },
          shotsOnTarget: { home: 4, away: 4 },
          corners: { home: 5, away: 3 },
          fouls: { home: 8, away: 11 },
          passes: { home: 421, away: 389 },
        },
      },
      {
        id: 'live-3',
        homeTeam: 'Manchester City',
        awayTeam: 'Tottenham',
        homeScore: Math.floor(Math.random() * 4),
        awayScore: Math.floor(Math.random() * 2),
        status: 'live' as const,
        startTime: new Date().toISOString(),
        league: 'Premier League',
        venue: 'Etihad Stadium',
        homeTeamColor: '#6CABDA',
        awayTeamColor: '#FFFFFF',
        homeAbbr: 'MCI',
        awayAbbr: 'TOT',
        matchday: 22,
        isFavorite: false,
        stats: {
          possession: { home: 71, away: 29 },
          shots: { home: 18, away: 4 },
          shotsOnTarget: { home: 8, away: 1 },
          corners: { home: 9, away: 1 },
          fouls: { home: 6, away: 15 },
          passes: { home: 687, away: 278 },
        },
      },
    ];

    const matches = sampleMatches.slice(0, Math.min(liveCount, 10));

    return new Response(
      JSON.stringify({
        matches,
        source: 'api',
        apiInfo: {
          provider: isFreeFootballData ? 'Free-Football-API-Data' : 'API-Football',
          matchCount: matches.length,
          timestamp: new Date().toISOString(),
        },
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching live scores:', error);

    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        matches: [],
        source: 'error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
