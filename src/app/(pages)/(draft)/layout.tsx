'use client'
import { useUser } from '@/contexts/user';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/loading-screen';

export default function Layout({ children }) {
  const { user, loading, setRedirected } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      setRedirected(true);
      router.push('/login');
    }
  }, [loading, user]);

  return (
    loading
      ? <LoadingScreen />
      : user
        ? children
        : <div>You must be logged in to view this page.</div>
  )
}