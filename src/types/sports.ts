export interface Team {
  id: string;
  name: string;
  logo: string;
  city: string;
  abbreviation: string;
}

export interface Game {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  homeScore: number;
  awayScore: number;
  status: 'scheduled' | 'live' | 'finished';
  startTime: string;
  quarter?: string;
  timeRemaining?: string;
  sport: string;
  league: string;
}

export interface Player {
  id: string;
  name: string;
  position: string;
  team: Team;
  stats: Record<string, number>;
}

export interface Standing {
  team: Team;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBack: number;
  streak: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  author: string;
  publishedAt: string;
  imageUrl: string;
  category: string;
}