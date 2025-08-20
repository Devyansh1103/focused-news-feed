import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export const useBookmarks = () => {
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchBookmarks = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('bookmarks')
        .select('article_id')
        .eq('user_id', user.id)

      if (error) throw error

      setBookmarkedArticles(new Set(data.map(bookmark => bookmark.article_id)))
    } catch (err: any) {
      console.error('Error fetching bookmarks:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleBookmark = async (articleId: string) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to bookmark articles",
        variant: "destructive",
      })
      return
    }

    try {
      const isBookmarked = bookmarkedArticles.has(articleId)

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('article_id', articleId)

        if (error) throw error

        setBookmarkedArticles(prev => {
          const newSet = new Set(prev)
          newSet.delete(articleId)
          return newSet
        })

        toast({
          title: "Bookmark removed",
          description: "Article removed from your bookmarks",
        })
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            article_id: articleId,
          })

        if (error) throw error

        setBookmarkedArticles(prev => new Set([...prev, articleId]))

        toast({
          title: "Article bookmarked",
          description: "Added to your reading list",
        })
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchBookmarks()
  }, [user])

  return {
    bookmarkedArticles,
    loading,
    toggleBookmark,
    refetch: fetchBookmarks,
  }
}