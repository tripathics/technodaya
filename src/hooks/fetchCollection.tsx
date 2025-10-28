import { useState, useEffect } from 'react';
import { collection, query, getDocs, QueryConstraint } from 'firebase/firestore';
import { db } from '@/firebase.config';
import { DocumentData } from 'firebase/firestore/lite';

export default function useFetchCollection<T extends Record<string, unknown> = DocumentData>(
  collectionName: string,
  filter: QueryConstraint[] = []
) {
  const [fetching, setFetching] = useState(true);
  const [docs, setDocs] = useState<Record<string, T & { id: string }>>({});
  const [error, setError] = useState(null);

  const fetchDocs = () => {
    setFetching(true);
    const q = query(collection(db, collectionName), ...filter);

    getDocs(q).then(snapshot => {
      const ls: Record<string, T & { id: string }> = {};
      snapshot.forEach(doc => {
        ls[doc.id] = { ...doc.data(), id: doc.id } as T & { id: string };
      });
      const ls_l = ls;
      setDocs(ls_l);
      setFetching(false);
    }).catch(error => {
      setError(error.message);
      setFetching(false);
      console.error(error);
    })
  };

  useEffect(() => {
    let cancelled = false;
    if (cancelled) return;

    fetchDocs();

    return () => {
      cancelled = true;
    };
  }, []);

  return { docs, setDocs, fetching, refetch: fetchDocs, error };
}
