import { Game } from '@/types/sports';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Play, CheckCircle } from 'lucide-react';

interface LiveScoreCardProps {
  game: Game;
}

export default function LiveScoreCard({ game }: LiveScoreCardProps) {
  const getStatusIcon = () => {
    switch (game.status) {
      case 'live':
        return <Play className="h-4 w-4 text-red-500" />;
      case 'finished':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (game.status) {
      case 'live':
        return `${game.quarter} ${game.timeRemaining}`;
      case 'finished':
        return 'Final';
      default:
        return new Date(game.startTime).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
    }
  };

  const getStatusColor = () => {
    switch (game.status) {
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'finished':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <Badge variant="outline" className={getStatusColor()}>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="text-xs font-medium">{getStatusText()}</span>
            </div>
          </Badge>
          <span className="text-xs text-gray-500 font-medium">{game.league}</span>
        </div>

        <div className="space-y-3">
          {/* Away Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={game.awayTeam.logo} 
                alt={game.awayTeam.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{game.awayTeam.city} {game.awayTeam.name}</p>
                <p className="text-xs text-gray-500">{game.awayTeam.abbreviation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{game.awayScore}</p>
            </div>
          </div>

          {/* Home Team */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={game.homeTeam.logo} 
                alt={game.homeTeam.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{game.homeTeam.city} {game.homeTeam.name}</p>
                <p className="text-xs text-gray-500">{game.homeTeam.abbreviation}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{game.homeScore}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}