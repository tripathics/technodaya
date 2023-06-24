import { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '@/firebasse.config';

export default function useFetchCollection(collectionName, filter = []) {
  const [fetching, setFetching] = useState(true);
  const [docs, setDocs] = useState({});
  const [error, setError] = useState(null);

  const fetchDocs = () => {
    console.log('fetchDocs: Fetching...')
    setFetching(true);
    const q = query(collection(db, collectionName), ...filter);

    getDocs(q).then(snapshot => {
      const ls = {};
      snapshot.forEach(doc => {
        ls[doc.id] = { ...doc.data(), id: doc.id };
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
    fetchDocs();
  }, []);

  return { docs, setDocs, fetching, refetch: fetchDocs, error };
}