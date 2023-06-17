import Link from 'next/link'
import Image from 'next/image'
import CloseIcon from '@/components/icons/remove-icon'
import HamburgerIcon from '@/components/icons/hamburger-icon'
import styles from './Navigation.module.scss';
import NavItem from './NavItem';
import NavBtn from './NavBtn'
import AuthNav from './authNav'

const NavLinks = [
  { link: '/', name: 'Home' },
  { link: '/read', name: 'Read' },
  { link: '/about', name: 'About us' },
  { link: '/submit', name: 'Submit', auth: true },
  { link: '/activity', name: 'My Activity', auth: true },
  { link: '/admin', name: 'Admin', auth: true, admin: true },
]

const Navbar = () => {
  return (
    <nav className={styles['navbar-component']}>
      <div className={[styles['nav-content-wrapper'], 'container'].join(' ')} >
        <header className={styles.banner}>
          <Link exact="true" href='/'>
            <Image width={200} height={25.6} src={'/images/logo/technodaya-logo1.png'} alt="Technodaya" id={styles.technodayaLogo} /></Link>
        </header>

        <div className={styles['nav-items-wrapper']}>
          <div id='mobile-nav' className={styles['mobile-nav-wrapper']}>
            <ul className={[styles['nav-items'], styles.mobile].join(' ')}>
              <li className={styles['nav-btn']}>
                <NavBtn><CloseIcon /></NavBtn>
              </li>
              {NavLinks.filter(item => !item.auth).map((item, i) => <NavItem key={`mu${i}`} {...item} />)}
              <AuthNav />
            </ul>
          </div>
          <ul className={[styles['nav-items'], styles.desktop].join(' ')}>
            {NavLinks.filter(item => !item.auth).map((item, i) => <NavItem key={`du${i}`} {...item} />)}
            <li style={{ height: 32 }}><hr className={styles.divider} /></li>
            <AuthNav />
          </ul>

          <div className={styles['toggle-nav-btn']}>
            <NavBtn>
              <HamburgerIcon />
            </NavBtn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;