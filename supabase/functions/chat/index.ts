// Supabase Edge Function: chat/index.ts
// Secure Server-side AI Grounded Customer Support Agent
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { businessId, conversationId, message, language = 'en' } = await req.json();

    if (!businessId || !message) {
      return new Response(
        JSON.stringify({ error: 'businessId and message are required parameters.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase Admin with Service Role Key
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const aiApiKey = Deno.env.get('AI_API_KEY') || Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase service keys not configured on server.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Verify target business exists
    const { data: business, error: bizError } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();

    if (bizError || !business) {
      return new Response(
        JSON.stringify({ error: 'Target business not found or access denied.' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Retrieve relevant published products and active FAQs
    const [{ data: products }, { data: faqs }] = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .eq('availability', 'in_stock'),
      supabaseAdmin
        .from('faqs')
        .select('*')
        .eq('business_id', businessId)
        .eq('is_active', true),
    ]);

    // Format ground truth context
    const productsContext = (products || [])
      .map(
        (p: any) =>
          `Product: ${p.name} | Price: ${p.price} ${p.currency} | Stock: ${p.stock_quantity} | Description: ${p.description}`
      )
      .join('\n');

    const faqsContext = (faqs || [])
      .map((f: any) => `Q: ${f.question}\nA: ${f.answer}`)
      .join('\n\n');

    const systemPrompt = `You are the official customer support AI assistant for "${business.name}".
Language to respond in: ${language === 'uz' ? 'Uzbek (O\'zbek tili)' : 'English'}.
CRITICAL RULES:
1. ONLY answer using the verified product and FAQ context provided below.
2. NEVER invent prices, availability, shipping times, or warranties not in the context.
3. If information is not in the context, politely state that it's unavailable or ask to connect with a human agent.
4. Keep answers friendly, professional, and accurate.

VERIFIED INVENTORY:
${productsContext || 'No products currently published.'}

VERIFIED FAQS:
${faqsContext || 'No FAQs currently published.'}`;

    // 3. Check AI API key
    if (!aiApiKey) {
      return new Response(
        JSON.stringify({
          error: 'AI API Key (AI_API_KEY) is not configured in Supabase secrets.',
          needsConfig: true,
        }),
        { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 4. Call AI completion (e.g. OpenAI / Gemini-compatible endpoint)
    const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${aiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        temperature: 0.2,
      }),
    });

    const aiData = await aiResponse.json();
    const replyText = aiData?.choices?.[0]?.message?.content || 'Thank you for your message. An agent will assist you soon.';

    // 5. Match referenced products
    const matchedProducts = (products || []).filter((p: any) =>
      message.toLowerCase().includes(p.name.toLowerCase()) ||
      replyText.toLowerCase().includes(p.name.toLowerCase())
    );

    return new Response(
      JSON.stringify({
        reply: replyText,
        productsMentioned: matchedProducts,
        language,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
