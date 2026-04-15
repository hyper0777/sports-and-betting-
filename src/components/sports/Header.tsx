import { useState } from 'react';
import { Menu, X, Search, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  onSearch?: (query: string) => void;
}

export default function Header({ selectedSport, onSportChange, onSearch }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sports = [
    { id: 'all', label: 'All Sports', icon: '⚽' },
    { id: 'football', label: 'Football', icon: '🏈' },
    { id: 'basketball', label: 'Basketball', icon: '🏀' },
    { id: 'soccer', label: 'Soccer', icon: '⚽' },
    { id: 'baseball', label: 'Baseball', icon: '⚾' },
    { id: 'tennis', label: 'Tennis', icon: '🎾' },
  ];

  const handleSportChange = (sportId: string) => {
    onSportChange(sportId);
    setIsMenuOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-orange-500">Sports</span>Hub
            </h1>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams, players..."
                className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 transition"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-orange-500 transition"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/betting"
              className="flex items-center gap-2 text-gray-300 hover:text-orange-400 transition font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              Betting
            </Link>
            <button className="text-gray-300 hover:text-white transition">Login</button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
              Sign Up
            </button>
          </div>
        </div>

        {/* Sport Tabs - Desktop */}
        <div className="hidden md:flex border-t border-gray-800">
          {sports.map((sport) => (
            <button
              key={sport.id}
              onClick={() => handleSportChange(sport.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium border-b-2 transition ${
                selectedSport === sport.id
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <span>{sport.icon}</span>
              <span>{sport.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="p-4 border-b border-gray-700">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teams, players..."
                className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Sport Tabs Mobile */}
          <div className="space-y-1 p-4">
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => handleSportChange(sport.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                  selectedSport === sport.id
                    ? 'bg-orange-500/20 text-orange-500'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span>{sport.icon}</span>
                <span>{sport.label}</span>
              </button>
            ))}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="border-t border-gray-700 p-4 space-y-2">
            <Link
              to="/betting"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full text-gray-300 hover:text-orange-400 py-2 transition font-medium"
            >
              <TrendingUp className="h-4 w-4" />
              Betting Dashboard
            </Link>
            <button className="w-full text-gray-300 hover:text-white py-2 transition">Login</button>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition">
              Sign Up
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
