import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    // Get NEWS_API_KEY from Supabase secrets
    const newsApiKey = Deno.env.get('NEWS_API_KEY')
    if (!newsApiKey) {
      throw new Error('NEWS_API_KEY not found in environment variables')
    }

    const { category = 'general' } = await req.json()

    // Fetch news from NewsAPI
    const newsResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?category=${category}&country=us&pageSize=20&apiKey=${newsApiKey}`
    )

    if (!newsResponse.ok) {
      throw new Error('Failed to fetch news from NewsAPI')
    }

    const newsData = await newsResponse.json()

    // Process and save articles to database
    const articlesToInsert = newsData.articles
      .filter((article: any) => article.title && article.description)
      .map((article: any) => ({
        title: article.title,
        summary: article.description,
        content: article.content || article.description,
        category: category,
        source: article.source?.name || 'Unknown',
        author: article.author,
        url: article.url,
        image_url: article.urlToImage,
        published_at: article.publishedAt,
        read_time: Math.max(1, Math.floor(article.content?.length / 200) || 3)
      }))

    // Insert articles into database (ignore duplicates)
    const { data: insertedArticles, error } = await supabase
      .from('articles')
      .upsert(articlesToInsert, { 
        onConflict: 'url',
        ignoreDuplicates: true 
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        articlesProcessed: articlesToInsert.length,
        articlesInserted: insertedArticles?.length || 0
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})