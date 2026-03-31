import Link from 'next/link'
import Image from 'next/image'
import CloseIcon from '@/components/icons/remove-icon'
import HamburgerIcon from '@/components/icons/hamburger-icon'
import styles from './Navigation.module.scss';
import { NavItem, NavBtn } from './NavItem';
import AuthNav from './authNav'
import { cn } from '@/lib/utils';

const NavLinks = [
  { link: '/', name: 'Home' },
  { link: '/read', name: 'Read' },
  { link: '/about', name: 'About us' },
]

const Navbar: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <nav className={cn(styles['navbar-component'], className)}>
      <div className={cn(styles['nav-content-wrapper'], 'container')} >
        <header className={styles.banner}>
          <Link href='/'>
            <Image width={200} height={24.36} src={'/images/logo/technodaya-logo1.png'} alt="Technodaya" id={styles.technodayaLogo} /></Link>
        </header>

        <div className={styles['nav-items-wrapper']}>
          <div id='mobile-nav' className={styles['mobile-nav-wrapper']}>
            <ul className={cn(styles['nav-items'], styles.mobile)}>
              <li className={styles['nav-btn']}>
                <NavBtn title='Close menu'><CloseIcon /></NavBtn>
              </li>
              {NavLinks.map((item, i) => <NavItem key={`mu${i}`} {...item} />)}
              <AuthNav />
            </ul>
          </div>
          <ul className={cn(styles['nav-items'], styles.desktop)}>
            {NavLinks.map((item, i) => <NavItem key={`du${i}`} {...item} />)}
            <li style={{ height: 32 }}><hr className={styles.divider} /></li>
            <AuthNav />
          </ul>

          <div className={styles['toggle-nav-btn']}>
            <NavBtn title='Menu'>
              <HamburgerIcon />
            </NavBtn>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
