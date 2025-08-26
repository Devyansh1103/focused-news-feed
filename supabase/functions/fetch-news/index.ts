import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get NewsAPI key
    const newsApiKey = Deno.env.get('NEWS_API_KEY');
    if (!newsApiKey) {
      console.error('NEWS_API_KEY not found in environment variables');
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const { category = 'general', query } = await req.json().catch(() => ({}));
    
    console.log(`Fetching news for category: ${category}${query ? `, query: ${query}` : ''}`);

    let newsUrl;
    if (query && query.trim()) {
      // Use everything endpoint for search queries
      newsUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query.trim())}&apiKey=${newsApiKey}&pageSize=20&sortBy=relevancy&language=en`;
    } else {
      // Use top-headlines for category-based requests
      newsUrl = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${newsApiKey}&pageSize=20`;
    }

    // Fetch news from NewsAPI
    const newsResponse = await fetch(newsUrl);

    if (!newsResponse.ok) {
      const errorText = await newsResponse.text();
      console.error('NewsAPI error:', errorText);
      return new Response(JSON.stringify({ error: 'Failed to fetch news' }), {
        status: newsResponse.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const newsData = await newsResponse.json();
    console.log(`Fetched ${newsData.articles?.length || 0} articles from NewsAPI`);

    // Process and filter articles
    const articles = newsData.articles
      ?.filter((article: any) => 
        article.title && 
        article.description && 
        !article.title.includes('[Removed]') &&
        !article.description.includes('[Removed]')
      )
      .map((article: any) => {
        // Clean up any truncation indicators from the API response
        const cleanDescription = (article.description || '').replace(/\s*\[.*?\]\s*$/, '').trim();
        const cleanContent = (article.content || '').replace(/\s*\[.*?\]\s*$/, '').trim();
        
        return {
          title: article.title,
          summary: cleanDescription || cleanContent || 'No summary available for this article',
          content: cleanContent || cleanDescription || 'Full content not available',
          category: query ? 'search' : category,
          source: article.source?.name,
          author: article.author,
          url: article.url,
          image_url: article.urlToImage,
          published_at: article.publishedAt,
          read_time: Math.ceil((cleanContent.length || cleanDescription.length || 1000) / 200), // Rough estimate: 200 words per minute
        };
      }) || [];

    console.log(`Processing ${articles.length} valid articles`);

    if (articles.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No articles to process',
        processed: 0,
        inserted: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert articles into database (upsert to handle duplicates)
    const { data, error } = await supabase
      .from('articles')
      .upsert(articles, { 
        onConflict: 'url',
        ignoreDuplicates: true 
      })
      .select();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Database error', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const insertedCount = data?.length || 0;
    console.log(`Successfully inserted ${insertedCount} articles`);

    return new Response(JSON.stringify({
      message: 'News fetched and stored successfully',
      processed: articles.length,
      inserted: insertedCount,
      category: query ? 'search' : category,
      query: query || null
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});