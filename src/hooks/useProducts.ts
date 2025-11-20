import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Product, ProductFormData, ProductFilters } from '@/types';

export function useProducts(filters?: ProductFilters) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, [JSON.stringify(filters)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let q = query(collection(db, 'products'));

      // Apply filters
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }
      if (filters?.brand) {
        q = query(q, where('brand', '==', filters.brand));
      }
      if (filters?.inStock) {
        q = query(q, where('stock', '>', 0));
      }

      // Default ordering
      q = query(q, orderBy('createdAt', 'desc'), limit(50));

      const snapshot = await getDocs(q);
      const productsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      setProducts(productsData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    error,
    refetch: fetchProducts
  };
}

export function useProduct(productId: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    if (!productId) return;

    try {
      setLoading(true);
      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({
          id: docSnap.id,
          ...docSnap.data()
        } as Product);
        setError(null);
      } else {
        setError('Product not found');
      }
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    product,
    loading,
    error,
    refetch: fetchProduct
  };
}

// Admin product mutations
export function useProductMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProduct = async (data: ProductFormData): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = await addDoc(collection(db, 'products'), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        views: 0
      });

      return docRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (productId: string, data: Partial<ProductFormData>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (productId: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'products', productId);
      await deleteDoc(docRef);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const duplicateProduct = async (productId: string): Promise<string> => {
    try {
      setLoading(true);
      setError(null);

      const docRef = doc(db, 'products', productId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        throw new Error('Product not found');
      }

      const data = docSnap.data();
      const newDocRef = await addDoc(collection(db, 'products'), {
        ...data,
        title: `${data.title} (Copy)`,
        status: 'draft',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        views: 0
      });

      return newDocRef.id;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    duplicateProduct,
    loading,
    error
  };
}