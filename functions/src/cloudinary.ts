import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { v2 as cloudinary } from 'cloudinary';

const db = admin.firestore();

// Configure Cloudinary from Firebase config
cloudinary.config({
  cloud_name: functions.config().cloudinary?.name,
  api_key: functions.config().cloudinary?.key,
  api_secret: functions.config().cloudinary?.secret
});

// Helper function to check if user is admin
async function isAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await db.collection('users').doc(uid).get();
    return userDoc.exists && userDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Upload image to Cloudinary
export const uploadImageToCloudinary = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check admin role
  const adminStatus = await isAdmin(context.auth.uid);
  if (!adminStatus) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can upload images');
  }

  // Validate input
  const { base64, folder = 'mitc/products' } = data;
  if (!base64 || typeof base64 !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid image data provided');
  }

  // Check if Cloudinary is configured
  if (!functions.config().cloudinary?.name) {
    throw new functions.https.HttpsError('failed-precondition', 'Cloudinary is not configured');
  }

  try {
    // Upload to Cloudinary with optimizations
    const uploadResult = await cloudinary.uploader.upload(base64, {
      folder: folder,
      transformation: [
        { quality: 'auto:eco' },
        { fetch_format: 'auto' }
      ],
      resource_type: 'auto'
    });

    // Save image metadata to Firestore
    const imageDoc = await db.collection('images').add({
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      provider: 'cloudinary',
      uploaderId: context.auth.uid,
      sizeBytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
      format: uploadResult.format,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Image uploaded successfully: ${imageDoc.id}`);

    return {
      success: true,
      id: imageDoc.id,
      url: uploadResult.secure_url,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes
    };
  } catch (error: any) {
    console.error('Error uploading to Cloudinary:', error);
    throw new functions.https.HttpsError('internal', `Failed to upload image: ${error.message}`);
  }
});

// Delete image from Cloudinary
export const deleteImageFromCloudinary = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check admin role
  const adminStatus = await isAdmin(context.auth.uid);
  if (!adminStatus) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can delete images');
  }

  const { imageId } = data;
  if (!imageId) {
    throw new functions.https.HttpsError('invalid-argument', 'Image ID is required');
  }

  try {
    // Get image metadata
    const imageDoc = await db.collection('images').doc(imageId).get();
    if (!imageDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Image not found');
    }

    const imageData = imageDoc.data();
    if (imageData?.provider === 'cloudinary' && imageData?.publicId) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(imageData.publicId);
    }

    // Delete Firestore document
    await imageDoc.ref.delete();

    console.log(`Image deleted successfully: ${imageId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting image:', error);
    throw new functions.https.HttpsError('internal', `Failed to delete image: ${error.message}`);
  }
});

// Get Cloudinary configuration status (for admin UI)
export const getCloudinaryStatus = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check admin role
  const adminStatus = await isAdmin(context.auth.uid);
  if (!adminStatus) {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can check Cloudinary status');
  }

  const configured = !!(functions.config().cloudinary?.name && 
                        functions.config().cloudinary?.key && 
                        functions.config().cloudinary?.secret);

  return {
    configured,
    cloudName: functions.config().cloudinary?.name || null
  };
});