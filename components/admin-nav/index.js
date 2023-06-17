import Link from "next/link"
import Image from "next/image"
import styles from './admin-nav.module.scss'
import NavLink from "./NavLink"

const links = [
  { href: '/admin', label: 'Submissions' },
  { href: '/admin/draft', label: 'Draft issue' },
  { href: '/admin/register', label: 'Register user' },
]

export default function AdminNav() {
  return (
    <aside className={styles['nav-wrapper']}>
      <nav className={styles.nav}>
        <div className={styles.logo}>
          <Link href={'/'}>
            <Image width={200} height={25.6} src={'/images/logo/technodaya-logo1.png'} alt="Technodaya" id={styles.technodayaLogo} />
          </Link>
        </div>
        <ul className={styles['nav-items']}>
          {links.map(link => (<li className={styles['nav-item']} key={link.href}>
            <NavLink key={link.href} {...link} />
          </li>))}
          <li className={styles['nav-item']}>Logout</li>
        </ul>
      </nav>
    </aside>
  )
}