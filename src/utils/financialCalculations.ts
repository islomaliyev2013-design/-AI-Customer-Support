import { FinancialRecord, FinancialSummary, DateFilterOption } from '../types';

/**
 * Filter records based on selected date range
 */
export function filterRecordsByDate(
  records: FinancialRecord[],
  filter: DateFilterOption,
  customStart?: string,
  customEnd?: string
): FinancialRecord[] {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  return records.filter((record) => {
    const recordDate = new Date(record.transaction_date);

    switch (filter) {
      case '7d': {
        const threshold = new Date(now);
        threshold.setDate(threshold.getDate() - 7);
        return recordDate >= startOfDay(threshold) && recordDate <= now;
      }
      case '30d': {
        const threshold = new Date(now);
        threshold.setDate(threshold.getDate() - 30);
        return recordDate >= startOfDay(threshold) && recordDate <= now;
      }
      case '90d': {
        const threshold = new Date(now);
        threshold.setDate(threshold.getDate() - 90);
        return recordDate >= startOfDay(threshold) && recordDate <= now;
      }
      case 'month': {
        return (
          recordDate.getFullYear() === now.getFullYear() &&
          recordDate.getMonth() === now.getMonth()
        );
      }
      case 'year': {
        return recordDate.getFullYear() === now.getFullYear();
      }
      case 'custom': {
        if (!customStart && !customEnd) return true;
        const start = customStart ? new Date(customStart) : new Date(0);
        const end = customEnd ? new Date(customEnd + 'T23:59:59') : new Date(8640000000000000);
        return recordDate >= start && recordDate <= end;
      }
      default:
        return true;
    }
  });
}

/**
 * Calculate comprehensive financial metrics with exact P&L logic
 */
export function calculateFinancialMetrics(
  records: FinancialRecord[],
  filter: DateFilterOption = '30d',
  currency: string = 'USD',
  customStart?: string,
  customEnd?: string
): FinancialSummary {
  // Only include transactions that match the selected currency or convert seamlessly
  const relevantRecords = filterRecordsByDate(
    records.filter((r) => !r.currency || r.currency === currency),
    filter,
    customStart,
    customEnd
  );

  let totalRevenue = 0;
  let totalExpenses = 0;

  const revenueCategoryMap: Record<string, number> = {};
  const expenseCategoryMap: Record<string, number> = {};
  const dateMap: Record<string, { revenue: number; expenses: number }> = {};
  const monthlyMap: Record<string, { revenue: number; expenses: number }> = {};

  // Current month stats for quick KPI
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  let monthlyRevenue = 0;
  let monthlyExpenses = 0;

  // Process all relevant records
  relevantRecords.forEach((record) => {
    const amount = Number(record.amount) || 0;
    const rDate = new Date(record.transaction_date);
    const dateKey = record.transaction_date.split('T')[0];
    const monthKey = `${rDate.getFullYear()}-${String(rDate.getMonth() + 1).padStart(2, '0')}`;

    if (!dateMap[dateKey]) {
      dateMap[dateKey] = { revenue: 0, expenses: 0 };
    }
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { revenue: 0, expenses: 0 };
    }

    if (record.type === 'revenue') {
      totalRevenue += amount;
      revenueCategoryMap[record.category] = (revenueCategoryMap[record.category] || 0) + amount;
      dateMap[dateKey].revenue += amount;
      monthlyMap[monthKey].revenue += amount;

      if (rDate.getFullYear() === currentYear && rDate.getMonth() === currentMonth) {
        monthlyRevenue += amount;
      }
    } else if (record.type === 'expense') {
      totalExpenses += amount;
      expenseCategoryMap[record.category] = (expenseCategoryMap[record.category] || 0) + amount;
      dateMap[dateKey].expenses += amount;
      monthlyMap[monthKey].expenses += amount;

      if (rDate.getFullYear() === currentYear && rDate.getMonth() === currentMonth) {
        monthlyExpenses += amount;
      }
    }
  });

  // Strict Profit and Loss Rules
  // Net Profit = Total Revenue - Total Expenses
  // If revenue > expenses -> positive profit, netLoss = 0
  // If expenses > revenue -> difference is net loss, netProfit = 0
  const diff = totalRevenue - totalExpenses;
  const netProfit = diff > 0 ? diff : 0;
  const netLoss = diff < 0 ? Math.abs(diff) : 0;
  const profitMargin = totalRevenue > 0 ? ((diff / totalRevenue) * 100) : 0;

  // Build sorted timeline data for line chart
  const sortedDates = Object.keys(dateMap).sort();
  const revenueExpenseTrend = sortedDates.map((date) => {
    const rev = dateMap[date].revenue;
    const exp = dateMap[date].expenses;
    return {
      date,
      revenue: rev,
      expenses: exp,
      profit: rev - exp,
    };
  });

  // Build sorted monthly data for bar chart
  const sortedMonths = Object.keys(monthlyMap).sort();
  const monthlyProfitLoss = sortedMonths.map((monthKey) => {
    const rev = monthlyMap[monthKey].revenue;
    const exp = monthlyMap[monthKey].expenses;
    const net = rev - exp;
    return {
      month: monthKey,
      profit: net > 0 ? net : 0,
      loss: net < 0 ? Math.abs(net) : 0,
      net,
    };
  });

  // Breakdown lists
  const revenueByCategory = Object.entries(revenueCategoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const expensesByCategory = Object.entries(expenseCategoryMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  return {
    totalRevenue,
    totalExpenses,
    netProfit,
    netLoss,
    profitMargin: Math.round(profitMargin * 10) / 10,
    monthlyRevenue,
    monthlyExpenses,
    currency,
    revenueExpenseTrend,
    monthlyProfitLoss,
    revenueByCategory,
    expensesByCategory,
  };
}

/**
 * Format currency with symbol and decimal precision
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  const symbolMap: Record<string, string> = {
    USD: '$',
    EUR: '€',
    UZS: "so'm",
  };

  const symbol = symbolMap[currency] || currency;

  if (currency === 'UZS') {
    return `${amount.toLocaleString('uz-UZ')} ${symbol}`;
  }

  return `${symbol}${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
