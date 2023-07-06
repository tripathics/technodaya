'use client'
import { useEffect, useState } from "react";
import { getBiMonth, BiMonthlyNames } from "@/helpers/helpers";
import styles from './issue.module.scss';
import MagazineSection from "@/components/issue/MagazineSection";
import { Cormorant } from 'next/font/google'
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebasse.config";
import NotFound from "@/app/not-found";
import Alert from '@/components/alert';
import LoadingScreen from "../loading-screen";

const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] });

export default function Issue({ params, draft = false }) {
  const [bimonthYear] = params.slug;
  const [loading, setLoading] = useState(true);
  const [issueData, setIssueData] = useState(null);
  const [currentSectionIds, setCurrentSectionIds] = useState([]);
  const [publishedAtStr, setPublishedAtStr] = useState('');

  const fetchIssueData = async () => {
    setLoading(true);
    try {
      const docSnap = await getDoc(doc(db, draft ? 'previews' : 'issues', bimonthYear));
      if (!docSnap.exists()) throw new Error('Not found');
      setIssueData({
        ...docSnap.data(),
      });
      setPublishedAtStr(BiMonthlyNames[getBiMonth(docSnap.data().month)][1] + ' ' + docSnap.data().month.slice(0, 4))
      const { sections, sectionOrder } = docSnap.data()?.orders;
      const nonEmptySectionIds = sectionOrder.filter(secId => sections[secId].subSecIds.length !== 0)
      setCurrentSectionIds(nonEmptySectionIds);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssueData();
  }, [])

  return (
    loading ? <LoadingScreen /> : !currentSectionIds.length ? <NotFound /> :
      <div className='container'>
        <div className={styles['page-header']}>
          {draft && <Alert message="You are viewing a draft copy of the issue. Changes may be made until the issue is published." severity="warning" />}
          <div className={styles['issue-meta']}>
            <time className={styles['publish-date']}>{publishedAtStr}</time>
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