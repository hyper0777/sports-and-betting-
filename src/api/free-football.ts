export type FootballResource =
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

export interface FetchFootballResourceOptions {
  resource: FootballResource;
  date?: string;
  eventId?: string;
  teamId?: string;
  playerId?: string;
  leagueId?: string;
  competitionId?: string;
  season?: string;
  country?: string;
}

interface FootballResourceResponse<TData = unknown> {
  resource: FootballResource;
  source: 'api' | 'simulated' | 'error';
  provider: string;
  timestamp: string;
  data: TData;
}

export async function fetchFootballResource<TData = unknown>(
  options: FetchFootballResourceOptions,
): Promise<FootballResourceResponse<TData>> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !anonKey) {
    throw new Error('Supabase configuration missing');
  }

  const search = new URLSearchParams({ resource: options.resource });

  if (options.date) search.set('date', options.date);
  if (options.eventId) search.set('eventId', options.eventId);
  if (options.teamId) search.set('teamId', options.teamId);
  if (options.playerId) search.set('playerId', options.playerId);
  if (options.leagueId) search.set('leagueId', options.leagueId);
  if (options.competitionId) search.set('competitionId', options.competitionId);
  if (options.season) search.set('season', options.season);
  if (options.country) search.set('country', options.country);

  const response = await fetch(
    `${supabaseUrl}/functions/v1/live-scores?${search.toString()}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${anonKey}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Free Football request failed: ${response.status}. ${text.slice(0, 200)}`);
  }

  return response.json() as Promise<FootballResourceResponse<TData>>;
}

