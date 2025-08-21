import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { CategoryFilter } from "@/components/ui/category-filter";
import { NewsCard } from "@/components/ui/news-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNews } from "@/hooks/useNews";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useRatings } from "@/hooks/useRatings";
import { useAuth } from "@/hooks/useAuth";
import { featuredArticle, categories } from "@/data/sampleNews";
import heroImage from "@/assets/hero-news.jpg";
import { RefreshCw } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { articles, loading, fetchNewsFromAPI, fetchTrendingNews } = useNews(activeCategory, searchQuery);
  const { bookmarkedArticles, toggleBookmark } = useBookmarks();
  const { articleRatings, rateArticle } = useRatings();


  const handleBookmark = (articleId: string) => {
    toggleBookmark(articleId);
  };

  const handleShare = (title: string) => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: "Check out this news article from NewsSphere",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
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
    setSearchQuery(query);
    if (query.trim()) {
      toast({
        title: "Searching",
        description: `Searching for: "${query}"`,
      });
    }
  };

  const handleFetchNews = async () => {
    await fetchNewsFromAPI(activeCategory === "All" ? "general" : activeCategory.toLowerCase());
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSearch={handleSearch} 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onFetchTrending={fetchTrendingNews}
      />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section */}
        <HeroSection
          title={featuredArticle.title}
          summary={featuredArticle.summary}
          category={featuredArticle.category}
          readTime={featuredArticle.readTime}
          imageUrl={heroImage}
          onBookmark={() => handleBookmark(featuredArticle.id)}
          onShare={() => handleShare(featuredArticle.title)}
          onReadMore={() => navigate('/article/featured')}
        />

        {/* Suggested for You */}
        {user && articles.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">Suggested for You</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Personalized
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {articles.slice(0, 4).map((article) => (
                <div 
                  key={`suggested-${article.id}`} 
                  className="bg-card rounded-lg p-4 border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/article/${article.id}`)}
                >
                  {article.image_url && (
                    <div className="h-24 w-full bg-muted rounded-md mb-3 overflow-hidden">
                      <img 
                        src={article.image_url} 
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2 text-foreground">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <span>{article.read_time || 5} min read</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category Filter */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Latest News</h2>
              <p className="text-muted-foreground">Stay updated with the latest stories from around the world</p>
            </div>
            <Button 
              onClick={handleFetchNews}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Fetch Latest News
            </Button>
          </div>
          
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* News Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-card rounded-lg p-4 animate-pulse">
                <div className="h-48 bg-muted rounded-md mb-4"></div>
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            ))
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <NewsCard
                key={article.id}
                title={article.title}
                summary={article.summary || ''}
                category={article.category}
                readTime={String(article.read_time || 5)}
                imageUrl={article.image_url || ''}
                isBookmarked={bookmarkedArticles.has(article.id)}
                rating={articleRatings[article.id] || 0}
                onBookmark={() => handleBookmark(article.id)}
                onShare={() => handleShare(article.title)}
                onRate={(rating) => handleRate(article.id, rating)}
                onClick={() => navigate(`/article/${article.id}`)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground mb-4">No articles found for this category.</p>
              <Button onClick={handleFetchNews} variant="outline">
                Fetch News
              </Button>
            </div>
          )}
        </section>

        {/* Load More */}
        {!loading && articles.length > 0 && (
          <div className="text-center pt-8">
            <Button
              onClick={handleFetchNews}
              className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Load More Articles
            </Button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NS</span>
                </div>
                <span className="font-bold text-xl">NewsSphere</span>
              </div>
              <p className="text-muted-foreground">Your personalized news companion for staying informed with the latest stories.</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Technology</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Business</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Health</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Science</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <p className="text-muted-foreground mb-4">Stay connected for the latest updates</p>
              <div className="flex gap-2">
                <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-blue-dark transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </button>
                <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary-blue-dark transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2025 NewsSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
