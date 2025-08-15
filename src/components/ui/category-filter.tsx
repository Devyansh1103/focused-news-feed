import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
  className
}: CategoryFilterProps) {
  return (
    <div className={cn("flex items-center gap-3 overflow-x-auto pb-2", className)}>
      <Button
        variant={activeCategory === "All" ? "default" : "outline"}
        onClick={() => onCategoryChange("All")}
        className={cn(
          "whitespace-nowrap transition-all duration-200",
          activeCategory === "All"
            ? "bg-primary text-primary-foreground shadow-md"
            : "hover:bg-primary/10 hover:text-primary hover:border-primary/50"
        )}
      >
        All News
      </Button>
      
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onCategoryChange(category)}
          className={cn(
            "whitespace-nowrap transition-all duration-200",
            activeCategory === category
              ? "bg-primary text-primary-foreground shadow-md"
              : "hover:bg-primary/10 hover:text-primary hover:border-primary/50"
          )}
        >
          {category}
        </Button>
      ))}
    </div>
  );
}