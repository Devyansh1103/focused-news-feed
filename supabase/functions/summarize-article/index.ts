import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { articleContent, maxLength = 150 } = await req.json();

    if (!articleContent) {
      return new Response(JSON.stringify({ error: 'Article content is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get OpenAI API key
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found in environment variables');
      // Fallback to simple text truncation
      const fallbackSummary = articleContent
        .substring(0, maxLength * 4) // Rough estimate for character count
        .split('.')
        .slice(0, 3)
        .join('.')
        .trim() + '.';
      
      return new Response(JSON.stringify({ 
        summary: fallbackSummary,
        method: 'fallback' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Calling OpenAI API for article summarization');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a professional news summarizer. Create concise, informative summaries of news articles. Keep summaries under ${maxLength} words and focus on the key facts and main points.`
          },
          {
            role: 'user',
            content: `Summarize this article: ${articleContent}`
          }
        ],
        max_tokens: Math.min(maxLength * 2, 300),
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      
      // Fallback to simple text processing
      const fallbackSummary = articleContent
        .substring(0, maxLength * 4)
        .split('.')
        .slice(0, 3)
        .join('.')
        .trim() + '.';
      
      return new Response(JSON.stringify({ 
        summary: fallbackSummary,
        method: 'fallback',
        error: 'OpenAI API unavailable'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const summary = data.choices[0]?.message?.content?.trim();

    if (!summary) {
      throw new Error('No summary generated');
    }

    console.log('Successfully generated summary with OpenAI');

    return new Response(JSON.stringify({ 
      summary,
      method: 'openai' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in summarize-article function:', error);
    
    // Try to provide a fallback summary if we have the original content
    try {
      const { articleContent, maxLength = 150 } = await req.json();
      if (articleContent) {
        const fallbackSummary = articleContent
          .substring(0, maxLength * 4)
          .split('.')
          .slice(0, 3)
          .join('.')
          .trim() + '.';
        
        return new Response(JSON.stringify({ 
          summary: fallbackSummary,
          method: 'fallback',
          error: error instanceof Error ? error.message : 'Unknown error'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } catch (fallbackError) {
      console.error('Fallback summary generation failed:', fallbackError);
    }

    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});