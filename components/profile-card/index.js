import styles from './ProfileCard.module.scss';
import Image from "next/image";
import { Crimson_Text } from 'next/font/google'
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })

const icons = {
  facebook: 'https://img.icons8.com/fluent/40/000000/facebook-new.png',
  linkedin: 'https://img.icons8.com/fluent/40/000000/linkedin-circled.png',
  instagram: 'https://static.cdninstagram.com/rsrc.php/yv/r/BTPhT6yIYfq.ico',
  github: "https://img.icons8.com/dusk/40/null/github.png"
}

const ProfileCard = ({ links = [], name, role, designation, profile }) => (
  <div className={[styles.card, styles.anchored].join(' ')}>
    <div className={styles.profile}>
      <Image alt={name} src={profile} width={176} height={176} />
    </div>
    <div className={styles.info}>
      <h3 className={[styles.title, crimson_text.className].join(' ')}>{name}</h3>
      <p className={styles.designation}>{designation}</p>
      <p className={styles.role}>{role}</p>
    </div>
    <ul className={styles.social}>
      {links.map(link => (
        <li key={link.to}><a href={link.to}>
          <Image alt='' src={icons[link.icon]} width={32} height={32} />
        </a></li>
      ))}
    </ul>
  </div>
)

export default ProfileCard;