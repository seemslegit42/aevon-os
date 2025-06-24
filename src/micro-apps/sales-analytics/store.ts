
'use client';
import { create } from 'zustand';
import { getMonthlySales, getSalesTrend, type MonthlySales, type SalesTrend } from '@/services/sales-data.service';

interface SalesAnalyticsState {
  monthlySales: MonthlySales[] | null;
  salesTrend: SalesTrend[] | null;
  isLoading: boolean;
  error: string | null;
  actions: {
    fetchData: () => Promise<void>;
  };
}

export const useSalesAnalyticsStore = create<SalesAnalyticsState>((set) => ({
  monthlySales: null,
  salesTrend: null,
  isLoading: false,
  error: null,
  actions: {
    fetchData: async () => {
      set({ isLoading: true, error: null });
      try {
        const [monthly, trend] = await Promise.all([getMonthlySales(), getSalesTrend()]);
        set({
          monthlySales: monthly,
          salesTrend: trend,
          isLoading: false,
        });
      } catch (err: any) {
        console.error("Failed to fetch sales data:", err);
        set({
          error: "Could not load sales analytics.",
          isLoading: false,
          monthlySales: null,
          salesTrend: null,
        });
      }
    },
  },
}));
