import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Bookmark, Share2 } from "lucide-react";

interface HeroSectionProps {
  title: string;
  summary: string;
  category: string;
  readTime: string;
  imageUrl: string;
  onBookmark?: () => void;
  onShare?: () => void;
  onReadMore?: () => void;
}

export function HeroSection({
  title,
  summary,
  category,
  readTime,
  imageUrl,
  onBookmark,
  onShare,
  onReadMore
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-hero shadow-hero">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/50" />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
        <div className="flex items-center justify-center gap-4 mb-6">
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
            Featured Story
          </Badge>
          <Badge variant="outline" className="bg-white/10 text-white border-white/30 backdrop-blur-sm">
            {category}
          </Badge>
          <div className="flex items-center gap-1 text-white/80">
            <Clock className="h-4 w-4" />
            <span className="text-sm">{readTime}</span>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
          {title}
        </h1>
        
        <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90 max-w-3xl mx-auto drop-shadow-md">
          {summary}
        </p>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Button
            onClick={onReadMore}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            Read Full Story
          </Button>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={onBookmark}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm p-3"
            >
              <Bookmark className="h-5 w-5" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={onShare}
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 backdrop-blur-sm p-3"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}