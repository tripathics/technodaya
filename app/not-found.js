import styles from './not-found.module.scss'
import { Crimson_Text } from 'next/font/google'
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })

export default function NotFound() {
  return (
    <div className={[styles['not-found'], 'container'].join(' ')}>
      <header className='page-header'>
        <h1 className='heading'>404 - Not found</h1>
      </header>

      <section className={crimson_text.className}>
        <p className={styles.paragraph}>We couldn&#39;t find the page you were looking for. This is either because:</p>
        <ul className={styles.list}>
          <li>There is an error in the URL entered into your web browser. Please check the URL and try again.</li>
          <li>The page you are looking for has been moved or deleted.</li>
        </ul>
        <p className={styles.paragraph}><a href='/'>Return to Technodaya home</a></p>
      </section>
    </div>
  )
}