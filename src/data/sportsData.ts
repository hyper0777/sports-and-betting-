export interface StreamSource {
  id: string;
  label: string;
  language: string;
  quality: 'HD' | 'FHD' | '4K';
  latency: string;
  url: string;
  isOfficial: boolean;
}

export interface MatchPrediction {
  homeWin: number;
  draw: number;
  awayWin: number;
  recommendation: 'home' | 'draw' | 'away';
  confidence: 'low' | 'medium' | 'high';
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'live' | 'finished' | 'scheduled' | 'halftime';
  startTime: string;
  league: string;
  venue: string;
  homeTeamColor: string;
  awayTeamColor: string;
  homeAbbr: string;
  awayAbbr: string;
  matchday: number;
  isFavorite?: boolean;
  streamSources?: StreamSource[];
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
  prediction?: MatchPrediction;
  playByPlay?: PlayByPlayEvent[];
  stats?: MatchStats;
}

export interface PlayByPlayEvent {
  minute: number;
  type: 'goal' | 'yellow' | 'red' | 'substitution';
  team: string;
  player: string;
  description: string;
}

export interface MatchStats {
  possession: { home: number; away: number };
  shots: { home: number; away: number };
  shotsOnTarget: { home: number; away: number };
  corners: { home: number; away: number };
  fouls: { home: number; away: number };
  passes: { home: number; away: number };
}

export interface Standing {
  rank: number;
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string;
  league: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  author: string;
  publishedAt: string;
  category: string;
  featured: boolean;
  views: number;
}

export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  number: number;
  goals: number;
  assists: number;
  matches: number;
  nationality: string;
  league: string;
  trend: 'up' | 'down' | 'stable';
}

const defaultStreamSet: StreamSource[] = [
  {
    id: 'official-main',
    label: 'Official Broadcast',
    language: 'English',
    quality: '4K',
    latency: '8s',
    url: 'https://stream.sportshub.example/official',
    isOfficial: true,
  },
  {
    id: 'international',
    label: 'International Feed',
    language: 'Spanish',
    quality: 'FHD',
    latency: '12s',
    url: 'https://stream.sportshub.example/international',
    isOfficial: true,
  },
  {
    id: 'tactical-cam',
    label: 'Tactical Cam',
    language: 'No Commentary',
    quality: 'HD',
    latency: '5s',
    url: 'https://stream.sportshub.example/tactical',
    isOfficial: false,
  },
];

const baseMatches: Match[] = [
  {
    id: '1',
    homeTeam: 'Manchester United',
    awayTeam: 'Liverpool',
    homeScore: 2,
    awayScore: 1,
    status: 'live',
    startTime: '2026-04-14T19:30:00Z',
    league: 'Premier League',
    venue: 'Old Trafford',
    homeTeamColor: '#DA291C',
    awayTeamColor: '#C8102E',
    homeAbbr: 'MUN',
    awayAbbr: 'LIV',
    matchday: 22,
    isFavorite: false,
    streamSources: defaultStreamSet,
    odds: { home: 1.85, draw: 3.5, away: 4.2 },
    stats: {
      possession: { home: 58, away: 42 },
      shots: { home: 12, away: 8 },
      shotsOnTarget: { home: 5, away: 3 },
      corners: { home: 6, away: 4 },
      fouls: { home: 10, away: 12 },
      passes: { home: 487, away: 356 },
    },
  },
  {
    id: '2',
    homeTeam: 'Arsenal',
    awayTeam: 'Chelsea',
    homeScore: 1,
    awayScore: 1,
    status: 'live',
    startTime: '2026-04-14T20:00:00Z',
    league: 'Premier League',
    venue: 'Emirates Stadium',
    homeTeamColor: '#EF0107',
    awayTeamColor: '#034694',
    homeAbbr: 'ARS',
    awayAbbr: 'CHE',
    matchday: 22,
    isFavorite: true,
    streamSources: defaultStreamSet,
    odds: { home: 2.1, draw: 3.3, away: 3.4 },
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
    id: '3',
    homeTeam: 'Manchester City',
    awayTeam: 'Tottenham',
    homeScore: 3,
    awayScore: 0,
    status: 'live',
    startTime: '2026-04-14T15:00:00Z',
    league: 'Premier League',
    venue: 'Etihad Stadium',
    homeTeamColor: '#6CABDA',
    awayTeamColor: '#FFFFFF',
    homeAbbr: 'MCI',
    awayAbbr: 'TOT',
    matchday: 22,
    isFavorite: false,
    streamSources: defaultStreamSet,
    odds: { home: 1.45, draw: 4.2, away: 7.5 },
    stats: {
      possession: { home: 71, away: 29 },
      shots: { home: 18, away: 4 },
      shotsOnTarget: { home: 8, away: 1 },
      corners: { home: 9, away: 1 },
      fouls: { home: 6, away: 15 },
      passes: { home: 687, away: 278 },
    },
  },
  {
    id: '4',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Boston Celtics',
    homeScore: 115,
    awayScore: 108,
    status: 'live',
    startTime: '2026-04-14T22:30:00Z',
    league: 'NBA',
    venue: 'Crypto.com Arena',
    homeTeamColor: '#552583',
    awayTeamColor: '#007A33',
    homeAbbr: 'LAL',
    awayAbbr: 'BOS',
    matchday: 35,
    isFavorite: false,
    streamSources: defaultStreamSet,
    odds: { home: 1.95, draw: 0, away: 1.95 },
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 18, away: 20 },
      passes: { home: 0, away: 0 },
    },
  },
  {
    id: '5',
    homeTeam: 'Golden State Warriors',
    awayTeam: 'Denver Nuggets',
    homeScore: 98,
    awayScore: 105,
    status: 'halftime',
    startTime: '2026-04-14T23:00:00Z',
    league: 'NBA',
    venue: 'Chase Center',
    homeTeamColor: '#1D428A',
    awayTeamColor: '#0E2240',
    homeAbbr: 'GSW',
    awayAbbr: 'DEN',
    matchday: 34,
    isFavorite: true,
    streamSources: defaultStreamSet,
    odds: { home: 2.1, draw: 0, away: 1.8 },
    stats: {
      possession: { home: 0, away: 0 },
      shots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      corners: { home: 0, away: 0 },
      fouls: { home: 16, away: 14 },
      passes: { home: 0, away: 0 },
    },
  },
  {
    id: '6',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Marseille',
    homeScore: 2,
    awayScore: 2,
    status: 'live',
    startTime: '2026-04-14T20:45:00Z',
    league: 'Ligue 1',
    venue: 'Parc des Princes',
    homeTeamColor: '#004687',
    awayTeamColor: '#006BA6',
    homeAbbr: 'PSG',
    awayAbbr: 'OM',
    matchday: 20,
    isFavorite: false,
    streamSources: defaultStreamSet,
    odds: { home: 1.65, draw: 3.8, away: 5.5 },
    stats: {
      possession: { home: 62, away: 38 },
      shots: { home: 16, away: 7 },
      shotsOnTarget: { home: 6, away: 3 },
      corners: { home: 7, away: 2 },
      fouls: { home: 12, away: 14 },
      passes: { home: 512, away: 312 },
    },
  },
  {
    id: '7',
    homeTeam: 'Real Madrid',
    awayTeam: 'Barcelona',
    homeScore: 1,
    awayScore: 0,
    status: 'finished',
    startTime: '2026-04-13T20:00:00Z',
    league: 'La Liga',
    venue: 'Santiago Bernabéu',
    homeTeamColor: '#FFFFFF',
    awayTeamColor: '#004687',
    homeAbbr: 'RMA',
    awayAbbr: 'FCB',
    matchday: 19,
    isFavorite: true,
    streamSources: defaultStreamSet,
    odds: { home: 2.3, draw: 3.4, away: 3.1 },
  },
  {
    id: '8',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 2,
    awayScore: 1,
    status: 'finished',
    startTime: '2026-04-13T18:30:00Z',
    league: 'Bundesliga',
    venue: 'Allianz Arena',
    homeTeamColor: '#DC052D',
    awayTeamColor: '#FFD700',
    homeAbbr: 'FCB',
    awayAbbr: 'BVB',
    matchday: 18,
    isFavorite: false,
    streamSources: defaultStreamSet,
    odds: { home: 1.55, draw: 4.5, away: 6.0 },
  },
  {
    id: '9',
    homeTeam: 'Inter Milan',
    awayTeam: 'AC Milan',
    homeScore: 0,
    awayScore: 0,
    status: 'live',
    startTime: '2026-04-14T19:45:00Z',
    league: 'Serie A',
    venue: 'San Siro',
    homeTeamColor: '#000000',
    awayTeamColor: '#DC0000',
    homeAbbr: 'INT',
    awayAbbr: 'ACM',
    matchday: 20,
    isFavorite: false,
    streamSources: defaultStreamSet,
    odds: { home: 2.0, draw: 3.4, away: 3.75 },
    stats: {
      possession: { home: 54, away: 46 },
      shots: { home: 8, away: 6 },
      shotsOnTarget: { home: 2, away: 2 },
      corners: { home: 3, away: 2 },
      fouls: { home: 11, away: 13 },
      passes: { home: 434, away: 372 },
    },
  },
  {
    id: '10',
    homeTeam: 'Miami Heat',
    awayTeam: 'New York Knicks',
    homeScore: 102,
    awayScore: 98,
    status: 'finished',
    startTime: '2026-04-13T20:00:00Z',
    league: 'NBA',
    venue: 'FTX Arena',
    homeTeamColor: '#98002E',
    awayTeamColor: '#0B2340',
    homeAbbr: 'MIA',
    awayAbbr: 'NYK',
    matchday: 36,
    streamSources: defaultStreamSet,
  },
  {
    id: '11',
    homeTeam: 'Yankees',
    awayTeam: 'Red Sox',
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: '2026-04-15T00:00:00Z',
    league: 'MLB',
    venue: 'Yankee Stadium',
    homeTeamColor: '#132448',
    awayTeamColor: '#BD3039',
    homeAbbr: 'NYY',
    awayAbbr: 'BOS',
    matchday: 15,
    streamSources: defaultStreamSet,
  },

];

const predictionsByMatchId: Record<string, MatchPrediction> = {
  '1': { homeWin: 49, draw: 24, awayWin: 27, recommendation: 'home', confidence: 'medium' },
  '2': { homeWin: 45, draw: 29, awayWin: 26, recommendation: 'home', confidence: 'medium' },
  '3': { homeWin: 68, draw: 19, awayWin: 13, recommendation: 'home', confidence: 'high' },
  '4': { homeWin: 53, draw: 0, awayWin: 47, recommendation: 'home', confidence: 'low' },
  '5': { homeWin: 41, draw: 0, awayWin: 59, recommendation: 'away', confidence: 'medium' },
  '6': { homeWin: 56, draw: 21, awayWin: 23, recommendation: 'home', confidence: 'medium' },
  '7': { homeWin: 39, draw: 27, awayWin: 34, recommendation: 'home', confidence: 'low' },
  '8': { homeWin: 63, draw: 20, awayWin: 17, recommendation: 'home', confidence: 'high' },
  '9': { homeWin: 44, draw: 31, awayWin: 25, recommendation: 'home', confidence: 'medium' },
  '10': { homeWin: 51, draw: 0, awayWin: 49, recommendation: 'home', confidence: 'low' },
  '11': { homeWin: 42, draw: 0, awayWin: 58, recommendation: 'away', confidence: 'medium' },
};

export const liveMatches: Match[] = baseMatches.map((match) => ({
  ...match,
  prediction: predictionsByMatchId[match.id],
}));

export const standings: Standing[] = [

  { rank: 1, team: 'Manchester City', played: 22, wins: 18, draws: 3, losses: 1, goalsFor: 58, goalsAgainst: 18, goalDifference: 40, points: 57, form: 'WWWWW', league: 'Premier League' },
  { rank: 2, team: 'Arsenal', played: 22, wins: 16, draws: 4, losses: 2, goalsFor: 52, goalsAgainst: 24, goalDifference: 28, points: 52, form: 'WWDWW', league: 'Premier League' },
  { rank: 3, team: 'Liverpool', played: 22, wins: 15, draws: 5, losses: 2, goalsFor: 48, goalsAgainst: 22, goalDifference: 26, points: 50, form: 'WDWWW', league: 'Premier League' },
  { rank: 4, team: 'Aston Villa', played: 22, wins: 14, draws: 4, losses: 4, goalsFor: 44, goalsAgainst: 28, goalDifference: 16, points: 46, form: 'WLWWW', league: 'Premier League' },
  { rank: 5, team: 'Tottenham', played: 22, wins: 13, draws: 3, losses: 6, goalsFor: 45, goalsAgainst: 32, goalDifference: 13, points: 42, form: 'LWWDL', league: 'Premier League' },
];

export const newsArticles: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Premier League Title Race Intensifies',
    summary: 'Manchester City extends lead with crucial win over Tottenham.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800',
    author: 'John Smith',
    publishedAt: '2 hours ago',
    category: 'Football',
    featured: true,
    views: 12453,
  },
  {
    id: 'n2',
    title: 'NBA Playoffs: Lakers Secure Top Seed',
    summary: 'LeBron James leads Lakers to victory against Celtics in thriller.',
    content: 'Full article content here...',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
    author: 'Sarah Johnson',
    publishedAt: '4 hours ago',
    category: 'Basketball',
    featured: false,
    views: 8921,
  },
];

export const topPlayers: Player[] = [
  { id: 'p1', name: 'Erling Haaland', team: 'Manchester City', position: 'ST', number: 9, goals: 23, assists: 8, matches: 20, nationality: 'Norway', league: 'Premier League', trend: 'up' },
  { id: 'p2', name: 'Mohamed Salah', team: 'Liverpool', position: 'RW', number: 11, goals: 18, assists: 10, matches: 21, nationality: 'Egypt', league: 'Premier League', trend: 'stable' },
  { id: 'p3', name: 'Bukayo Saka', team: 'Arsenal', position: 'RW', number: 7, goals: 14, assists: 9, matches: 22, nationality: 'England', league: 'Premier League', trend: 'up' },
  { id: 'p4', name: 'Marcus Rashford', team: 'Manchester United', position: 'LW', number: 10, goals: 12, assists: 6, matches: 20, nationality: 'England', league: 'Premier League', trend: 'down' },
  { id: 'p5', name: 'Kevin De Bruyne', team: 'Manchester City', position: 'CM', number: 17, goals: 8, assists: 15, matches: 18, nationality: 'Belgium', league: 'Premier League', trend: 'up' },
  { id: 'p6', name: 'LeBron James', team: 'Los Angeles Lakers', position: 'SF', number: 23, goals: 0, assists: 8, matches: 35, nationality: 'USA', league: 'NBA', trend: 'stable' },
];
