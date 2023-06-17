'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from './admin-nav.module.scss'
import cx from "classnames";
import { Crimson_Text } from "next/font/google";
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })

export default function NavLink({ href, label }) {
  const pathname = usePathname();
  return <Link className={cx(crimson_text.className, { [styles.active]: pathname === href })} href={href}>{label}</Link>
}