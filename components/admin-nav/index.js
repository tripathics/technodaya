import Image from "next/image"
import styles from './admin-nav.module.scss'
import NavProvider, { NavLink, NavToggle, LogoutBtn } from "./NavLink"

const links = [
  { href: '/submit', label: 'Submit an activity' },
  { href: '/admin', label: 'View submissions' },
  { href: '/admin/draft', label: 'Draft issue' },
  { href: '/admin/publish', label: 'Publish issue' },
  { href: '/admin/manage-users', label: 'Manage users' },
  { href: '/admin/forms', label: 'Add/Edit Forms' },
]

export default function AdminNav() {
  return (
    <NavProvider>
      <div className={styles['nav-overlay']}></div>
      <aside className={styles['nav-wrapper']}>
        <div className={styles['nav-toggle-wrapper']}>
          <NavToggle />
        </div>
        <nav className={styles.nav}>
          <div className={styles.logo}>
            <NavLink href={'/'}>
              <Image width={821} height={100} src={'/images/logo/technodaya-logo1.png'} alt="Technodaya" id={styles.technodayaLogo} />
            </NavLink>
          </div>
          <ul className={styles['nav-items']}>
            {links.map(link => (<li className={styles['nav-item']} key={link.href}>
              <NavLink key={link.href} {...link} />
            </li>))}
            <li className={styles['nav-item']}>
              <LogoutBtn />
            </li>
          </ul>
        </nav>
      </aside>
    </NavProvider>
  )
}