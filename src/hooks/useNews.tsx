import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Article {
  id: string
  title: string
  summary: string | null
  content: string | null
  category: string
  source: string | null
  author: string | null
  url: string | null
  image_url: string | null
  published_at: string | null
  read_time: number | null
  created_at: string
}

export const useNews = (category: string = 'All', searchQuery: string = '') => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(20)

      if (category !== 'All') {
        query = query.eq('category', category.toLowerCase())
      }

      if (searchQuery.trim()) {
        query = query.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error

      setArticles(data || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error loading articles",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchNewsFromAPI = async (targetCategory: string = 'general') => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { category: targetCategory.toLowerCase() }
      })

      if (error) throw error

      toast({
        title: "News updated",
        description: `Fetched ${data.processed} new articles`,
      })

      // Refresh the articles list
      await fetchArticles()
    } catch (err: any) {
      toast({
        title: "Error fetching news",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const searchNews = async (query: string) => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.functions.invoke('fetch-news', {
        body: { 
          category: 'general',
          query: query.trim()
        }
      })

      if (error) throw error

      // After fetching new articles, get them from database with search filter
      let searchQuery = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (query.trim()) {
        searchQuery = searchQuery.or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
      }

      const { data: searchResults, error: searchError } = await searchQuery

      if (searchError) throw searchError

      setArticles(searchResults || [])
      
      toast({
        title: "Search completed",
        description: `Found ${searchResults?.length || 0} articles for "${query}"`,
      })

    } catch (err: any) {
      toast({
        title: "Error searching news",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchTrendingNews = async () => {
    try {
      const categories = ['general', 'business', 'technology', 'sports', 'entertainment'];
      const promises = categories.map(cat => 
        supabase.functions.invoke('fetch-news', {
          body: { category: cat }
        })
      );
      
      await Promise.all(promises);
      
      toast({
        title: "Trending news updated",
        description: "Fetched trending articles from all categories",
      })

      await fetchArticles()
    } catch (err: any) {
      toast({
        title: "Error fetching trending news",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [category, searchQuery])

  return {
    articles,
    loading,
    error,
    refetch: fetchArticles,
    fetchNewsFromAPI,
    fetchTrendingNews,
    searchNews,
  }
}