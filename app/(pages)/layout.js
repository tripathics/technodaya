'use client'
import Navbar from '@/components/navbar/';
import Footer from '@/components/footer/';
import styles from './layout.module.scss';
import { useEffect,useState } from 'react';

export default function Layout({ children }) {
  const [Visitors, setVisitors] = useState(0)
  useEffect(()=>{
    const storedCount = localStorage.getItem("page-Visits");
    const initialCount = Number(storedCount) || 1052;
    setVisitors(initialCount+1);
    localStorage.setItem("page-Visits",initialCount+1);
  },[]);
  return (<>
    <Navbar />
    <main className={styles.main}>
      {children}
    </main>
    <Footer Visits={Visitors} />
  </>)
}