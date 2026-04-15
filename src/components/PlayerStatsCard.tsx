import { Player } from '@/types/sports';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PlayerStatsCardProps {
  player: Player;
}

export default function PlayerStatsCard({ player }: PlayerStatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={player.team.logo} 
              alt={player.team.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <CardTitle className="text-lg">{player.name}</CardTitle>
              <p className="text-sm text-gray-500">
                {player.team.city} {player.team.name}
              </p>
            </div>
          </div>
          <Badge variant="outline">{player.position}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{player.stats.points}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">PPG</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{player.stats.rebounds}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">RPG</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{player.stats.assists}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">APG</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{player.stats.steals}</p>
            <p className="text-xs text-gray-500 uppercase tracking-wide">SPG</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}