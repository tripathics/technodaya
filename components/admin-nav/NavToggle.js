'use client'
import { useState } from 'react';
import styles from './admin-nav.module.scss'
import HamburgerIcon from "../icons/hamburger-icon"
import CloseIcon from '../icons/remove-icon';

export default function NavToggle() {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    document.querySelector(`aside.${styles['nav-wrapper']}`).classList.toggle(styles['nav-open']);
    if (document.querySelector(`aside.${styles['nav-wrapper']}`).classList.contains(styles['nav-open'])) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }

  return (
    <button className={styles['nav-toggle']} aria-label="toggle navigation" onClick={handleToggle}>
      {open ? <CloseIcon /> : <HamburgerIcon />}
    </button>
  )
}