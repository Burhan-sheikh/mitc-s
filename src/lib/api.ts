import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';
import type { CloudinaryUploadResult, AccountDeletionOptions } from '@/types';

/**
 * Cloud Functions API client
 */

// Image upload to Cloudinary
export async function uploadImageToCloudinary(
  base64: string,
  folder?: string
): Promise<CloudinaryUploadResult> {
  const uploadFn = httpsCallable<
    { base64: string; folder?: string },
    CloudinaryUploadResult
  >(functions, 'uploadImageToCloudinary');

  const result = await uploadFn({ base64, folder });
  return result.data;
}

// Delete image from Cloudinary
export async function deleteImageFromCloudinary(imageId: string): Promise<void> {
  const deleteFn = httpsCallable<{ imageId: string }, { success: boolean }>(
    functions,
    'deleteImageFromCloudinary'
  );

  await deleteFn({ imageId });
}

// Get Cloudinary configuration status
export async function getCloudinaryStatus(): Promise<{
  configured: boolean;
  cloudName: string | null;
}> {
  const statusFn = httpsCallable<
    void,
    { configured: boolean; cloudName: string | null }
  >(functions, 'getCloudinaryStatus');

  const result = await statusFn();
  return result.data;
}

// Increment product view count
export async function incrementProductView(productId: string): Promise<void> {
  const incrementFn = httpsCallable<{ productId: string }, { success: boolean }>(
    functions,
    'incrementProductView'
  );

  await incrementFn({ productId });
}

// Track visitor analytics
export async function trackVisitor(
  path: string,
  referrer?: string
): Promise<void> {
  const trackFn = httpsCallable<
    { path: string; referrer?: string },
    { success: boolean }
  >(functions, 'trackVisitor');

  await trackFn({ path, referrer }).catch(() => {
    // Silently fail - analytics shouldn't break UX
  });
}

// Update user's last seen timestamp
export async function updateLastSeen(): Promise<void> {
  const updateFn = httpsCallable<void, { success: boolean }>(
    functions,
    'updateLastSeen'
  );

  await updateFn().catch(() => {
    // Silently fail
  });
}

// Request account deletion
export async function requestAccountDeletion(
  options: AccountDeletionOptions
): Promise<{
  success: boolean;
  message: string;
  deletedData: boolean;
  deletedAuth: boolean;
}> {
  const deleteFn = httpsCallable<
    AccountDeletionOptions,
    {
      success: boolean;
      message: string;
      deletedData: boolean;
      deletedAuth: boolean;
    }
  >(functions, 'requestAccountDeletion');

  const result = await deleteFn(options);
  return result.data;
}

// Admin: Delete user account
export async function adminDeleteUser(userId: string): Promise<void> {
  const deleteFn = httpsCallable<{ userId: string }, { success: boolean; message: string }>(
    functions,
    'adminDeleteUser'
  );

  await deleteFn({ userId });
}

// Admin: Change user role
export async function changeUserRole(
  userId: string,
  newRole: 'guest' | 'user' | 'admin'
): Promise<void> {
  const changeRoleFn = httpsCallable<
    { userId: string; newRole: string },
    { success: boolean; message: string }
  >(functions, 'changeUserRole');

  await changeRoleFn({ userId, newRole });
}