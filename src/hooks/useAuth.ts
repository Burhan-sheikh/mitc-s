import { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { updateLastSeen } from '@/lib/api';
import type { User, UserRole } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          setUser({
            uid: firebaseUser.uid,
            ...userDoc.data()
          } as User);
          
          // Update last seen
          updateLastSeen().catch(console.error);
        } else {
          // User document doesn't exist - create it
          const newUser: Omit<User, 'uid'> = {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            phone: '',
            role: 'user',
            likedProducts: [],
            createdAt: new Date(),
            lastSeen: new Date()
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
          setUser({ uid: firebaseUser.uid, ...newUser });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setError(null);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document
      const newUser: Omit<User, 'uid'> = {
        name,
        email,
        phone: '',
        role: 'user',
        likedProducts: [],
        createdAt: new Date(),
        lastSeen: new Date()
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const isAdmin = user?.role === 'admin';
  const isUser = user?.role === 'user' || user?.role === 'admin';

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isUser,
    isAuthenticated: !!user
  };
}