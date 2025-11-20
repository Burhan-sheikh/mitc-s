import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Review, ReviewFormData } from '@/types';

export function useReviews(approved?: boolean) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, [approved]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'reviews'));

      if (approved !== undefined) {
        q = query(q, where('approved', '==', approved));
      }

      q = query(q, orderBy('createdAt', 'desc'), limit(50));

      const snapshot = await getDocs(q);
      const reviewsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];

      setReviews(reviewsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  };
}

export function useReviewMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createReview = async (
    userId: string,
    userName: string,
    data: ReviewFormData
  ): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = await addDoc(collection(db, 'reviews'), {
        ...data,
        userId,
        userName,
        approved: false, // Reviews need admin approval
        createdAt: Timestamp.now()
      });

      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const approveReview = async (reviewId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'reviews', reviewId);
      await updateDoc(docRef, { approved: true });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const hideReview = async (reviewId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'reviews', reviewId);
      await updateDoc(docRef, { approved: false });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'reviews', reviewId);
      await deleteDoc(docRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createReview,
    approveReview,
    hideReview,
    deleteReview,
    loading,
    error
  };
}