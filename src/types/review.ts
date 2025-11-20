import type { Timestamp } from './index';

/**
 * Review type definitions
 */

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  createdAt: Timestamp;
  approved: boolean;
}

export type ReviewFormData = Pick<Review, 'text' | 'rating'>;