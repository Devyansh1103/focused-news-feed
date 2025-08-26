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

      // First search existing articles
      let searchQuery = supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (query.trim()) {
        // Build a broader OR search across significant keywords to improve recall
        const tokens = query
          .split(/\s+/)
          .map(t => t.trim())
          .filter(t => t.length >= 3);
        const uniqueTokens = Array.from(new Set(tokens));
        const orClauses = uniqueTokens.length > 0
          ? uniqueTokens.map(t => `title.ilike.%${t}%,summary.ilike.%${t}%,content.ilike.%${t}%`).join(',')
          : `title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`;
        searchQuery = searchQuery.or(orClauses)
      }

      const { data: existingResults, error: searchError } = await searchQuery
      if (searchError) throw searchError

      // If we have fewer than 2 results, fetch from API with the query
      if (!existingResults || existingResults.length < 2) {
        const { data, error } = await supabase.functions.invoke('fetch-news', {
          body: { 
            category: 'general',
            query: query.trim()
          }
        })

        if (error) throw error

        // Search again after fetching
        const { data: newResults, error: newSearchError } = await searchQuery
        if (newSearchError) throw newSearchError
        let finalResults = newResults || []

        // If still fewer than 2 results, broaden once more by using the longest token
        if (finalResults.length < 2 && query.trim()) {
          const tokens = query
            .split(/\s+/)
            .map(t => t.trim())
            .filter(t => t.length >= 3)
            .sort((a, b) => b.length - a.length)
          const broadToken = tokens[0] || query.trim()
          const { data: broadResults } = await supabase
            .from('articles')
            .select('*')
            .or(`title.ilike.%${broadToken}%,summary.ilike.%${broadToken}%,content.ilike.%${broadToken}%`)
            .order('created_at', { ascending: false })
            .limit(20)
          if (broadResults && broadResults.length > 0) {
            // Merge and dedupe by id
            const map: Record<string, any> = {}
            for (const a of [...finalResults, ...broadResults]) {
              map[a.id] = a
            }
            finalResults = Object.values(map) as any[]
          }
        }

        // As a last resort, show latest general headlines to guarantee at least two
        if (finalResults.length < 2) {
          const { data: latest } = await supabase
            .from('articles')
            .select('*')
            .order('published_at', { ascending: false })
            .limit(10)
          if (latest && latest.length > 0) {
            finalResults = latest.slice(0, Math.max(2, latest.length))
          }
        }

        setArticles(finalResults)
      } else {
        setArticles(existingResults)
      }
      
      const resultCount = (existingResults && existingResults.length >= 2) ? existingResults.length : (Array.isArray(articles) ? articles.length : 0)
      toast({
        title: "Search completed",
        description: `Found ${resultCount} articles for "${query}"`,
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
      const categories = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];
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