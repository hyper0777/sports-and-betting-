import { ChevronRight } from 'lucide-react';

export default function QuickLinks() {
  const leagues = [
    {
      id: 'premier-league',
      name: 'Premier League',
      country: '🇬🇧 England',
      icon: '⚽',
      color: 'from-blue-600 to-purple-600',
      matches: '380 matches',
    },
    {
      id: 'la-liga',
      name: 'La Liga',
      country: '🇪🇸 Spain',
      icon: '⚽',
      color: 'from-yellow-600 to-red-600',
      matches: '380 matches',
    },
    {
      id: 'serie-a',
      name: 'Serie A',
      country: '🇮🇹 Italy',
      icon: '⚽',
      color: 'from-green-600 to-red-600',
      matches: '380 matches',
    },
    {
      id: 'bundesliga',
      name: 'Bundesliga',
      country: '🇩🇪 Germany',
      icon: '⚽',
      color: 'from-red-600 to-black',
      matches: '306 matches',
    },
    {
      id: 'ligue-1',
      name: 'Ligue 1',
      country: '🇫🇷 France',
      icon: '⚽',
      color: 'from-blue-600 to-red-600',
      matches: '380 matches',
    },
    {
      id: 'nba',
      name: 'NBA',
      country: '🇺🇸 USA',
      icon: '🏀',
      color: 'from-orange-600 to-red-600',
      matches: '1230 matches',
    },
    {
      id: 'champions-league',
      name: 'Champions League',
      country: '🌍 Europe',
      icon: '⚽',
      color: 'from-blue-700 to-blue-900',
      matches: '125 matches',
    },
    {
      id: 'world-cup',
      name: 'World Cup 2026',
      country: '🌍 Global',
      icon: '🏆',
      color: 'from-yellow-500 to-red-500',
      matches: 'Coming Soon',
    },
  ];

  return (
    <section className="py-8 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Popular Leagues</h2>
        <p className="text-gray-400">Quick access to your favorite competitions</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {leagues.map((league) => (
          <div
            key={league.id}
            className={`relative overflow-hidden rounded-lg cursor-pointer group border border-gray-700 hover:border-orange-500 transition h-40`}
          >
            {/* Gradient Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${league.color} opacity-20 group-hover:opacity-30 transition`} />
            <div className="absolute inset-0 bg-gray-900/60 group-hover:bg-gray-900/50 transition" />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-4 z-10">
              {/* Top */}
              <div>
                <p className="text-3xl mb-2">{league.icon}</p>
                <h3 className="font-bold text-white text-sm mb-1">{league.name}</h3>
                <p className="text-gray-400 text-xs">{league.country}</p>
              </div>

              {/* Bottom */}
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs">{league.matches}</p>
                <ChevronRight className="h-4 w-4 text-orange-500 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/10 group-hover:to-transparent transition" />
          </div>
        ))}
      </div>
    </section>
  );
}
