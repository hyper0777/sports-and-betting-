import { Game, Team, Standing, NewsArticle, Player } from '@/types/sports';

export const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Lakers',
    logo: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    city: 'Los Angeles',
    abbreviation: 'LAL'
  },
  {
    id: '2',
    name: 'Warriors',
    logo: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    city: 'Golden State',
    abbreviation: 'GSW'
  },
  {
    id: '3',
    name: 'Celtics',
    logo: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    city: 'Boston',
    abbreviation: 'BOS'
  },
  {
    id: '4',
    name: 'Heat',
    logo: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    city: 'Miami',
    abbreviation: 'MIA'
  }
];

export const mockGames: Game[] = [
  {
    id: '1',
    homeTeam: mockTeams[0],
    awayTeam: mockTeams[1],
    homeScore: 108,
    awayScore: 112,
    status: 'live',
    startTime: '2024-01-15T20:00:00Z',
    quarter: 'Q4',
    timeRemaining: '2:34',
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '2',
    homeTeam: mockTeams[2],
    awayTeam: mockTeams[3],
    homeScore: 95,
    awayScore: 89,
    status: 'finished',
    startTime: '2024-01-15T19:30:00Z',
    sport: 'Basketball',
    league: 'NBA'
  },
  {
    id: '3',
    homeTeam: mockTeams[1],
    awayTeam: mockTeams[2],
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    startTime: '2024-01-16T21:00:00Z',
    sport: 'Basketball',
    league: 'NBA'
  }
];

export const mockStandings: Standing[] = [
  {
    team: mockTeams[2],
    wins: 35,
    losses: 12,
    winPercentage: 0.745,
    gamesBack: 0,
    streak: 'W3'
  },
  {
    team: mockTeams[1],
    wins: 32,
    losses: 15,
    winPercentage: 0.681,
    gamesBack: 3,
    streak: 'L1'
  },
  {
    team: mockTeams[0],
    wins: 28,
    losses: 19,
    winPercentage: 0.596,
    gamesBack: 7,
    streak: 'W2'
  },
  {
    team: mockTeams[3],
    wins: 25,
    losses: 22,
    winPercentage: 0.532,
    gamesBack: 10,
    streak: 'L2'
  }
];

export const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Lakers Make Major Trade Deadline Move',
    summary: 'The Los Angeles Lakers have acquired a star player in a blockbuster trade that could reshape their championship aspirations.',
    author: 'Sports Reporter',
    publishedAt: '2024-01-15T14:30:00Z',
    imageUrl: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    category: 'NBA'
  },
  {
    id: '2',
    title: 'Warriors Extend Winning Streak to Seven Games',
    summary: 'Golden State continues their dominant run with another impressive victory, showcasing their championship pedigree.',
    author: 'Basketball Analyst',
    publishedAt: '2024-01-15T12:15:00Z',
    imageUrl: 'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    category: 'NBA'
  },
  {
    id: '3',
    title: 'Rookie of the Year Race Heats Up',
    summary: 'Several first-year players are making strong cases for the prestigious Rookie of the Year award with standout performances.',
    author: 'Draft Expert',
    publishedAt: '2024-01-15T10:45:00Z',
    imageUrl: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&fit=crop',
    category: 'NBA'
  }
];

export const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'LeBron James',
    position: 'SF',
    team: mockTeams[0],
    stats: {
      points: 25.2,
      rebounds: 7.8,
      assists: 6.9,
      steals: 1.3,
      blocks: 0.6
    }
  },
  {
    id: '2',
    name: 'Stephen Curry',
    position: 'PG',
    team: mockTeams[1],
    stats: {
      points: 29.8,
      rebounds: 4.5,
      assists: 6.2,
      steals: 1.8,
      blocks: 0.4
    }
  },
  {
    id: '3',
    name: 'Jayson Tatum',
    position: 'SF',
    team: mockTeams[2],
    stats: {
      points: 27.1,
      rebounds: 8.4,
      assists: 4.3,
      steals: 1.1,
      blocks: 0.7
    }
  }
];