import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell, Settings, Menu, Sun, Moon, LogOut } from "lucide-react";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

export function Header({ onSearch, onMenuClick, activeCategory, onCategoryChange }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    document.documentElement.classList.toggle('dark', newIsDark);
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuClick}
                className="md:hidden p-2"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NS</span>
                </div>
                <span className="font-bold text-xl text-foreground hidden sm:block">
                  NewsSphere
                </span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-1">
              <Button 
                variant="ghost" 
                className={`text-muted-foreground hover:text-foreground ${activeCategory === "All" ? "text-foreground bg-muted" : ""}`}
                onClick={() => {
                  onCategoryChange?.("All");
                  toast({
                    title: "Category changed",
                    description: "Showing all news articles",
                  });
                }}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className={`text-muted-foreground hover:text-foreground ${activeCategory === "Technology" ? "text-foreground bg-muted" : ""}`}
                onClick={() => {
                  onCategoryChange?.("Technology");
                  toast({
                    title: "Category changed",
                    description: "Showing trending technology news",
                  });
                }}
              >
                Trending
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  toast({
                    title: "Bookmarks",
                    description: "Bookmarks feature coming soon",
                  });
                }}
              >
                Bookmarks
              </Button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border focus:bg-background transition-colors"
              />
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={toggleTheme}
              className="p-2 hover:bg-muted transition-colors"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-accent transition-transform hover:rotate-12" />
              ) : (
                <Moon className="h-5 w-5 text-primary transition-transform hover:-rotate-12" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative p-2"
              onClick={() => {
                toast({
                  title: "Notifications",
                  description: "You have 3 new notifications",
                });
              }}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full border-2 border-background"></span>
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hidden sm:flex"
              onClick={() => {
                toast({
                  title: "Settings",
                  description: "Settings panel coming soon",
                });
              }}
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={signOut}
                  className="p-2 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
                  <AvatarImage src={user?.user_metadata?.avatar_url} alt="User" />
                  <AvatarFallback className="bg-gradient-primary text-white text-sm font-medium">
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <AuthModal>
                <Button variant="default" size="sm">
                  Sign In
                </Button>
              </AuthModal>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}