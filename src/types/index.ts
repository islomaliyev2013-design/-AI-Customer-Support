export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
}

export interface Business {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  category: string;
  contact_email: string;
  phone?: string;
  website?: string;
  currency: 'USD' | 'UZS' | 'EUR';
  created_at: string;
  updated_at: string;
}

export type ProductAvailability = 'in_stock' | 'out_of_stock' | 'pre_order';

export interface Product {
  id: string;
  business_id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image_url: string;
  category: string;
  stock_quantity: number;
  availability: ProductAvailability;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  business_id: string;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  business_id: string;
  customer_identifier: string;
  name?: string;
  email?: string;
  phone?: string;
  conversations_count: number;
  last_interaction: string;
  created_at: string;
}

export type ConversationStatus = 'active' | 'resolved' | 'needs_attention';

export interface Conversation {
  id: string;
  business_id: string;
  customer_id: string;
  customer_identifier: string;
  customer_name?: string;
  last_message_preview?: string;
  status: ConversationStatus;
  has_unanswered: boolean;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender: 'customer' | 'ai' | 'admin';
  text: string;
  products_mentioned?: Product[];
  created_at: string;
}

export type TransactionType = 'revenue' | 'expense';

export interface FinancialRecord {
  id: string;
  business_id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  category: string;
  description: string;
  transaction_date: string;
  created_at: string;
  updated_at: string;
}

export type DateFilterOption = '7d' | '30d' | '90d' | 'month' | 'year' | 'custom';

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  netLoss: number;
  profitMargin: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  currency: string;
  revenueExpenseTrend: {
    date: string;
    revenue: number;
    expenses: number;
    profit: number;
  }[];
  monthlyProfitLoss: {
    month: string;
    profit: number;
    loss: number;
    net: number;
  }[];
  revenueByCategory: {
    name: string;
    value: number;
  }[];
  expensesByCategory: {
    name: string;
    value: number;
  }[];
}

export interface DashboardStats {
  totalProducts: number;
  availableProducts: number;
  totalCustomers: number;
  totalConversations: number;
  totalMessages: number;
  unansweredQuestions: number;
}
