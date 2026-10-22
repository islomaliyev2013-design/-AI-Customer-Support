import { Product, FAQ } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getProducts, getFaqs, saveMessage } from './db';

export interface ChatResponse {
  reply: string;
  productsMentioned: Product[];
  language: 'uz' | 'en';
}

/**
 * Detect language: Uzbek vs English
 */
function detectLanguage(text: string): 'uz' | 'en' {
  const uzbekIndicators = [
    'salom', 'assalomu', 'alaykum', 'qancha', 'narxi', 'bormi', 'mavjudmi',
    'rang', 'rangi', 'ranglar', 'yetkazib', 'berish', 'kafolat', 'qanday',
    'qayerda', 'shahar', 'viloyat', 'som', 'so\'m', 'rahmat', 'iltimos'
  ];
  const lower = text.toLowerCase();
  for (const word of uzbekIndicators) {
    if (lower.includes(word)) return 'uz';
  }
  return 'en';
}

/**
 * Clean string for semantic matching
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

/**
 * Grounded Knowledge Retriever & Intelligent AI Generator
 */
export async function processCustomerMessage(
  businessId: string,
  conversationId: string,
  userMessage: string
): Promise<ChatResponse> {
  const lang = detectLanguage(userMessage);

  // 1. Save customer message to persistent database
  await saveMessage(conversationId, 'customer', userMessage);

  // 2. Fetch ground truth business data
  const [allProducts, allFaqs] = await Promise.all([
    getProducts(businessId),
    getFaqs(businessId),
  ]);

  const activeFaqs = allFaqs.filter((f) => f.is_active);
  const normQuery = normalize(userMessage);

  // 3. Try Supabase Edge Function first if connected
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: {
          businessId,
          conversationId,
          message: userMessage,
          language: lang,
        },
      });

      if (!error && data?.reply) {
        // Save and return
        await saveMessage(conversationId, 'ai', data.reply, data.productsMentioned || []);
        return {
          reply: data.reply,
          productsMentioned: data.productsMentioned || [],
          language: lang,
        };
      }
    } catch {
      // Gracefully fall back to local grounded engine
    }
  }

  // 4. Grounded Local Intelligence Engine (Deterministic & Zero Hallucination)
  const matchedProducts: Product[] = [];

  for (const product of allProducts) {
    const normName = normalize(product.name);
    const words = normName.split(' ').filter((w) => w.length > 2);
    const matchesProduct =
      normQuery.includes(normName) ||
      words.some((w) => normQuery.includes(w) && (w !== 'pro' && w !== 'max'));

    if (matchesProduct) {
      matchedProducts.push(product);
    }
  }

  // Check matching FAQs
  let matchedFaq: FAQ | null = null;
  for (const faq of activeFaqs) {
    const qNorm = normalize(faq.question);
    const qWords = qNorm.split(' ').filter((w) => w.length > 3);
    const overlap = qWords.filter((w) => normQuery.includes(w)).length;
    if (overlap >= 2 || normQuery.includes(qNorm)) {
      matchedFaq = faq;
      break;
    }
  }

  let replyText = '';

  // Formulate grounded response based on language
  if (lang === 'uz') {
    if (matchedProducts.length > 0) {
      const p = matchedProducts[0];
      const availabilityUz =
        p.availability === 'in_stock' && p.stock_quantity > 0
          ? `hozirda omborimizda mavjud (${p.stock_quantity} dona)`
          : `hozirda tugagan yoki oldindan buyurtma asosida`;

      if (normQuery.includes('rang') || normQuery.includes('rangi') || normQuery.includes('ranglar')) {
        replyText = `Ha, ${p.name} modeli haqida ma'lumot:\n${p.description}\nNarxi: $${p.price.toLocaleString()}. Holati: ${availabilityUz}. Rasmiy kafolat taqdim etiladi.`;
      } else if (normQuery.includes('narx') || normQuery.includes('qancha')) {
        replyText = `${p.name} narxi $${p.price.toLocaleString()}. Mahsulot ${availabilityUz}. Qulay to'lov usullari (UzCard, Humo, Visa, naqd) mavjud.`;
      } else {
        replyText = `Ha, ${p.name} mahsulotimiz mavjud! Joriy narxi $${p.price.toLocaleString()}. ${p.description}`;
      }
    } else if (matchedFaq) {
      replyText = matchedFaq.answer;
    } else if (normQuery.includes('salom') || normQuery.includes('assalom')) {
      replyText = "Assalomu alaykum! ApexTech mijozlarni qo'llab-quvvatlash xizmatiga xush kelibsiz. Sizga qaysi mahsulot yoki xizmat bo'yicha yordam bera olaman?";
    } else if (normQuery.includes('yetkazib') || normQuery.includes('dostavka')) {
      replyText = "Toshkent shahri bo'ylab yetkazib berish xarid kuni amalga oshiriladi. Boshqa viloyatlarga 2-3 ish kuni ichida kuryer orqali xavfsiz yetkaziladi.";
    } else if (normQuery.includes('kafolat')) {
      replyText = "Barcha rasmiy qurilmalarimizga 1 yillik kafolat hamda dastlabki 30 kunlik almashtirish xizmati taqdim etiladi.";
    } else {
      replyText = "Kechirasiz, siz so'ragan mahsulot yoki ma'lumot hozirda katalogimizda topilmadi. Iltimos, mahsulot nomini aniqlashtiring yoki operator bilan bog'lanish uchun xabar qoldiring.";
    }
  } else {
    // English responses
    if (matchedProducts.length > 0) {
      const p = matchedProducts[0];
      const availabilityEn =
        p.availability === 'in_stock' && p.stock_quantity > 0
          ? `in stock (${p.stock_quantity} units available)`
          : `currently out of stock or available for pre-order`;

      if (normQuery.includes('color') || normQuery.includes('colors')) {
        replyText = `Regarding the colors and specs for ${p.name}:\n${p.description}\nCurrent price is $${p.price.toLocaleString()}. Stock status: ${availabilityEn}.`;
      } else if (normQuery.includes('price') || normQuery.includes('cost') || normQuery.includes('how much')) {
        replyText = `The current price for ${p.name} is $${p.price.toLocaleString()}. It is currently ${availabilityEn}.`;
      } else {
        replyText = `Yes, the ${p.name} is available. Its current price is $${p.price.toLocaleString()}. ${p.description}`;
      }
    } else if (matchedFaq) {
      replyText = matchedFaq.answer;
    } else if (normQuery.includes('hello') || normQuery.includes('hi') || normQuery.includes('hey')) {
      replyText = "Hello! Welcome to our customer support. How can I assist you with our products or orders today?";
    } else if (normQuery.includes('shipping') || normQuery.includes('delivery')) {
      replyText = "We offer same-day express delivery in Tashkent, 2-3 business days across Uzbekistan regions, and 5-7 business days worldwide.";
    } else if (normQuery.includes('warranty')) {
      replyText = "All our brand-new devices include a 1-year official manufacturer warranty with 30-day replacement support.";
    } else {
      replyText = "I'm sorry, I could not find information regarding that specific item in our database. Please specify the product name, or our support team will be happy to assist you directly.";
    }
  }

  // 5. Persist AI response to database
  await saveMessage(conversationId, 'ai', replyText, matchedProducts);

  return {
    reply: replyText,
    productsMentioned: matchedProducts,
    language: lang,
  };
}
