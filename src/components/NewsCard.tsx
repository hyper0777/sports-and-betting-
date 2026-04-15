import { NewsArticle } from '@/types/sports';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const timeAgo = (dateString: string) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - published.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-900">
            {article.category}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {article.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="font-medium">{article.author}</span>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}