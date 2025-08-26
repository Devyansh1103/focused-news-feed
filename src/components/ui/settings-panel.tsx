import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Settings, Bell, Eye, Globe, Palette, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  children: React.ReactNode;
}

export function SettingsPanel({ children }: SettingsPanelProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      push: true,
      email: false,
      breaking: true,
      trending: true,
    },
    display: {
      theme: 'auto',
      compactMode: false,
      showImages: true,
      articlesPerPage: 20,
    },
    privacy: {
      tracking: true,
      analytics: true,
      personalized: true,
    },
    language: 'en',
    region: 'us',
  });

  const updateSetting = (category: keyof typeof settings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...(prev[category] as any),
        [key]: value,
      },
    }));
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved",
    });
  };

  const updateTopLevelSetting = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
    
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Notifications */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push-notifications" className="flex flex-col gap-1">
                  <span>Push Notifications</span>
                  <span className="text-xs text-muted-foreground">Receive notifications in your browser</span>
                </Label>
                <Switch
                  id="push-notifications"
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notifications" className="flex flex-col gap-1">
                  <span>Email Notifications</span>
                  <span className="text-xs text-muted-foreground">Get updates via email</span>
                </Label>
                <Switch
                  id="email-notifications"
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) => updateSetting('notifications', 'email', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="breaking-news" className="flex flex-col gap-1">
                  <span>Breaking News</span>
                  <span className="text-xs text-muted-foreground">Important news alerts</span>
                </Label>
                <Switch
                  id="breaking-news"
                  checked={settings.notifications.breaking}
                  onCheckedChange={(checked) => updateSetting('notifications', 'breaking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="trending-topics" className="flex flex-col gap-1">
                  <span>Trending Topics</span>
                  <span className="text-xs text-muted-foreground">Popular story notifications</span>
                </Label>
                <Switch
                  id="trending-topics"
                  checked={settings.notifications.trending}
                  onCheckedChange={(checked) => updateSetting('notifications', 'trending', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Display */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Display</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme-select" className="flex flex-col gap-1">
                  <span>Theme</span>
                  <span className="text-xs text-muted-foreground">Choose your preferred theme</span>
                </Label>
                <Select 
                  value={settings.display.theme} 
                  onValueChange={(value) => updateSetting('display', 'theme', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="compact-mode" className="flex flex-col gap-1">
                  <span>Compact Mode</span>
                  <span className="text-xs text-muted-foreground">Show more articles per screen</span>
                </Label>
                <Switch
                  id="compact-mode"
                  checked={settings.display.compactMode}
                  onCheckedChange={(checked) => updateSetting('display', 'compactMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="show-images" className="flex flex-col gap-1">
                  <span>Show Images</span>
                  <span className="text-xs text-muted-foreground">Display article images</span>
                </Label>
                <Switch
                  id="show-images"
                  checked={settings.display.showImages}
                  onCheckedChange={(checked) => updateSetting('display', 'showImages', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="articles-per-page" className="flex flex-col gap-1">
                  <span>Articles per page</span>
                  <span className="text-xs text-muted-foreground">Number of articles to load</span>
                </Label>
                <Select 
                  value={settings.display.articlesPerPage.toString()} 
                  onValueChange={(value) => updateSetting('display', 'articlesPerPage', parseInt(value))}
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Language & Region */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Language & Region</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language-select" className="flex flex-col gap-1">
                  <span>Language</span>
                  <span className="text-xs text-muted-foreground">Content language preference</span>
                </Label>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => updateTopLevelSetting('language', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="region-select" className="flex flex-col gap-1">
                  <span>Region</span>
                  <span className="text-xs text-muted-foreground">News source region</span>
                </Label>
                <Select 
                  value={settings.region} 
                  onValueChange={(value) => updateTopLevelSetting('region', value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="au">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Privacy */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Database className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">Privacy</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="tracking" className="flex flex-col gap-1">
                  <span>Allow Tracking</span>
                  <span className="text-xs text-muted-foreground">Help improve the service</span>
                </Label>
                <Switch
                  id="tracking"
                  checked={settings.privacy.tracking}
                  onCheckedChange={(checked) => updateSetting('privacy', 'tracking', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="analytics" className="flex flex-col gap-1">
                  <span>Analytics</span>
                  <span className="text-xs text-muted-foreground">Usage analytics and performance</span>
                </Label>
                <Switch
                  id="analytics"
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => updateSetting('privacy', 'analytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="personalized" className="flex flex-col gap-1">
                  <span>Personalized Content</span>
                  <span className="text-xs text-muted-foreground">Customized article recommendations</span>
                </Label>
                <Switch
                  id="personalized"
                  checked={settings.privacy.personalized}
                  onCheckedChange={(checked) => updateSetting('privacy', 'personalized', checked)}
                />
              </div>
            </div>
          </Card>

          <Separator />

          <div className="flex justify-between">
            <Badge variant="outline" className="text-xs">
              Version 1.0.0
            </Badge>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast({
                  title: "Settings reset",
                  description: "All settings have been reset to defaults",
                });
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}