import { useState } from 'react';
import Header from '@/components/Header';
import LiveScoreCard from '@/components/LiveScoreCard';
import StandingsTable from '@/components/StandingsTable';
import NewsCard from '@/components/NewsCard';
import PlayerStatsCard from '@/components/PlayerStatsCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockGames, mockStandings, mockNews, mockPlayers } from '@/data/mockData';
import { TrendingUp, Calendar, Users, Newspaper, RefreshCw } from 'lucide-react';

export default function Index() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const liveGames = mockGames.filter(game => game.status === 'live');
  const upcomingGames = mockGames.filter(game => game.status === 'scheduled');
  const finishedGames = mockGames.filter(game => game.status === 'finished');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Live Sports Dashboard
              </h1>
              <p className="text-gray-600">
                Stay updated with real-time scores, standings, and sports news
              </p>
            </div>
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              className="flex items-center space-x-2"
              disabled={refreshing}
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{liveGames.length}</p>
                    <p className="text-sm text-gray-500">Live Games</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{upcomingGames.length}</p>
                    <p className="text-sm text-gray-500">Upcoming</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockPlayers.length}</p>
                    <p className="text-sm text-gray-500">Top Players</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Newspaper className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{mockNews.length}</p>
                    <p className="text-sm text-gray-500">News Articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="scores" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scores" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Live Scores</span>
            </TabsTrigger>
            <TabsTrigger value="standings" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Standings</span>
            </TabsTrigger>
            <TabsTrigger value="players" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Players</span>
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center space-x-2">
              <Newspaper className="h-4 w-4" />
              <span>News</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scores" className="space-y-6">
            {/* Live Games */}
            {liveGames.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Live Games</h2>
                  <Badge variant="destructive" className="animate-pulse">LIVE</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                  {liveGames.map(game => (
                    <LiveScoreCard key={game.id} game={game} />
                  ))}
                </div>
              </div>
            )}

            {/* Recent Games */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {finishedGames.map(game => (
                  <LiveScoreCard key={game.id} game={game} />
                ))}
              </div>
            </div>

            {/* Upcoming Games */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Games</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {upcomingGames.map(game => (
                  <LiveScoreCard key={game.id} game={game} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="standings">
            <StandingsTable standings={mockStandings} />
          </TabsContent>

          <TabsContent value="players" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockPlayers.map(player => (
                  <PlayerStatsCard key={player.id} player={player} />
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="news" className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Latest Sports News</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockNews.map(article => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}