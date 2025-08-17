import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Search, Bell, Settings, Menu, Sun, Moon } from "lucide-react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onMenuClick?: () => void;
}

export function Header({ onSearch, onMenuClick }: HeaderProps) {
  const [isDark, setIsDark] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Home
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Trending
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
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
                // Handle notifications
                console.log("Notifications clicked");
                // You can add notification panel logic here
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
                // Handle settings
                console.log("Settings clicked");
                // You can add settings panel logic here
              }}
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-transparent hover:ring-primary/20 transition-all">
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback className="bg-gradient-primary text-white text-sm font-medium">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}