import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const rtdb = admin.database();

// Auth onCreate trigger - create user document
export const onUserCreate = functions.auth.user().onCreate(async (user) => {
  try {
    // Create user document with default role
    await db.collection('users').doc(user.uid).set({
      name: user.displayName || 'User',
      email: user.email || '',
      phone: user.phoneNumber || '',
      role: 'user', // default role
      likedProducts: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastSeen: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`Created user document for ${user.uid}`);
  } catch (error) {
    console.error('Error creating user document:', error);
  }
});

// Auth onDelete trigger - cleanup user data
export const onUserDelete = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  
  try {
    console.log(`Starting cleanup for deleted user ${uid}`);

    // Delete user document
    await db.collection('users').doc(uid).delete().catch(() => {});

    // Delete user's reviews (batch delete)
    const reviewsSnapshot = await db.collection('reviews')
      .where('userId', '==', uid)
      .limit(500)
      .get();
    
    if (!reviewsSnapshot.empty) {
      const batch = db.batch();
      reviewsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
      await batch.commit();
      console.log(`Deleted ${reviewsSnapshot.size} reviews for user ${uid}`);
    }

    // Remove user from chat participants in RTDB
    const chatsSnapshot = await rtdb.ref('chats')
      .orderByChild(`participants/${uid}`)
      .equalTo(true)
      .once('value');
    
    if (chatsSnapshot.exists()) {
      const updates: Record<string, null> = {};
      chatsSnapshot.forEach(chatSnap => {
        const chatId = chatSnap.key;
        updates[`/chats/${chatId}/participants/${uid}`] = null;
      });
      await rtdb.ref().update(updates);
      console.log(`Removed user ${uid} from ${Object.keys(updates).length} chats`);
    }

    // Delete visitor records (optional - may want to keep for analytics)
    // const visitorsSnapshot = await db.collectionGroup('visits')
    //   .where('userId', '==', uid)
    //   .limit(500)
    //   .get();
    // if (!visitorsSnapshot.empty) {
    //   const batch = db.batch();
    //   visitorsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
    //   await batch.commit();
    // }

    console.log(`Completed cleanup for user ${uid}`);
  } catch (error) {
    console.error(`Error during user deletion cleanup for ${uid}:`, error);
  }
});

// Update user's lastSeen timestamp
export const updateLastSeen = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    await db.collection('users').doc(context.auth.uid).update({
      lastSeen: admin.firestore.FieldValue.serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating lastSeen:', error);
    return { success: false };
  }
});