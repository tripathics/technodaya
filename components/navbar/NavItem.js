'use client'
import Link from "next/link";
import { Crimson_Text } from "next/font/google";
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })
import styles from "./Navigation.module.scss";
import cx from "classnames";
import { usePathname } from "next/navigation"

const toggleSideNav = () => {
  const mobileNavRef = document.getElementById('mobile-nav');
  if (mobileNavRef.classList.contains(styles['nav-open'])) {
    mobileNavRef.classList.remove(styles['nav-open']);
    document.body.style.overflow = "auto";
  } else {
    mobileNavRef.classList.add(styles['nav-open']);
    document.body.style.overflow = "hidden";
  }
}

const closeSideNav = () => {
  const mobileNavRef = document.getElementById('mobile-nav');
  mobileNavRef.classList.remove(styles['nav-open']);
  document.body.style.overflow = "auto";
}

export const NavBtn = ({ children, title }) => {
  return (
    <button title={title} type="button" onClick={toggleSideNav} >
      {children}
    </button>
  )
}

export const NavItem = ({ link, name, replace = false }) => {
  const pathname = usePathname();
  return (
    <li>
      <Link
        onClick={closeSideNav}
        className={cx(styles['nav-item'], crimson_text.className, { [styles.active]: pathname === link })}
        href={link}
        replace={replace}
      >
        <div className={styles['nav-item-txt']}>{name}</div>
      </Link>
    </li>
  )
}