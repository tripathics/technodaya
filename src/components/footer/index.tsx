import Image from 'next/image';
import styles from './Footer.module.scss'
import { cn } from '@/lib/utils';

const Footer = ({ className = '', visitors = -1, issues = -1 }) => {
  return (
    <footer className={cn(styles.footer, "font-serif", "flex flex-col text-sm text-white", className)}>
      <div className={['container', styles['info-Footer']].join(' ')}>
        <section>
          <Image id={styles.technodayaLogo} width={200} height={24.36} src='/images/logo/technodaya-logo-white.png' alt="Technodaya" />
          <div>
            <p className={[styles.tagline, 'font-display'].join(' ')}>The Technical Meraki of Arunachal</p>
            <p>National Institute of Technology,<br />Arunachal Pradesh</p>
            {(visitors !== -1) && <p className={[styles.visits, 'font-display'].join(' ')}>Our Readers:- <span>{visitors}</span></p>}
            {(issues !== -1) && <p className={[styles.issues, 'font-display'].join(' ')}>Issues Released:- <span>{issues}</span></p>}
          </div>
        </section>
        <section>
          {/* <h3 className={open_sans.className}>External links</h3> */}
          <h3 className="font-sans">External links</h3>
          <ul>
            <li><a href='https://nitap.ac.in' target='_blank' rel='noreferrer'>NIT Arunachal Pradesh</a></li>
            <li><a href='https://github.com/tripathics/technodaya/issues' target='_blank' rel='noreferrer'>Report a bug 🐞</a></li>
          </ul>
        </section>
        <section>
          <h3 className="font-sans">Contact us</h3>
          <ul>
            <li><a href='tel:0360-2954549'>0360-2954549</a></li>
            <li><a href='mailto:nitapadmin@nitap.ac.in'>technodaya@nitap.ac.in</a></li>
          </ul>
        </section>
      </div>
      <div className={cn(styles.copyright, 'font-slab leading-normal text-center pt-4 pb-4')}>
        <p className='container'>
          &#169;&nbsp;2022-present&nbsp;Technodaya, NIT&nbsp;Arunchal&nbsp;Pradesh
        </p>
      </div>
    </footer>
  )
}

export default Footer;
