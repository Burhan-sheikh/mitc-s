import type { Timestamp } from './index';

/**
 * Lead and contact form type definitions
 */

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Timestamp;
  tags?: string[];
  status?: 'new' | 'contacted' | 'converted' | 'closed';
}

export type LeadFormData = Omit<Lead, 'id' | 'createdAt' | 'status'>;