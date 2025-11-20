/**
 * Core type definitions for MITC Store
 */

export * from './product';
export * from './user';
export * from './chat';
export * from './review';
export * from './lead';
export * from './analytics';

// Cloudinary types
export interface CloudinaryUploadResult {
  success: boolean;
  id: string;
  url: string;
  width: number;
  height: number;
  bytes: number;
}

// Account deletion options
export interface AccountDeletionOptions {
  deleteAllData?: boolean;
  deleteAuthUser?: boolean;
}

// Common image type
export interface ImageData {
  url: string;
  alt?: string;
  uploaderId?: string;
  uploadedAt?: Date | any;
}

// Firebase timestamp type
export type Timestamp = {
  seconds: number;
  nanoseconds: number;
} | Date | null;