export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  imageUrl?: string;
  isBookmarked?: boolean;
  rating?: number;
  publishedAt: string;
}

export const featuredArticle: NewsArticle = {
  id: "featured-1",
  title: "The Future of AI in Journalism: How Machine Learning is Revolutionizing News Creation",
  summary: "Discover how artificial intelligence and machine learning are transforming the way news is gathered, processed, and delivered to readers worldwide. From automated fact-checking to personalized content curation, explore the cutting-edge technologies reshaping modern journalism.",
  category: "Technology",
  readTime: "8 min read",
  imageUrl: "/src/assets/hero-news.jpg",
  isBookmarked: false,
  rating: 4,
  publishedAt: "2024-01-15T10:00:00Z"
};

export const newsArticles: NewsArticle[] = [
  {
    id: "tech-1",
    title: "OpenAI Releases GPT-5: The Next Generation of Language Models",
    summary: "The latest iteration promises unprecedented natural language understanding and generation capabilities, setting new benchmarks in AI performance across multiple domains.",
    category: "Technology",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop",
    isBookmarked: true,
    rating: 5,
    publishedAt: "2024-01-15T09:30:00Z"
  },
  {
    id: "business-1",
    title: "Global Markets React to Federal Reserve's Latest Interest Rate Decision",
    summary: "Stock markets worldwide show mixed reactions as central banks navigate inflation concerns while maintaining economic growth momentum.",
    category: "Business",
    readTime: "4 min read",
    imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop",
    isBookmarked: false,
    rating: 3,
    publishedAt: "2024-01-15T08:45:00Z"
  },
  {
    id: "health-1",
    title: "Revolutionary Cancer Treatment Shows 95% Success Rate in Clinical Trials",
    summary: "A breakthrough immunotherapy approach demonstrates remarkable efficacy in treating previously untreatable forms of cancer, offering new hope to patients worldwide.",
    category: "Health",
    readTime: "7 min read",
    imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
    isBookmarked: true,
    rating: 5,
    publishedAt: "2024-01-15T07:15:00Z"
  },
  {
    id: "entertainment-1",
    title: "Netflix Announces Ambitious Expansion into Interactive Storytelling",
    summary: "The streaming giant reveals plans for AI-powered interactive content that adapts storylines based on viewer preferences and real-time emotional responses.",
    category: "Entertainment",
    readTime: "5 min read",
    imageUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&h=300&fit=crop",
    isBookmarked: false,
    rating: 4,
    publishedAt: "2024-01-15T06:00:00Z"
  },
  {
    id: "science-1",
    title: "NASA's James Webb Telescope Discovers Earth-Like Exoplanet in Habitable Zone",
    summary: "The discovery of Kepler-442c marks a significant milestone in the search for potentially habitable worlds beyond our solar system.",
    category: "Science",
    readTime: "9 min read",
    imageUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&h=300&fit=crop",
    isBookmarked: true,
    rating: 5,
    publishedAt: "2024-01-14T20:30:00Z"
  },
  {
    id: "tech-2",
    title: "Apple Unveils Next-Generation VR Headset with Revolutionary Display Technology",
    summary: "The new device features breakthrough micro-OLED displays and advanced spatial computing capabilities, setting new standards for virtual reality experiences.",
    category: "Technology",
    readTime: "6 min read",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop",
    isBookmarked: false,
    rating: 4,
    publishedAt: "2024-01-14T18:00:00Z"
  }
];

export const categories = ["Technology", "Business", "Health", "Entertainment", "Science", "Sports", "Politics"];