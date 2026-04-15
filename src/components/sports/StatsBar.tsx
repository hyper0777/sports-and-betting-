import { useEffect, useState } from 'react';
import { Users, TrendingUp, Watch, Globe } from 'lucide-react';

export default function StatsBar() {
  const [liveViewers, setLiveViewers] = useState(12500);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers((prev) => {
        const change = Math.floor(Math.random() * 100) - 40;
        const newValue = Math.max(10000, prev + change);
        return newValue;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      icon: Watch,
      label: 'Live Matches',
      value: '15',
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
    },
    {
      icon: Users,
      label: 'Live Viewers',
      value: liveViewers.toLocaleString(),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      animated: true,
    },
    {
      icon: TrendingUp,
      label: 'Matches Today',
      value: '42',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-500/10',
    },
    {
      icon: Globe,
      label: 'Countries',
      value: '180+',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-500/10',
    },
  ];

  return (
    <section className="py-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`${stat.bgColor} rounded-lg border border-gray-700 p-6 group hover:border-orange-500 transition`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                {stat.animated && (
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}
              </div>

              <p className="text-gray-400 text-sm font-semibold mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>

              {stat.animated && <p className="text-xs text-gray-500 mt-2">Real-time updates</p>}
            </div>
          );
        })}
      </div>
    </section>
  );
}
