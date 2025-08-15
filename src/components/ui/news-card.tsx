import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bookmark, Share2, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  summary: string;
  category: string;
  readTime: string;
  imageUrl?: string;
  isBookmarked?: boolean;
  rating?: number;
  onBookmark?: () => void;
  onShare?: () => void;
  onRate?: (rating: number) => void;
  className?: string;
}

export function NewsCard({
  title,
  summary,
  category,
  readTime,
  imageUrl,
  isBookmarked = false,
  rating = 0,
  onBookmark,
  onShare,
  onRate,
  className
}: NewsCardProps) {
  return (
    <Card className={cn(
      "group cursor-pointer bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border-border/50",
      className
    )}>
      {imageUrl && (
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={imageUrl}
            alt={title}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {category}
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
          {!imageUrl && (
            <Badge variant="outline">{category}</Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
          {summary}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark?.();
              }}
              className={cn(
                "h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors",
                isBookmarked && "text-primary bg-primary/10"
              )}
            >
              <Bookmark className={cn("h-4 w-4", isBookmarked && "fill-current")} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onShare?.();
              }}
              className="h-8 w-8 p-0 hover:bg-accent/10 hover:text-accent transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={(e) => {
                  e.stopPropagation();
                  onRate?.(star);
                }}
                className="p-0.5 hover:scale-110 transition-transform"
              >
                <Star
                  className={cn(
                    "h-3 w-3 transition-colors",
                    star <= rating
                      ? "fill-accent text-accent"
                      : "text-muted-foreground hover:text-accent"
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}