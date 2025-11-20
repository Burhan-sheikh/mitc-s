import type { Timestamp } from './index';

/**
 * User and role type definitions
 */

export type UserRole = 'guest' | 'user' | 'admin';

export interface User {
  uid: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  likedProducts: string[];
  createdAt: Timestamp;
  lastSeen: Timestamp;
  photoURL?: string;
  displayName?: string;
}

export interface UserProfile extends Omit<User, 'uid'> {
  // Additional profile fields if needed
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}