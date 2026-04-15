import { useState } from 'react';
import { Mail, Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-12">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-lg border border-orange-500/30 p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">
                Subscribe to get the latest sports news, scores, and exclusive content directly in your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-orange-500 transition"
                required
              />
              <button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Subscribe</span>
              </button>
            </form>
          </div>

          {/* Subscription Message */}
          {subscribed && (
            <div className="mt-4 p-3 bg-green-500/20 text-green-400 rounded-lg text-sm border border-green-500/30">
              ✓ Thanks for subscribing! Check your email for confirmation.
            </div>
          )}
        </div>

        {/* Footer Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Sports */}
          <div>
            <h4 className="font-bold text-white mb-4">Sports</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Football
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Basketball
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Soccer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Baseball
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Tennis
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  More Sports
                </a>
              </li>
            </ul>
          </div>

          {/* Leagues */}
          <div>
            <h4 className="font-bold text-white mb-4">Top Leagues</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Premier League
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  La Liga
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Bundesliga
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Serie A
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  NBA
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Champions League
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Advertise
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Disclaimer
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Responsible Betting
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-orange-400 transition">
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <h4 className="font-bold text-white mb-4">Follow Us</h4>
          <div className="flex gap-4">
            <a
              href="#"
              className="p-3 bg-gray-800 hover:bg-blue-600 text-gray-400 hover:text-white rounded-lg transition"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800 hover:bg-sky-500 text-gray-400 hover:text-white rounded-lg transition"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800 hover:bg-pink-600 text-gray-400 hover:text-white rounded-lg transition"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800 hover:bg-red-600 text-gray-400 hover:text-white rounded-lg transition"
            >
              <Youtube className="h-5 w-5" />
            </a>
            <a
              href="#"
              className="p-3 bg-gray-800 hover:bg-orange-600 text-gray-400 hover:text-white rounded-lg transition"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Logo/Brand */}
            <div>
              <h3 className="text-2xl font-bold text-white">
                <span className="text-orange-500">Sports</span>Hub
              </h3>
              <p className="text-gray-400 text-sm mt-2">Your ultimate sports companion</p>
            </div>

            {/* Copyright */}
            <div className="text-center text-gray-400 text-sm">
              <p>&copy; 2024 SportsHub. All rights reserved.</p>
              <p>Powered by cutting-edge sports data technology</p>
            </div>

            {/* Quick Buttons */}
            <div className="flex justify-end gap-2 flex-wrap">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg transition">
                📱 Download App
              </button>
              <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-lg transition">
                🔔 Notifications
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-xs">
            This is a fan website. All data is provided for informational purposes. Please verify scores and information on official sources.
          </p>
        </div>
      </div>
    </footer>
  );
}
