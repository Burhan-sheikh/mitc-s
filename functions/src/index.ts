import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// Export all function modules
export * from './auth';
export * from './cloudinary';
export * from './cleanup';

// Example: Increment product view count
export const incrementProductView = functions.https.onCall(async (data, context) => {
  const { productId } = data;
  
  if (!productId) {
    throw new functions.https.HttpsError('invalid-argument', 'Product ID is required');
  }

  try {
    const db = admin.firestore();
    const productRef = db.collection('products').doc(productId);
    
    await productRef.update({
      views: admin.firestore.FieldValue.increment(1),
      lastViewed: admin.firestore.FieldValue.serverTimestamp()
    });

    // Log visitor if authenticated
    if (context.auth) {
      const today = new Date().toISOString().split('T')[0];
      await db.collection('visitors').doc(today).collection('views').add({
        userId: context.auth.uid,
        productId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        userAgent: context.rawRequest.headers['user-agent'] || 'unknown'
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error incrementing product view:', error);
    throw new functions.https.HttpsError('internal', 'Failed to increment view count');
  }
});

// Track visitor analytics (called from client)
export const trackVisitor = functions.https.onCall(async (data, context) => {
  const { path, referrer } = data;
  
  try {
    const db = admin.firestore();
    const today = new Date().toISOString().split('T')[0];
    
    await db.collection('visitors').doc(today).collection('visits').add({
      userId: context.auth?.uid || null,
      path: path || '/',
      referrer: referrer || null,
      userAgent: context.rawRequest.headers['user-agent'] || 'unknown',
      ip: context.rawRequest.ip,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking visitor:', error);
    // Don't throw - analytics failures shouldn't break user experience
    return { success: false, error: 'Failed to track visit' };
  }
});