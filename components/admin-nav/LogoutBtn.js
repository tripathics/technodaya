'use client'

import { useUser } from "@/contexts/user";
import styles from './admin-nav.module.scss'
import cx from "classnames";

const LogoutIcon = () => (
  <svg width="40" height="29" viewBox="0 0 40 29" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="logout-dark-no-bg-new" clipPath="url(#clip0_15_5)">
      <g id="logoutIcon">
        <path id={styles.arrow} d="M28.8238 13.4274L24.7002 9.30385C24.3017 8.90535 23.6631 8.89785 23.2739 9.28705C22.8846 9.67625 22.8922 10.3148 23.2907 10.7134L25.6641 13.086L10.0205 13.0873C9.4569 13.0873 9 13.5336 9 14.084C9 14.6345 9.4569 15.0807 10.0205 15.0807L25.7266 15.0802L23.3702 17.4378C22.981 17.827 22.9885 18.4656 23.3871 18.8642C23.7856 19.2627 24.4242 19.2703 24.8134 18.881L28.8407 14.8538C29.2299 14.4646 29.2223 13.826 28.8238 13.4274Z" />
        <path id="circle" d="M14.6246 0C19.117 0 23.2763 1.99201 26.0348 5.3479C26.3656 5.75032 26.2997 6.33844 25.8876 6.6615C25.4756 6.98455 24.8734 6.92021 24.5426 6.51778C22.1436 3.59914 18.5306 1.86879 14.6246 1.86879C7.60445 1.86879 1.9135 7.42673 1.9135 14.2828C1.9135 21.1389 7.60445 26.6969 14.6246 26.6969C18.5884 26.6969 22.2491 24.9146 24.6447 21.9221C24.9701 21.5156 25.5714 21.4437 25.9877 21.7615C26.4039 22.0794 26.4776 22.6666 26.1521 23.0732C23.3977 26.5139 19.1835 28.5657 14.6246 28.5657C6.54766 28.5657 0 22.171 0 14.2828C0 6.39463 6.54766 0 14.6246 0Z" />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_15_5">
        <rect width="40" height="29" fill="white" />
      </clipPath>
    </defs>
  </svg>
)

export default function NavBtn() {
  const { user, logout } = useUser();
  return (
    <button className={cx(styles.logout)} onClick={logout} title="Logout">
      <div className={styles['btn-txt']}>
        <span>{user?.displayName.slice(0, user.displayName.search(' ')) || 'Logout'}</span>
        <LogoutIcon />
      </div>
    </button>
  )
}