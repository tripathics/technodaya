import { ReactMarkdown } from "react-markdown/lib/react-markdown"
import styles from './magazine.module.scss'
import { Sections } from "@/helpers/helpers"
import rehypeRaw from "rehype-raw"
import remarkGfm from "remark-gfm"
import { Crimson_Text, Open_Sans } from 'next/font/google'
import Image from "next/image"

const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })
const crimson_text = Crimson_Text({ display: 'swap', subsets: ['latin'], weight: ['400', '600', '700'], styles: ['normal', 'italic'] })

const MagazineActivity = ({ title, content, brochureUrl, imgUrl, imgCaption }) => {
  const images = imgUrl.map((url) => (
    <a key={url} href={url} target='_blank' rel='noreferrer'>
      <div className={styles['img-wrapper']}>
        <Image className={styles.bg} src={url} alt="" fill={true} />
        <Image className={styles.img} src={url} alt={imgCaption} fill={true} />
      </div>
    </a>
  ))

  return (
    <li className={styles['magazine-article']}>
      {title && <h4>{title}</h4>}
      <div className={styles.content}>
        <div>
          <ReactMarkdown rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        {brochureUrl && (
          <p><a href={brochureUrl}>Download event brochure</a> or visit <a href='https://nitap.ac.in/'>NIT Arunachal Pradesh website</a>.</p>
        )}
        <div className={styles['mag-images']}>
          {images}

          {images.length !== 0 && (
            <p className={styles['img-caption']}>
              {imgCaption ? imgCaption : title ? title : ''}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}

const MagazineSubSection = ({ title, activityIds, activities }) => {
  return (
    <div className={[styles['magazine-section'], crimson_text.className].join(' ')}>
      <header className={styles['category-header']}>
        {title && title !== 'Other' && <h3 className={[styles['category-heading'], open_sans.className].join(' ')}>{title}</h3>}
      </header>
      <ol className={styles['article-ls']}>
        {activityIds.map(activityId => (
          <MagazineActivity key={`activity${activityId}`} {...activities[activityId]}
            id={activityId} data={activities[activityId]} />
        ))}
      </ol>
    </div>
  )
}

const MagazineSection = ({ id, subSecIds, subSections, activities }) => {
  return (
    <div className={styles['magazine-section']}>
      <header className={styles['category-header']}>
        <h2 id={`category${id}`}>{Sections[id].title}</h2>
      </header>
      {subSecIds.map(subSecId => (
        <MagazineSubSection key={`subsection${subSecId}`}
          {...subSections[subSecId]}
          activities={activities}
        />
      ))}
    </div>
  )
}

export default MagazineSection;