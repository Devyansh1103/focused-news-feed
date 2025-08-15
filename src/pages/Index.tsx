import { useState } from "react";
import { Header } from "@/components/ui/header";
import { HeroSection } from "@/components/ui/hero-section";
import { CategoryFilter } from "@/components/ui/category-filter";
import { NewsCard } from "@/components/ui/news-card";
import { useToast } from "@/hooks/use-toast";
import { featuredArticle, newsArticles, categories } from "@/data/sampleNews";
import heroImage from "@/assets/hero-news.jpg";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(
    new Set(newsArticles.filter(article => article.isBookmarked).map(article => article.id))
  );
  const [articleRatings, setArticleRatings] = useState<Record<string, number>>(
    Object.fromEntries(newsArticles.map(article => [article.id, article.rating || 0]))
  );
  const { toast } = useToast();

  const filteredArticles = activeCategory === "All" 
    ? newsArticles 
    : newsArticles.filter(article => article.category === activeCategory);

  const handleBookmark = (articleId: string) => {
    const newBookmarked = new Set(bookmarkedArticles);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
      toast({
        title: "Bookmark removed",
        description: "Article removed from your bookmarks",
      });
    } else {
      newBookmarked.add(articleId);
      toast({
        title: "Article bookmarked",
        description: "Added to your reading list",
      });
    }
    setBookmarkedArticles(newBookmarked);
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
    setArticleRatings(prev => ({ ...prev, [articleId]: rating }));
    toast({
      title: "Rating saved",
      description: `You rated this article ${rating} star${rating !== 1 ? 's' : ''}`,
    });
  };

  const handleSearch = (query: string) => {
    toast({
      title: "Search functionality",
      description: `Searching for: "${query}"`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onSearch={handleSearch} />
      
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
          onReadMore={() => toast({
            title: "Opening article",
            description: "Full article view coming soon",
          })}
        />

        {/* Category Filter */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Latest News</h2>
              <p className="text-muted-foreground">Stay updated with the latest stories from around the world</p>
            </div>
          </div>
          
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </section>

        {/* News Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard
              key={article.id}
              title={article.title}
              summary={article.summary}
              category={article.category}
              readTime={article.readTime}
              imageUrl={article.imageUrl}
              isBookmarked={bookmarkedArticles.has(article.id)}
              rating={articleRatings[article.id] || 0}
              onBookmark={() => handleBookmark(article.id)}
              onShare={() => handleShare(article.title)}
              onRate={(rating) => handleRate(article.id, rating)}
            />
          ))}
        </section>

        {/* Load More */}
        <div className="text-center pt-8">
          <button
            onClick={() => toast({
              title: "Loading more articles",
              description: "Fetching the latest news for you",
            })}
            className="bg-gradient-primary text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Load More Articles
          </button>
        </div>
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
            <p>&copy; 2024 NewsSphere. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
