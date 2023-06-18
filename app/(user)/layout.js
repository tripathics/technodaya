'use client'
import Navbar from '@/components/navbar/';
import Footer from '@/components/footer/';
import styles from '../(pages)/layout.module.scss';
import styles2 from './layout.module.scss';
import { useUser } from '@/contexts/user';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Layout({ children }) {
  const { user, loading, setRedirected } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      setRedirected(true);
      router.push('/login');
    }
  }, [loading, user]);

  return (<>
    <Navbar />
    <main className={styles.main}>
      {loading
        ? <div className={styles.loading}>Loading...</div>
        : user
          ? children
          : <div className={styles.loading}>You must be logged in to view this page.</div>
      }
    </main>
    <Footer className={styles2.footer} />
  </>)
}