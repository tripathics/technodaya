'use client'
import { useState, useEffect, useCallback } from 'react';
import { collection, query, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { DocumentData } from 'firebase/firestore/lite';

export default function useFetchCollection<T extends Record<string, unknown> = DocumentData>(
  collectionName: string,
  filter: QueryConstraint[] = []
) {
  const [fetching, setFetching] = useState(true);
  const [docs, setDocs] = useState<Record<string, T & { id: string }>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    setFetching(true);
    const q = query(collection(db, collectionName), ...filter);

    try {
      const snapshot = await getDocs(q);
      const ls: Record<string, T & { id: string }> = {};
      snapshot.forEach(doc => {
        ls[doc.id] = { ...doc.data(), id: doc.id } as T & { id: string };
      });
      setDocs(ls);
      setFetching(false);
    } catch (error) {
      setError((error as Error).message);
      setFetching(false);
      console.error(error);
    } finally {
      setFetching(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  useEffect(() => {
    let cancelled = false;
    if (cancelled) return;

    fetchDocs();

    return () => {
      cancelled = true;
    };
  }, [fetchDocs]);

  return { docs, setDocs, fetching, refetch: fetchDocs, error };
}
