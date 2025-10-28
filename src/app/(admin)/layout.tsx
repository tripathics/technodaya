'use client'
import { useUser } from '@/contexts/user';
import styles from './layout.module.scss';
import AdminNav from '@/components/admin-nav';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/loading-screen';

export default function Layout({ children }) {
  const { user, admin, loading, setRedirected } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      setRedirected(true);
      router.push('/login');
    }
  }, [loading, user]);

  return (<>
    <div className={styles['admin-layout']}>
      <AdminNav />
      <main className={styles.main}>
        {loading
          ? <LoadingScreen />
          : user && admin ? children : <div className={styles.loading}>You must be logged in as an admin to view this page.</div>
        }
      </main>
    </div>
  </>)
}