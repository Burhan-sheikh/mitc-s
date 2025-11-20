import type { Timestamp } from './index';

/**
 * Analytics type definitions
 */

export interface VisitorData {
  userId: string | null;
  path: string;
  referrer?: string;
  userAgent: string;
  ip?: string;
  timestamp: Timestamp;
}

export interface ProductView {
  userId: string;
  productId: string;
  timestamp: Timestamp;
  userAgent: string;
}

export interface AnalyticsSummary {
  totalProducts: number;
  totalUsers: number;
  totalReviews: number;
  totalChats: number;
  activeChats: number;
  lowStockCount: number;
  topViewedProducts: Array<{
    productId: string;
    title: string;
    views: number;
  }>;
  popularBrands: Array<{
    brand: string;
    count: number;
  }>;
}