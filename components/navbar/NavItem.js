'use client'

import Link from "next/link";

import styles from "./Navigation.module.scss";
import cx from "classnames";
import { usePathname } from "next/navigation"

const toggleSideNav = () => {
  const mobileNavRef = document.getElementById('mobile-nav');
  if (!mobileNavRef.offsetWidth) {
    mobileNavRef.style.width = "100%";
  } else {
    mobileNavRef.style.width = "0%";
  }
}

const NavItem = ({ link, name }) => {
  const pathname = usePathname();

  return (
    <li>
      <Link
        onClick={toggleSideNav}
        className={cx(styles['nav-item'], { [styles.active]: pathname === link })}
        href={link}
      >
        <div className={styles['nav-item-txt']}>{name}</div>
      </Link>
    </li>
  )
}

export default NavItem;