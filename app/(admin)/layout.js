import styles from './layout.module.scss';
import AdminNav from '@/components/admin-nav';

export default function Layout({ children }) {
  return (<>
    <div className={styles['admin-layout']}>
      <AdminNav />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  </>)
}