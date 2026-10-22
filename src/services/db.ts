import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  Business,
  Product,
  FAQ,
  Customer,
  Conversation,
  Message,
  FinancialRecord,
  DashboardStats,
} from '../types';

// Initial seed data for seamless immediate demo / offline fallback
const SEED_BUSINESS: Business = {
  id: 'biz-001',
  owner_id: 'user-001',
  name: 'ApexTech Solutions',
  slug: 'apex-tech',
  logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
  description: 'Next-generation premier electronics, AI gadgets, and customer technology solutions.',
  category: 'Electronics & Software',
  contact_email: 'support@apextech.io',
  phone: '+998 71 200 4488',
  website: 'https://apextech.io',
  currency: 'USD',
  created_at: new Date('2026-01-15').toISOString(),
  updated_at: new Date().toISOString(),
};

const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    business_id: 'biz-001',
    name: 'iPhone 17',
    description: 'Flagship Apple smartphone featuring A19 Pro chip, ultra-retina OLED, and revolutionary AI camera system. Available in Deep Space Purple, Midnight Black, and Titanium Silver.',
    price: 999,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600&auto=format&fit=crop&q=80',
    category: 'Smartphones',
    stock_quantity: 45,
    availability: 'in_stock',
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-002',
    business_id: 'biz-001',
    name: 'iPhone 17 Pro Max',
    description: 'The pinnacle of smartphone innovation. Grade 5 titanium frame, 5x telephoto camera, and 2TB ultra-fast storage option. Colors: Cosmic Violet and Natural Titanium.',
    price: 1299,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&auto=format&fit=crop&q=80',
    category: 'Smartphones',
    stock_quantity: 28,
    availability: 'in_stock',
    created_at: new Date('2026-02-05').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-003',
    business_id: 'biz-001',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Active Noise Cancellation with Adaptive Audio, Personalized Spatial Audio with dynamic head tracking, and USB-C MagSafe Charging Case.',
    price: 249,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=600&auto=format&fit=crop&q=80',
    category: 'Audio',
    stock_quantity: 80,
    availability: 'in_stock',
    created_at: new Date('2026-02-10').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-004',
    business_id: 'biz-001',
    name: 'MacBook Pro 16" M4 Max',
    description: 'Extreme computing powerhouse for developers and creators. 64GB Unified Memory, 1TB SSD, Liquid Retina XDR display with 1600 nits peak brightness.',
    price: 3499,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    category: 'Computers',
    stock_quantity: 14,
    availability: 'in_stock',
    created_at: new Date('2026-02-15').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-005',
    business_id: 'biz-001',
    name: 'MagSafe Duo Wireless Charger',
    description: 'Conveniently fast charge your compatible iPhone, Apple Watch, Wireless Charging Case for AirPods, and other Qi-certified devices.',
    price: 129,
    currency: 'USD',
    image_url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80',
    category: 'Accessories',
    stock_quantity: 110,
    availability: 'in_stock',
    created_at: new Date('2026-02-20').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_FAQS: FAQ[] = [
  {
    id: 'faq-001',
    business_id: 'biz-001',
    question: 'Do you have the iPhone 17 in stock and what are the colors?',
    answer: 'Yes! The iPhone 17 is currently available in stock starting at $999. Available colors are Deep Space Purple, Midnight Black, and Titanium Silver with 128GB, 256GB, and 512GB storage.',
    category: 'Products',
    is_active: true,
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-002',
    business_id: 'biz-001',
    question: 'iPhone 17 bormi va qanday ranglari bor?',
    answer: "Ha, iPhone 17 do'konimizda mavjud! Narxi $999 dan boshlanadi. Ranglar: Deep Space Purple (to'q binafsharang), Midnight Black (qora) va Titanium Silver (kumush). Kafolat 1 yil rasmiy.",
    category: 'Products',
    is_active: true,
    created_at: new Date('2026-02-01').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-003',
    business_id: 'biz-001',
    question: 'What is your warranty policy?',
    answer: 'All brand new electronics purchased through ApexTech come with a 1-year official manufacturer warranty along with 30-day replacement support for manufacturing defects.',
    category: 'Warranty',
    is_active: true,
    created_at: new Date('2026-02-02').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-004',
    business_id: 'biz-001',
    question: 'Yetkazib berish xizmati qancha vaqt oladi?',
    answer: "Toshkent shahri bo'ylab xarid qilingan kuni (express yetkazish), O'zbekiston viloyatlari bo'ylab esa 2-3 ish kuni ichida kuryer orqali xavfsiz yetkazib beriladi.",
    category: 'Shipping',
    is_active: true,
    created_at: new Date('2026-02-02').toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'faq-005',
    business_id: 'biz-001',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, Apple Pay, UzCard, Humo, Click, Payme, and direct wire transfer for business orders.',
    category: 'Payment',
    is_active: true,
    created_at: new Date('2026-02-03').toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const SEED_FINANCIAL_RECORDS: FinancialRecord[] = [
  {
    id: 'fin-001',
    business_id: 'biz-001',
    type: 'revenue',
    amount: 14985,
    currency: 'USD',
    category: 'Hardware Sales',
    description: 'Bulk iPhone 17 and Pro Max corporate order delivery',
    transaction_date: '2026-10-18',
    created_at: new Date('2026-10-18T10:00:00Z').toISOString(),
    updated_at: new Date('2026-10-18T10:00:00Z').toISOString(),
  },
  {
    id: 'fin-002',
    business_id: 'biz-001',
    type: 'revenue',
    amount: 8740,
    currency: 'USD',
    category: 'Online Store Orders',
    description: 'E-commerce weekend sales retail transactions',
    transaction_date: '2026-10-19',
    created_at: new Date('2026-10-19T14:30:00Z').toISOString(),
    updated_at: new Date('2026-10-19T14:30:00Z').toISOString(),
  },
  {
    id: 'fin-003',
    business_id: 'biz-001',
    type: 'expense',
    amount: 4200,
    currency: 'USD',
    category: 'Inventory Restocking',
    description: 'AirPods Pro & MagSafe accessories wholesale replenishment',
    transaction_date: '2026-10-20',
    created_at: new Date('2026-10-20T09:15:00Z').toISOString(),
    updated_at: new Date('2026-10-20T09:15:00Z').toISOString(),
  },
  {
    id: 'fin-004',
    business_id: 'biz-001',
    type: 'revenue',
    amount: 11950,
    currency: 'USD',
    category: 'Hardware Sales',
    description: 'MacBook Pro 16" M4 workstations for software agency',
    transaction_date: '2026-10-21',
    created_at: new Date('2026-10-21T11:45:00Z').toISOString(),
    updated_at: new Date('2026-10-21T11:45:00Z').toISOString(),
  },
  {
    id: 'fin-005',
    business_id: 'biz-001',
    type: 'expense',
    amount: 1850,
    currency: 'USD',
    category: 'Cloud Infrastructure & AI APIs',
    description: 'Monthly cloud hosting, Supabase Edge cluster and AI token computing',
    transaction_date: '2026-10-21',
    created_at: new Date('2026-10-21T16:00:00Z').toISOString(),
    updated_at: new Date('2026-10-21T16:00:00Z').toISOString(),
  },
  {
    id: 'fin-006',
    business_id: 'biz-001',
    type: 'revenue',
    amount: 6890,
    currency: 'USD',
    category: 'Support Contracts',
    description: 'Annual enterprise customer care SLA renewal',
    transaction_date: '2026-10-22',
    created_at: new Date('2026-10-22T08:20:00Z').toISOString(),
    updated_at: new Date('2026-10-22T08:20:00Z').toISOString(),
  },
  {
    id: 'fin-007',
    business_id: 'biz-001',
    type: 'expense',
    amount: 980,
    currency: 'USD',
    category: 'Logistics & Courier',
    description: 'Express customer delivery courier logistics fee',
    transaction_date: '2026-10-22',
    created_at: new Date('2026-10-22T12:00:00Z').toISOString(),
    updated_at: new Date('2026-10-22T12:00:00Z').toISOString(),
  },
];

const SEED_CUSTOMERS: Customer[] = [
  {
    id: 'cust-001',
    business_id: 'biz-001',
    customer_identifier: 'cust_8829',
    name: 'Jasur Aliyev',
    email: 'jasur.aliyev@gmail.com',
    phone: '+998 90 123 4567',
    conversations_count: 3,
    last_interaction: new Date('2026-10-22T08:45:00Z').toISOString(),
    created_at: new Date('2026-09-10').toISOString(),
  },
  {
    id: 'cust-002',
    business_id: 'biz-001',
    customer_identifier: 'cust_9104',
    name: 'Elena Rostova',
    email: 'elena.rostova@techmail.io',
    phone: '+998 93 555 1290',
    conversations_count: 2,
    last_interaction: new Date('2026-10-21T18:30:00Z').toISOString(),
    created_at: new Date('2026-09-22').toISOString(),
  },
  {
    id: 'cust-003',
    business_id: 'biz-001',
    customer_identifier: 'cust_7421',
    name: 'Bobur Rakhimov',
    email: 'bobur.r@fintech.uz',
    phone: '+998 99 876 5432',
    conversations_count: 1,
    last_interaction: new Date('2026-10-21T14:15:00Z').toISOString(),
    created_at: new Date('2026-10-05').toISOString(),
  },
];

const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-001',
    business_id: 'biz-001',
    customer_id: 'cust-001',
    customer_identifier: 'cust_8829',
    customer_name: 'Jasur Aliyev',
    last_message_preview: 'iPhone 17 ning Deep Space Purple rangi bormi va yetkazib berish qancha vaqt oladi?',
    status: 'active',
    has_unanswered: false,
    message_count: 4,
    created_at: new Date('2026-10-22T08:30:00Z').toISOString(),
    updated_at: new Date('2026-10-22T08:45:00Z').toISOString(),
  },
  {
    id: 'conv-002',
    business_id: 'biz-001',
    customer_id: 'cust-002',
    customer_identifier: 'cust_9104',
    customer_name: 'Elena Rostova',
    last_message_preview: 'Does the MacBook Pro 16" come with pre-installed developer tools?',
    status: 'needs_attention',
    has_unanswered: true,
    message_count: 3,
    created_at: new Date('2026-10-21T18:15:00Z').toISOString(),
    updated_at: new Date('2026-10-21T18:30:00Z').toISOString(),
  },
  {
    id: 'conv-003',
    business_id: 'biz-001',
    customer_id: 'cust-003',
    customer_identifier: 'cust_7421',
    customer_name: 'Bobur Rakhimov',
    last_message_preview: 'Order #8829 has been delivered safely. Thank you for the quick support!',
    status: 'resolved',
    has_unanswered: false,
    message_count: 6,
    created_at: new Date('2026-10-21T12:00:00Z').toISOString(),
    updated_at: new Date('2026-10-21T14:15:00Z').toISOString(),
  },
];

const SEED_MESSAGES: Record<string, Message[]> = {
  'conv-001': [
    {
      id: 'msg-001',
      conversation_id: 'conv-001',
      sender: 'customer',
      text: 'Assalomu alaykum! Sizda iPhone 17 bormi?',
      created_at: new Date('2026-10-22T08:30:00Z').toISOString(),
    },
    {
      id: 'msg-002',
      conversation_id: 'conv-001',
      sender: 'ai',
      text: "Va alaykum assalom! Ha, bizda yangi iPhone 17 mavjud. Uning narxi $999. Qora, Deep Space Purple va Titanium Silver ranglari omborda bor.",
      products_mentioned: [SEED_PRODUCTS[0]],
      created_at: new Date('2026-10-22T08:31:00Z').toISOString(),
    },
    {
      id: 'msg-003',
      conversation_id: 'conv-001',
      sender: 'customer',
      text: "iPhone 17 ning Deep Space Purple rangi bormi va yetkazib berish qancha vaqt oladi?",
      created_at: new Date('2026-10-22T08:44:00Z').toISOString(),
    },
    {
      id: 'msg-004',
      conversation_id: 'conv-001',
      sender: 'ai',
      text: "Ha, Deep Space Purple rangi omborimizda mavjud! Toshkent bo'ylab bugunning o'zida yetkazib beramiz. Viloyatlarga esa 2-3 ish kunida yetib boradi.",
      products_mentioned: [SEED_PRODUCTS[0]],
      created_at: new Date('2026-10-22T08:45:00Z').toISOString(),
    },
  ],
  'conv-002': [
    {
      id: 'msg-005',
      conversation_id: 'conv-002',
      sender: 'customer',
      text: 'Hello, I am looking at the MacBook Pro 16" M4 Max. Is it currently in stock?',
      created_at: new Date('2026-10-21T18:15:00Z').toISOString(),
    },
    {
      id: 'msg-006',
      conversation_id: 'conv-002',
      sender: 'ai',
      text: 'Hello Elena! Yes, the MacBook Pro 16" M4 Max is in stock ($3,499) with 64GB Unified Memory and 1TB SSD.',
      products_mentioned: [SEED_PRODUCTS[3]],
      created_at: new Date('2026-10-21T18:16:00Z').toISOString(),
    },
    {
      id: 'msg-007',
      conversation_id: 'conv-002',
      sender: 'customer',
      text: 'Does the MacBook Pro 16" come with pre-installed developer tools?',
      created_at: new Date('2026-10-21T18:30:00Z').toISOString(),
    },
  ],
  'conv-003': [
    {
      id: 'msg-008',
      conversation_id: 'conv-003',
      sender: 'customer',
      text: 'Do you offer warranty on AirPods Pro?',
      created_at: new Date('2026-10-21T12:00:00Z').toISOString(),
    },
    {
      id: 'msg-009',
      conversation_id: 'conv-003',
      sender: 'ai',
      text: 'Yes! All Apple devices, including AirPods Pro (2nd Gen - $249), come with 1-year official manufacturer warranty and 30-day replacement support.',
      products_mentioned: [SEED_PRODUCTS[2]],
      created_at: new Date('2026-10-21T12:01:00Z').toISOString(),
    },
  ],
};

// Local storage keys
const STORAGE_KEYS = {
  BUSINESS: 'nexus_business',
  PRODUCTS: 'nexus_products',
  FAQS: 'nexus_faqs',
  FINANCIAL: 'nexus_financial',
  CUSTOMERS: 'nexus_customers',
  CONVERSATIONS: 'nexus_conversations',
  MESSAGES: 'nexus_messages',
};

// Safe local retrieval helper
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
      return defaultValue;
    }
    return JSON.parse(saved);
  } catch {
    return defaultValue;
  }
}

function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

/* ========================================================
   BUSINESS SERVICES
   ======================================================== */
export async function getBusinessBySlug(slug: string): Promise<Business | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as Business;
    } catch {
      // Fallback
    }
  }

  const stored = getLocalItem<Business>(STORAGE_KEYS.BUSINESS, SEED_BUSINESS);
  return stored.slug === slug ? stored : (stored || SEED_BUSINESS);
}

export async function getCurrentBusiness(ownerId?: string): Promise<Business> {
  if (isSupabaseConfigured && ownerId) {
    try {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!error && data) return data as Business;
    } catch {
      // Fallback
    }
  }

  return getLocalItem<Business>(STORAGE_KEYS.BUSINESS, SEED_BUSINESS);
}

export async function saveBusiness(business: Partial<Business>): Promise<Business> {
  const current = getLocalItem<Business>(STORAGE_KEYS.BUSINESS, SEED_BUSINESS);
  const updated: Business = {
    ...current,
    ...business,
    updated_at: new Date().toISOString(),
  };

  setLocalItem(STORAGE_KEYS.BUSINESS, updated);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('businesses').upsert(updated);
    } catch (err) {
      console.warn('Supabase business save error:', err);
    }
  }

  return updated;
}

/* ========================================================
   PRODUCT SERVICES
   ======================================================== */
export async function getProducts(businessId: string): Promise<Product[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Product[];
    } catch {
      // Fallback
    }
  }

  return getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
  const newProduct: Product = {
    ...product,
    id: 'prod-' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  const updatedList = [newProduct, ...list];
  setLocalItem(STORAGE_KEYS.PRODUCTS, updatedList);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('products').insert(newProduct);
    } catch (err) {
      console.warn('Supabase product insert error:', err);
    }
  }

  return newProduct;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) throw new Error('Product not found');

  const updated: Product = {
    ...list[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  list[index] = updated;
  setLocalItem(STORAGE_KEYS.PRODUCTS, list);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('products').update(updated).eq('id', id);
    } catch (err) {
      console.warn('Supabase product update error:', err);
    }
  }

  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  const list = getLocalItem<Product[]>(STORAGE_KEYS.PRODUCTS, SEED_PRODUCTS);
  const filtered = list.filter((p) => p.id !== id);
  setLocalItem(STORAGE_KEYS.PRODUCTS, filtered);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase product delete error:', err);
    }
  }
}

/* ========================================================
   FAQ SERVICES
   ======================================================== */
export async function getFaqs(businessId: string): Promise<FAQ[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data as FAQ[];
    } catch {
      // Fallback
    }
  }

  return getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, SEED_FAQS);
}

export async function createFaq(faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at'>): Promise<FAQ> {
  const newFaq: FAQ = {
    ...faq,
    id: 'faq-' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const list = getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, SEED_FAQS);
  const updatedList = [newFaq, ...list];
  setLocalItem(STORAGE_KEYS.FAQS, updatedList);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('faqs').insert(newFaq);
    } catch (err) {
      console.warn('Supabase faq insert error:', err);
    }
  }

  return newFaq;
}

export async function updateFaq(id: string, updates: Partial<FAQ>): Promise<FAQ> {
  const list = getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, SEED_FAQS);
  const index = list.findIndex((f) => f.id === id);
  if (index === -1) throw new Error('FAQ not found');

  const updated: FAQ = {
    ...list[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  list[index] = updated;
  setLocalItem(STORAGE_KEYS.FAQS, list);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('faqs').update(updated).eq('id', id);
    } catch (err) {
      console.warn('Supabase faq update error:', err);
    }
  }

  return updated;
}

export async function deleteFaq(id: string): Promise<void> {
  const list = getLocalItem<FAQ[]>(STORAGE_KEYS.FAQS, SEED_FAQS);
  const filtered = list.filter((f) => f.id !== id);
  setLocalItem(STORAGE_KEYS.FAQS, filtered);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('faqs').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase faq delete error:', err);
    }
  }
}

/* ========================================================
   FINANCIAL RECORDS SERVICES
   ======================================================== */
export async function getFinancialRecords(businessId: string): Promise<FinancialRecord[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('financial_records')
        .select('*')
        .eq('business_id', businessId)
        .order('transaction_date', { ascending: false });
      if (!error && data && data.length > 0) return data as FinancialRecord[];
    } catch {
      // Fallback
    }
  }

  return getLocalItem<FinancialRecord[]>(STORAGE_KEYS.FINANCIAL, SEED_FINANCIAL_RECORDS);
}

export async function createFinancialRecord(
  record: Omit<FinancialRecord, 'id' | 'created_at' | 'updated_at'>
): Promise<FinancialRecord> {
  const newRecord: FinancialRecord = {
    ...record,
    amount: Number(record.amount),
    id: 'fin-' + Date.now(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const list = getLocalItem<FinancialRecord[]>(STORAGE_KEYS.FINANCIAL, SEED_FINANCIAL_RECORDS);
  const updatedList = [newRecord, ...list];
  setLocalItem(STORAGE_KEYS.FINANCIAL, updatedList);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('financial_records').insert(newRecord);
    } catch (err) {
      console.warn('Supabase financial insert error:', err);
    }
  }

  return newRecord;
}

export async function updateFinancialRecord(
  id: string,
  updates: Partial<FinancialRecord>
): Promise<FinancialRecord> {
  const list = getLocalItem<FinancialRecord[]>(STORAGE_KEYS.FINANCIAL, SEED_FINANCIAL_RECORDS);
  const index = list.findIndex((r) => r.id === id);
  if (index === -1) throw new Error('Record not found');

  const updated: FinancialRecord = {
    ...list[index],
    ...updates,
    amount: updates.amount !== undefined ? Number(updates.amount) : list[index].amount,
    updated_at: new Date().toISOString(),
  };

  list[index] = updated;
  setLocalItem(STORAGE_KEYS.FINANCIAL, list);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('financial_records').update(updated).eq('id', id);
    } catch (err) {
      console.warn('Supabase financial update error:', err);
    }
  }

  return updated;
}

export async function deleteFinancialRecord(id: string): Promise<void> {
  const list = getLocalItem<FinancialRecord[]>(STORAGE_KEYS.FINANCIAL, SEED_FINANCIAL_RECORDS);
  const filtered = list.filter((r) => r.id !== id);
  setLocalItem(STORAGE_KEYS.FINANCIAL, filtered);

  if (isSupabaseConfigured) {
    try {
      await supabase.from('financial_records').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase financial delete error:', err);
    }
  }
}

/* ========================================================
   CUSTOMERS & CONVERSATIONS
   ======================================================== */
export async function getCustomers(businessId: string): Promise<Customer[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('business_id', businessId)
        .order('last_interaction', { ascending: false });
      if (!error && data && data.length > 0) return data as Customer[];
    } catch {
      // Fallback
    }
  }

  return getLocalItem<Customer[]>(STORAGE_KEYS.CUSTOMERS, SEED_CUSTOMERS);
}

export async function getConversations(businessId: string): Promise<Conversation[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('business_id', businessId)
        .order('updated_at', { ascending: false });
      if (!error && data && data.length > 0) return data as Conversation[];
    } catch {
      // Fallback
    }
  }

  return getLocalItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
}

export async function getConversationById(id: string): Promise<Conversation | null> {
  const list = getLocalItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  return list.find((c) => c.id === id) || null;
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const messagesMap = getLocalItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  return messagesMap[conversationId] || [];
}

export async function saveMessage(
  conversationId: string,
  sender: 'customer' | 'ai' | 'admin',
  text: string,
  productsMentioned?: Product[]
): Promise<Message> {
  const newMessage: Message = {
    id: 'msg-' + Date.now() + Math.random().toString(36).substring(2, 5),
    conversation_id: conversationId,
    sender,
    text,
    products_mentioned: productsMentioned,
    created_at: new Date().toISOString(),
  };

  const messagesMap = getLocalItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, SEED_MESSAGES);
  const currentMsgs = messagesMap[conversationId] || [];
  messagesMap[conversationId] = [...currentMsgs, newMessage];
  setLocalItem(STORAGE_KEYS.MESSAGES, messagesMap);

  // Update conversation record
  const conversations = getLocalItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  const convIndex = conversations.findIndex((c) => c.id === conversationId);
  if (convIndex !== -1) {
    conversations[convIndex].last_message_preview = text;
    conversations[convIndex].message_count = (conversations[convIndex].message_count || 0) + 1;
    conversations[convIndex].updated_at = new Date().toISOString();
    if (sender === 'customer') {
      conversations[convIndex].has_unanswered = true;
    } else {
      conversations[convIndex].has_unanswered = false;
    }
    setLocalItem(STORAGE_KEYS.CONVERSATIONS, conversations);
  }

  return newMessage;
}

export async function startNewConversation(
  businessId: string,
  customerIdentifier: string,
  customerName?: string
): Promise<Conversation> {
  const newConv: Conversation = {
    id: 'conv-' + Date.now(),
    business_id: businessId,
    customer_id: 'cust-' + customerIdentifier,
    customer_identifier: customerIdentifier,
    customer_name: customerName || 'Guest User',
    last_message_preview: 'Started a new conversation',
    status: 'active',
    has_unanswered: false,
    message_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const conversations = getLocalItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  const updatedConvs = [newConv, ...conversations];
  setLocalItem(STORAGE_KEYS.CONVERSATIONS, updatedConvs);

  return newConv;
}

export async function resolveConversation(conversationId: string): Promise<void> {
  const conversations = getLocalItem<Conversation[]>(STORAGE_KEYS.CONVERSATIONS, SEED_CONVERSATIONS);
  const conv = conversations.find((c) => c.id === conversationId);
  if (conv) {
    conv.status = 'resolved';
    conv.has_unanswered = false;
    conv.updated_at = new Date().toISOString();
    setLocalItem(STORAGE_KEYS.CONVERSATIONS, conversations);
  }
}

/* ========================================================
   DASHBOARD STATS AGGREGATOR
   ======================================================== */
export async function getDashboardStats(businessId: string): Promise<DashboardStats> {
  const products = await getProducts(businessId);
  const customers = await getCustomers(businessId);
  const conversations = await getConversations(businessId);

  const availableProducts = products.filter(
    (p) => p.availability === 'in_stock' && p.stock_quantity > 0
  ).length;

  const totalMessages = conversations.reduce((acc, c) => acc + (c.message_count || 0), 0);
  const unansweredQuestions = conversations.filter(
    (c) => c.has_unanswered && c.status !== 'resolved'
  ).length;

  return {
    totalProducts: products.length,
    availableProducts,
    totalCustomers: customers.length,
    totalConversations: conversations.length,
    totalMessages,
    unansweredQuestions,
  };
}
