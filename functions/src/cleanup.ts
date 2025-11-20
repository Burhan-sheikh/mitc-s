import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();
const rtdb = admin.database();

// Utility function to batch delete documents
async function batchDeleteDocs(query: FirebaseFirestore.Query, batchSize = 500): Promise<number> {
  const snapshot = await query.limit(batchSize).get();
  if (snapshot.empty) return 0;

  const batch = db.batch();
  snapshot.docs.forEach(doc => batch.delete(doc.ref));
  await batch.commit();

  return snapshot.size;
}

// Request account deletion (callable function)
export const requestAccountDeletion = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const uid = context.auth.uid;
  const { deleteAllData = false, deleteAuthUser = false } = data;

  try {
    console.log(`Account deletion requested by ${uid}, deleteAllData: ${deleteAllData}`);

    if (deleteAllData) {
      // 1. Delete user's reviews
      let reviewsQuery = db.collection('reviews').where('userId', '==', uid);
      let deletedReviews = 0;
      let batchCount = 0;
      
      while (true) {
        const deleted = await batchDeleteDocs(reviewsQuery, 500);
        if (deleted === 0) break;
        deletedReviews += deleted;
        batchCount++;
        if (batchCount >= 10) break; // Safety limit
      }
      console.log(`Deleted ${deletedReviews} reviews for user ${uid}`);

      // 2. Remove user from liked products in other users' docs (optional - depends on data structure)
      // This would require a collection group query if likedProducts references this user

      // 3. Remove user from RTDB chat participants
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

      // 4. Delete user's chat messages (optional - may want to anonymize instead)
      // This is complex - would need to iterate all chats and check senderId
      // For now, we just remove participation flag above

      // 5. Delete visitor analytics (optional - may want to keep for business insights)
      // Skipping this to preserve analytics data
    }

    // Delete user document from Firestore
    await db.collection('users').doc(uid).delete().catch(() => {});
    console.log(`Deleted user document for ${uid}`);

    // Delete Auth user account (only if explicitly requested)
    if (deleteAuthUser) {
      try {
        await admin.auth().deleteUser(uid);
        console.log(`Deleted Auth account for ${uid}`);
      } catch (authError: any) {
        console.error(`Failed to delete Auth account for ${uid}:`, authError);
        // Don't throw - document deletion succeeded
      }
    }

    return {
      success: true,
      message: 'Account deletion processed successfully',
      deletedData: deleteAllData,
      deletedAuth: deleteAuthUser
    };
  } catch (error: any) {
    console.error('Account deletion failed:', error);
    throw new functions.https.HttpsError('internal', `Account deletion failed: ${error.message}`);
  }
});

// Admin function to delete any user account
export const adminDeleteUser = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check admin role
  const adminDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can delete user accounts');
  }

  const { userId } = data;
  if (!userId) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID is required');
  }

  // Prevent admin from deleting themselves
  if (userId === context.auth.uid) {
    throw new functions.https.HttpsError('invalid-argument', 'Cannot delete your own admin account');
  }

  try {
    // Delete user document
    await db.collection('users').doc(userId).delete();

    // Delete Auth account
    await admin.auth().deleteUser(userId);

    console.log(`Admin ${context.auth.uid} deleted user ${userId}`);
    return { success: true, message: 'User deleted successfully' };
  } catch (error: any) {
    console.error('Admin user deletion failed:', error);
    throw new functions.https.HttpsError('internal', `Failed to delete user: ${error.message}`);
  }
});

// Change user role (admin only)
export const changeUserRole = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  // Check admin role
  const adminDoc = await db.collection('users').doc(context.auth.uid).get();
  if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'Only admins can change user roles');
  }

  const { userId, newRole } = data;
  if (!userId || !newRole) {
    throw new functions.https.HttpsError('invalid-argument', 'User ID and new role are required');
  }

  // Validate role
  if (!['guest', 'user', 'admin'].includes(newRole)) {
    throw new functions.https.HttpsError('invalid-argument', 'Invalid role specified');
  }

  // Prevent removing last admin
  if (newRole !== 'admin') {
    const targetUser = await db.collection('users').doc(userId).get();
    if (targetUser.exists && targetUser.data()?.role === 'admin') {
      const adminCount = await db.collection('users').where('role', '==', 'admin').count().get();
      if (adminCount.data().count <= 1) {
        throw new functions.https.HttpsError('failed-precondition', 'Cannot remove the last admin');
      }
    }
  }

  try {
    // Update user role in Firestore
    await db.collection('users').doc(userId).update({
      role: newRole,
      roleUpdatedAt: admin.firestore.FieldValue.serverTimestamp(),
      roleUpdatedBy: context.auth.uid
    });

    // Optionally set custom claim for faster role checks
    if (newRole === 'admin') {
      await admin.auth().setCustomUserClaims(userId, { admin: true });
    } else {
      await admin.auth().setCustomUserClaims(userId, { admin: false });
    }

    console.log(`Admin ${context.auth.uid} changed user ${userId} role to ${newRole}`);
    return { success: true, message: `Role changed to ${newRole}` };
  } catch (error: any) {
    console.error('Role change failed:', error);
    throw new functions.https.HttpsError('internal', `Failed to change role: ${error.message}`);
  }
});