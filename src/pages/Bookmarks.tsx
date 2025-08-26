import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/header';
import { NewsCard } from '@/components/ui/news-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useRatings } from '@/hooks/useRatings';
import { useAuth } from '@/hooks/useAuth';
import { ArrowLeft, Bookmark, BookmarkCheck } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Article } from '@/hooks/useNews';

const Bookmarks = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { bookmarkedArticles, toggleBookmark } = useBookmarks();
  const { articleRatings, rateArticle } = useRatings();
  const [bookmarkedArticlesData, setBookmarkedArticlesData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedArticles = async () => {
      if (!user || bookmarkedArticles.size === 0) {
        setBookmarkedArticlesData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const articleIds = Array.from(bookmarkedArticles);
        
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .in('id', articleIds)
          .order('created_at', { ascending: false });

        if (error) throw error;

        setBookmarkedArticlesData(data || []);
      } catch (err: any) {
        console.error('Error fetching bookmarked articles:', err);
        toast({
          title: "Error loading bookmarks",
          description: err.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedArticles();
  }, [user, bookmarkedArticles, toast]);

  const handleBookmark = (articleId: string) => {
    toggleBookmark(articleId);
  };

  const handleShare = (title: string, articleId: string) => {
    const articleUrl = `${window.location.origin}/article/${articleId}`;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "Check out this bookmarked article from NewsSphere",
        url: articleUrl,
      });
    } else {
      navigator.clipboard.writeText(articleUrl);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard",
      });
    }
  };

  const handleRate = (articleId: string, rating: number) => {
    rateArticle(articleId, rating);
  };

  const handleSearch = (query: string) => {
    toast({
      title: "Search functionality",
      description: `Searching for: "${query}"`,
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSearch={handleSearch} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Sign in required</h1>
            <p className="text-muted-foreground mb-6">Please sign in to view your bookmarks</p>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookmarkCheck className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">My Bookmarks</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {bookmarkedArticlesData.length} articles
            </Badge>
          </div>
          <p className="text-muted-foreground">Your saved articles for later reading</p>
        </div>

        {/* Bookmarks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-muted rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : bookmarkedArticlesData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedArticlesData.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                summary={article.summary || ''}
                category={article.category}
                readTime={String(article.read_time || 5)}
                imageUrl={article.image_url || ''}
                isBookmarked={true}
                rating={articleRatings[article.id] || 0}
                onBookmark={() => handleBookmark(article.id)}
                onShare={() => handleShare(article.title, article.id)}
                onRate={(rating) => handleRate(article.id, rating)}
                onClick={() => navigate(`/article/${article.id}`)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Bookmark className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No bookmarks yet</h2>
            <p className="text-muted-foreground mb-6">
              Start bookmarking articles to save them for later reading
            </p>
            <Button onClick={() => navigate('/')} variant="outline">
              Browse Articles
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Bookmarks;
