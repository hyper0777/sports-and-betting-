import { useState } from 'react';
import { X, Eye, Share2, Calendar } from 'lucide-react';
import { NewsArticle } from '@/data/sportsData';

interface NewsFeedProps {
  articles: NewsArticle[];
}

export default function NewsFeed({ articles }: NewsFeedProps) {
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [loadMore, setLoadMore] = useState(false);

  const featuredArticles = articles.filter((a) => a.featured);
  const regularArticles = articles.filter((a) => !a.featured);
  const displayArticles = loadMore ? regularArticles : regularArticles.slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Sports News</h2>
        <p className="text-gray-400">Latest updates and breaking news</p>
      </div>

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-bold text-white">Featured</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredArticles.map((article) => (
              <div
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="relative group cursor-pointer rounded-lg overflow-hidden"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden rounded-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="inline-block bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>

                  {/* Content Over Image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-gray-300 text-sm font-semibold mb-2">{article.category}</p>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">{article.title}</h3>
                    <div className="flex items-center gap-2 text-gray-300 text-xs">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.publishedAt)}</span>
                      <span>•</span>
                      <span>{article.author}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Latest Articles</h3>
          <div className="text-sm text-gray-400">
            Showing {displayArticles.length} of {regularArticles.length}
          </div>
        </div>

        <div className="space-y-3">
          {displayArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="bg-gray-800 border border-gray-700 rounded-lg hover:border-orange-500 transition cursor-pointer overflow-hidden group"
            >
              <div className="flex gap-4 p-4">
                {/* Image Thumbnail */}
                <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-block px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-semibold rounded">
                      {article.category}
                    </span>
                    <span className="text-gray-500 text-xs">{formatDate(article.publishedAt)}</span>
                  </div>

                  <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 group-hover:text-orange-400 transition">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-3">{article.summary}</p>

                  <div className="flex items-center justify-between text-gray-400 text-xs">
                    <span>{article.author}</span>
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3" />
                      <span>{article.views.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {!loadMore && regularArticles.length > 5 && (
          <button
            onClick={() => setLoadMore(true)}
            className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg border border-gray-700 hover:border-orange-500 transition"
          >
            Load More Articles
          </button>
        )}
      </div>

      {/* Article Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header with Close Button */}
            <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6 flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-semibold uppercase">{selectedArticle.category}</p>
                <h2 className="text-xl font-bold text-white mt-1">{selectedArticle.title}</h2>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-gray-400 hover:text-white transition flex-shrink-0 ml-4"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Featured Image */}
              <div className="rounded-lg overflow-hidden">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-64 object-cover"
                />
              </div>

              {/* Article Meta */}
              <div className="flex items-center gap-4 text-gray-400 text-sm border-b border-gray-700 pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(selectedArticle.publishedAt)}</span>
                </div>
                <span>•</span>
                <span>By {selectedArticle.author}</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{selectedArticle.views.toLocaleString()} views</span>
                </div>
              </div>

              {/* Article Summary */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Summary</h3>
                <p className="text-gray-300 leading-relaxed">{selectedArticle.summary}</p>
              </div>

              {/* Article Content */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Full Story</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              {/* Share Buttons */}
              <div className="flex gap-3 border-t border-gray-700 pt-4">
                <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </button>
                <button className="flex-1 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
                  Save Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
