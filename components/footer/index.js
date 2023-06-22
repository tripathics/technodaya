import Image from 'next/image';
import styles from './Footer.module.scss'
import { Crimson_Text, Cormorant, Zilla_Slab, Open_Sans } from 'next/font/google'
const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })
const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })
const zilla_slab = Zilla_Slab({ display: 'swap', subsets: ['latin'], weight: ['300', '400'] })

const Footer = ({ className = '' }) => {
  return (
    <footer className={[styles.footer, crimson_text.className, className].join(' ')}>
      <div className={['container', styles['info-Footer']].join(' ')}>
        <section>
          <Image id={styles.technodayaLogo} width={200} height={24.36} src='/images/logo/technodaya-logo-white.png' alt="Technodaya" />
          <div>
            <p className={[styles.tagline, cormorant.className].join(' ')}>The Technical Meraki of Arunachal</p>
            <p>National Institute of Technology,<br />Arunachal Pradesh</p>
          </div>
        </section>
        <section>
          <h3 className={open_sans.className}>External links</h3>
          <ul>
            <li><a href='https://nitap.ac.in' target='_blank' rel='noreferrer'>NIT Arunachal Pradesh</a></li>
            <li><a href='https://github.com/Pursottam6003/Designathon-for-one/issues' target='_blank' rel='noreferrer'>Report a bug 🐞</a></li>
          </ul>
        </section>
        <section>
          <h3 className={open_sans.className}>Contact us</h3>
          <ul>
            <li><a href='tel:0360-2954549'>0360-2954549</a></li>
            <li><a href='mailto:nitapadmin@nitap.ac.in'>technodaya@nitap.ac.in</a></li>
          </ul>
        </section>
      </div>
      <div className={[styles.copyright, zilla_slab.className].join(' ')}>
        <p className='container'>
          &#169;&nbsp;2022-present&nbsp;Technodaya, NIT&nbsp;Arunchal&nbsp;Pradesh
        </p>
      </div>
    </footer>
  )
}

export default Footer;