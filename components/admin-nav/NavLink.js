'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import styles from './admin-nav.module.scss'
import cx from "classnames";
import { Crimson_Text } from "next/font/google";
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })
import HamburgerIcon from "../icons/hamburger-icon"
import CloseIcon from '../icons/remove-icon';
import { createContext, useContext, useEffect } from "react";

const Context = createContext();
export default function NavProvider({ children }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (open) {
      document.querySelector(`aside.${styles['nav-wrapper']}`).classList.add(styles['nav-open']);
    } else {
      document.querySelector(`aside.${styles['nav-wrapper']}`).classList.remove(styles['nav-open']);
    }
  }, [open])

  return (
    <Context.Provider value={{ open: open, setOpen: setOpen }} >{children}</Context.Provider>
  )
}

export function NavLink({ href, label }) {
  const pathname = usePathname();
  const { setOpen } = useContext(Context);

  const closeSideNav = () => {
    setOpen(false);
  }

  return <Link onClick={closeSideNav} className={cx(crimson_text.className, { [styles.active]: pathname === href })} href={href}>{label}</Link>
}

export function NavToggle() {
  const { open, setOpen } = useContext(Context);

  return (
    <button className={styles['nav-toggle']} aria-label="toggle navigation" onClick={e => { setOpen(!open) }}>
      {open ? <CloseIcon /> : <HamburgerIcon />}
    </button>
  )
}