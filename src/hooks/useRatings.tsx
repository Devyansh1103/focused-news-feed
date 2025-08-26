import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

export const useRatings = () => {
  const [articleRatings, setArticleRatings] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchRatings = async () => {
    if (!user) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('ratings')
        .select('article_id, rating')
        .eq('user_id', user.id)

      if (error) throw error

      const ratingsMap = data.reduce((acc, rating) => {
        acc[rating.article_id] = rating.rating
        return acc
      }, {} as Record<string, number>)

      setArticleRatings(ratingsMap)
    } catch (err: any) {
      console.error('Error fetching ratings:', err)
    } finally {
      setLoading(false)
    }
  }

  const rateArticle = async (articleId: string, rating: number) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to rate articles",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase
        .from('ratings')
        .upsert({
          user_id: user.id,
          article_id: articleId,
          rating: rating,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      setArticleRatings(prev => ({ ...prev, [articleId]: rating }))

      toast({
        title: "Rating saved",
        description: `You rated this article ${rating} star${rating !== 1 ? 's' : ''}`,
      })
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    fetchRatings()
  }, [user])

  return {
    articleRatings,
    loading,
    rateArticle,
    refetch: fetchRatings,
  }
}