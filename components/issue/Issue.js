'use client'
import useFetchCollection from "@/hooks/fetchCollection";
import { useEffect, useState } from "react";
import { getBiMonth, BiMonthlyNames } from "@/helpers/helpers";
import LoadingPage from "@/components/icons/spinner-icon";
import styles from './issue.module.scss';
import MagazineSection from "@/components/issue/MagazineSection";
import { Cormorant } from 'next/font/google'
const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })

export default function Issue({ params, draft = false }) {
  const [year, biMonth] = params.slug;
  const { fetching: loading, docs } = useFetchCollection(`${draft ? 'previews' : 'issues'}/${year}/${biMonth}`);
  const [issueData, setIssueData] = useState(null);
  const [currentSectionIds, setCurrentSectionIds] = useState([]);

  useEffect(() => {
    if (loading) return;
    if (Object.keys(docs).length) {
      const data = docs[Object.keys(docs)[0]]
      data.publishedAtStr = BiMonthlyNames[getBiMonth(data.month)][1] + ' ' + data.month.slice(0, 4);
      setIssueData(data)
    }
    // eslint-disable-next-line
  }, [loading])

  useEffect(() => {
    if (issueData) {
      createComponents();
    }
    // eslint-disable-next-line
  }, [issueData])

  const createComponents = () => {
    const { sections, sectionOrder } = issueData.orders;

    const nonEmptySectionIds = sectionOrder.filter(secId => sections[secId].subSecIds.length !== 0)
    setCurrentSectionIds(nonEmptySectionIds);
  }

  return (
    loading ? <LoadingPage /> : !issueData ? <>Not found</> :
      <div className='container'>
        <div className={styles['page-header']}>
          <div className={styles['issue-meta']}>
            <time className={styles['publish-date']}>{issueData.publishedAtStr}</time>
            <span className={styles['iss-vol']}>Vol-{issueData.vol}, Issue-{issueData.iss}</span>
          </div>
          <h1 className={[styles.heading, cormorant.className].join(' ')}>{issueData.title.slice(0, 1).toUpperCase() + issueData.title.slice(1, issueData.title.length)}</h1>
        </div>
        <div className={styles['magazine-wrapper']}>
          <div className={styles.magazine}>
            {currentSectionIds.map(secId =>
              <MagazineSection
                key={`section${secId}`}
                {...issueData.orders.sections[secId]}
                subSections={issueData.orders.subSections}
                activities={issueData.orders.activities}
              />
            )}
          </div>
        </div>
      </div>
  )
}