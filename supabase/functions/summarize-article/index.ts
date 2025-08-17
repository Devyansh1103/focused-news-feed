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
    const { articleContent, maxLength = 150 } = await req.json()

    if (!articleContent) {
      throw new Error('Article content is required')
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not found in environment variables')
    }

    // Use OpenAI to summarize the article
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a professional news summarizer. Create concise, engaging summaries that capture the key points of news articles. Keep summaries under ${maxLength} characters.`
          },
          {
            role: 'user',
            content: `Please summarize this news article:\n\n${articleContent}`
          }
        ],
        max_tokens: 100,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate summary with OpenAI')
    }

    const data = await response.json()
    const summary = data.choices[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error('Failed to generate summary')
    }

    return new Response(
      JSON.stringify({ summary }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    
    // Fallback: create a simple summary by taking first sentences
    try {
      const { articleContent, maxLength = 150 } = await req.json()
      const sentences = articleContent.split('. ')
      let summary = sentences[0]
      
      for (let i = 1; i < sentences.length && summary.length < maxLength - 50; i++) {
        summary += '. ' + sentences[i]
      }
      
      if (summary.length > maxLength) {
        summary = summary.substring(0, maxLength - 3) + '...'
      }

      return new Response(
        JSON.stringify({ summary }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        },
      )
    } catch (fallbackError) {
      return new Response(
        JSON.stringify({ error: error.message }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }
  }
})