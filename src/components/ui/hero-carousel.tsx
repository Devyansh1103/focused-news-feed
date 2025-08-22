import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Bookmark, Share2, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  imageUrl: string;
}

interface HeroCarouselProps {
  articles: Article[];
  onBookmark: (articleId: string) => void;
  onShare: (title: string) => void;
  onReadMore: (articleId: string) => void;
}

export function HeroCarousel({
  articles,
  onBookmark,
  onShare,
  onReadMore
}: HeroCarouselProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const handleSelect = () => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  };

  return (
    <section className="relative">
      <Carousel
        setApi={setApi}
        onSelect={handleSelect}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {articles.map((article) => (
            <CarouselItem key={article.id}>
              <div className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-hero shadow-hero">
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${article.imageUrl})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      Featured Story
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-white/80">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{article.readTime}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                    {article.title}
                  </h1>
                  
                  <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90 max-w-3xl mx-auto drop-shadow-md">
                    {article.summary}
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    <Button
                      onClick={() => onReadMore(article.id)}
                      size="lg"
                      className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    >
                      Read Full Story
                    </Button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => onBookmark(article.id)}
                        className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm p-3"
                      >
                        <Bookmark className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => onShare(article.title)}
                        className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm p-3"
                      >
                        <Share2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="left-4 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm" />
        <CarouselNext className="right-4 bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm" />
      </Carousel>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {articles.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              current === index ? 'bg-primary w-8' : 'bg-primary/30'
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </section>
  );
}