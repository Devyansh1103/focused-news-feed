import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface UserBehavior {
  searches: string[];
  viewedCategories: { [category: string]: number };
  clickedArticles: string[];
}

interface SmartNotification {
  id: string;
  title: string;
  message: string;
  type: 'search' | 'category' | 'trending';
  articleId?: string;
  timestamp: Date;
  read: boolean;
}

export const useUserBehavior = () => {
  const { user } = useAuth();
  const [behavior, setBehavior] = useState<UserBehavior>({
    searches: [],
    viewedCategories: {},
    clickedArticles: []
  });
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);

  // Load behavior from localStorage
  useEffect(() => {
    if (user) {
      const savedBehavior = localStorage.getItem(`user_behavior_${user.id}`);
      if (savedBehavior) {
        setBehavior(JSON.parse(savedBehavior));
      }
      
      const savedNotifications = localStorage.getItem(`user_notifications_${user.id}`);
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })));
      }
    }
  }, [user]);

  // Save behavior to localStorage
  const saveBehavior = (newBehavior: UserBehavior) => {
    if (user) {
      setBehavior(newBehavior);
      localStorage.setItem(`user_behavior_${user.id}`, JSON.stringify(newBehavior));
    }
  };

  // Save notifications to localStorage
  const saveNotifications = (newNotifications: SmartNotification[]) => {
    if (user) {
      setNotifications(newNotifications);
      localStorage.setItem(`user_notifications_${user.id}`, JSON.stringify(newNotifications));
    }
  };

  const trackSearch = (query: string) => {
    if (!user || !query.trim()) return;
    
    const newBehavior = {
      ...behavior,
      searches: [...behavior.searches.filter(s => s !== query.trim()), query.trim()].slice(-10) // Keep last 10 searches
    };
    saveBehavior(newBehavior);

    // Create notification for search-based news
    const notification: SmartNotification = {
      id: `search_${Date.now()}`,
      title: 'New articles found!',
      message: `Fresh articles about "${query}" are available`,
      type: 'search',
      timestamp: new Date(),
      read: false
    };
    
    const newNotifications = [notification, ...notifications].slice(0, 20); // Keep last 20 notifications
    saveNotifications(newNotifications);
  };

  const trackCategoryView = (category: string) => {
    if (!user || !category) return;
    
    const newBehavior = {
      ...behavior,
      viewedCategories: {
        ...behavior.viewedCategories,
        [category]: (behavior.viewedCategories[category] || 0) + 1
      }
    };
    saveBehavior(newBehavior);

    // Create notification for popular category
    const viewCount = newBehavior.viewedCategories[category];
    if (viewCount % 5 === 0) { // Every 5th view
      const notification: SmartNotification = {
        id: `category_${category}_${Date.now()}`,
        title: `${category} news update`,
        message: `New trending articles in ${category} - your favorite category!`,
        type: 'category',
        timestamp: new Date(),
        read: false
      };
      
      const newNotifications = [notification, ...notifications].slice(0, 20);
      saveNotifications(newNotifications);
    }
  };

  const trackArticleClick = (articleId: string) => {
    if (!user || !articleId) return;
    
    const newBehavior = {
      ...behavior,
      clickedArticles: [...behavior.clickedArticles.filter(id => id !== articleId), articleId].slice(-50) // Keep last 50 clicks
    };
    saveBehavior(newBehavior);
  };

  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    saveNotifications(updatedNotifications);
  };

  const getMostViewedCategory = () => {
    const categories = Object.entries(behavior.viewedCategories);
    if (categories.length === 0) return null;
    
    return categories.reduce((prev, current) => 
      prev[1] > current[1] ? prev : current
    )[0];
  };

  const getRecentSearches = () => {
    return behavior.searches.slice(-5); // Last 5 searches
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    behavior,
    notifications,
    unreadCount,
    trackSearch,
    trackCategoryView,
    trackArticleClick,
    markNotificationAsRead,
    deleteNotification,
    markAllNotificationsAsRead,
    getMostViewedCategory,
    getRecentSearches
  };
};