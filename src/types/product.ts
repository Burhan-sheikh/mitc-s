import type { Timestamp } from './index';

/**
 * Product type definitions
 */

export interface ProductSpecs {
  ram?: string;
  storage?: string;
  processor?: string;
  gpu?: string;
  color?: string;
  generation?: string;
  model?: string;
  [key: string]: string | undefined; // Allow dynamic specs
}

export interface PriceRange {
  low: number;
  high: number;
}

export interface Product {
  id: string;
  title: string;
  brand: string;
  shortDescription?: string;
  specs: ProductSpecs;
  priceRange: PriceRange;
  stock: number;
  bulkAvailable: boolean;
  bulkETA?: string;
  featuredImage: {
    url: string;
    uploaderId?: string;
    uploadedAt?: Timestamp;
  };
  gallery: Array<{
    url: string;
    alt?: string;
    uploaderId?: string;
    uploadedAt?: Timestamp;
  }>;
  status: 'published' | 'draft';
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  views: number;
}

export type ProductFormData = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'views'>;

export interface ProductFilters {
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  status?: 'published' | 'draft';
  search?: string;
}