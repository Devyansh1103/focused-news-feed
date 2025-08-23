import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/ui/header';
import { useNews, Article } from '@/hooks/useNews';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useRatings } from '@/hooks/useRatings';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Clock, Bookmark, BookmarkCheck, Share2, Star } from 'lucide-react';
import { featuredArticle, NewsArticle } from '@/data/sampleNews';

const ArticleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { articles, loading } = useNews();
  const { bookmarkedArticles, toggleBookmark } = useBookmarks();
  const { articleRatings, rateArticle } = useRatings();
  
  const [article, setArticle] = useState<Article | NewsArticle | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // Check if it's the featured article
    if (id === 'featured') {
      setArticle(featuredArticle);
      return;
    }
    
    // Find the article in the articles list
    const foundArticle = articles.find(a => a.id === id);
    if (foundArticle) {
      setArticle(foundArticle);
    } else if (!loading && articles.length > 0) {
      // Only navigate to 404 if we're done loading and still no article found
      navigate('/404');
    }
  }, [id, articles, loading, navigate]);

  const handleBookmark = () => {
    if (article) {
      toggleBookmark(article.id);
    }
  };

  const handleShare = () => {
    if (article) {
      const articleUrl = `${window.location.origin}/article/${article.id}`;
      if (navigator.share) {
        navigator.share({
          title: article.title,
          text: article.summary || '',
          url: articleUrl,
        });
      } else {
        navigator.clipboard.writeText(articleUrl);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard",
        });
      }
    }
  };

  const handleRate = (rating: number) => {
    if (article) {
      rateArticle(article.id, rating);
    }
  };

  const handleSearch = (query: string) => {
    toast({
      title: "Search functionality",
      description: `Searching for: "${query}"`,
    });
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Article not found</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isBookmarked = bookmarkedArticles.has(article.id);
  const currentRating = articleRatings[article.id] || 0;

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button 
          onClick={() => navigate('/')} 
          variant="ghost" 
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Article Header */}
        <Card className="p-8 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary" className="capitalize">
              {article.category}
            </Badge>
            <Badge variant="outline" className="text-primary">
              Featured
            </Badge>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            {'author' in article && article.author && (
              <span>By {article.author}</span>
            )}
            {'source' in article && article.source && (
              <span>• {article.source}</span>
            )}
            {('published_at' in article ? article.published_at : article.publishedAt) && (
              <span>• {new Date('published_at' in article ? article.published_at! : article.publishedAt).toLocaleDateString()}</span>
            )}
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{'read_time' in article ? article.read_time || 5 : article.readTime}</span>
            </div>
          </div>

          {/* Article Actions */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              onClick={handleBookmark}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              {isBookmarked ? (
                <BookmarkCheck className="h-4 w-4 text-primary" />
              ) : (
                <Bookmark className="h-4 w-4" />
              )}
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            {/* Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRate(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-4 w-4 ${
                      star <= currentRating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({currentRating}/5)
              </span>
            </div>
          </div>

          {/* Article Image */}
          {(('image_url' in article && article.image_url) || ('imageUrl' in article && article.imageUrl)) && (
            <div className="mb-8">
              <img
                src={'image_url' in article ? article.image_url! : article.imageUrl!}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Summary */}
          {article.summary && (
            <div className="mb-8">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {article.summary}
              </p>
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            {('content' in article && article.content) ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <div className="space-y-4 text-foreground leading-relaxed">
                <p className="text-lg">
                  {article.summary || 'This is a comprehensive analysis of the latest developments in this story.'}
                </p>
                
                <p>
                  In an era of rapid information exchange, understanding the full context behind breaking news has become more crucial than ever. 
                  This story represents a significant development that impacts various stakeholders across multiple sectors.
                </p>
                
                <p>
                  Industry experts have been closely monitoring this situation, with many noting the potential implications for both short-term 
                  market movements and long-term strategic planning. The developments outlined in this report suggest a shift in how organizations 
                  approach similar challenges in the future.
                </p>
                
                <p>
                  Key stakeholders have expressed varying degrees of optimism and concern regarding these developments. While some see this as an 
                  opportunity for innovation and growth, others are taking a more cautious approach, emphasizing the need for careful analysis 
                  and strategic planning.
                </p>
                
                <p>
                  The broader implications of this story extend beyond immediate concerns, touching on regulatory frameworks, technological 
                  infrastructure, and societal impacts. Analysts predict that these developments will serve as a catalyst for further 
                  discussions and potential policy changes.
                </p>
                
                <p>
                  As the situation continues to evolve, stakeholders are advised to stay informed through reliable sources and maintain 
                  flexibility in their strategic approaches. The coming weeks are expected to provide additional clarity on the long-term 
                  trajectory of these developments.
                </p>
                
                <p>
                  Looking ahead, industry observers are particularly interested in how different sectors will adapt to these changes. The 
                  responses from various organizations will likely influence best practices and set precedents for future similar situations.
                </p>
                
                <p>
                  This comprehensive coverage aims to provide readers with the context needed to understand not just what happened, but why 
                  it matters and what it could mean for the future. As always, we encourage our readers to consider multiple perspectives 
                  and stay engaged with ongoing developments.
                </p>
              </div>
            )}
          </div>

          {/* Article URL */}
          {('url' in article && article.url) && (
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Original source:</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {article.url}
              </a>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
};

export default ArticleDetail;