import Image from 'next/image';
import styles from './magazine.module.scss';

const MagazineCard = ({ imgsrc, title, vol, iss, month, year, link, pdfLink }) => {
  return (
    <section className={styles["magazine-card"]}>
      <figure className={styles["cover-img"]}>
        <Image src={imgsrc} alt={`Technodaya Vol ${vol} Iss ${iss} cover`} width={600} height={660} />
      </figure>
      <div className={styles["desc"]}>
        <a className={styles["title"]} href={link || pdfLink} target='_blank' rel='noreferrer'>
          <p>{title}</p>
        </a>
        <div className={styles["date"]}>
          <time>{month} {year}</time>
          <div className={styles["issue"]}>Vol-{vol} issue {iss}</div>
        </div>
        <div className={styles["actions"]}>
          {pdfLink ? (
            <a className={styles["action-btn"]} href={pdfLink} target="_blank" rel='noreferrer'>View PDF</a>
          ) : (
            <a className={styles["action-btn"]} href={link} target="_blank" rel='noreferrer'>Read issue</a>
          )}
          <button className={styles["action-btn"]}>Share</button>
        </div>
      </div>
    </section>
  )
}

export const MagazineCardSkeleton = () => {
  return (
    <section className={styles["magazine-card"]}>
      <figure className={styles["cover-img"]}>
        <div className={styles["skeleton"]}></div>
      </figure>
      <div className={styles["desc"]}>
        <div className={styles["title"]}>
          <div className={styles["skeleton"]}></div>
        </div>
        <div className={styles["date"]}>
          <time><div className={styles["skeleton"]}></div></time>
          <div className={styles["issue"]}><div className={styles["skeleton"]}></div></div>
        </div>
        <div className={styles["actions"]}>
          <div className={styles["skeleton"]}></div>
          <div className={styles["skeleton"]}></div>
        </div>
      </div>
    </section>
  )
}

export default MagazineCard;