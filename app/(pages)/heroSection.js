'use client'

import { limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import useFetchCollection from "@/hooks/fetchCollection";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import cx from "classnames";
import MagazineCard, { MagazineCardSkeleton } from "@/components/magazine-card/";

import { Cormorant, Open_Sans } from "next/font/google";
const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })
const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], styles: ['normal', 'italic'] })

const HeroSection = () => {
  const [latestIssueId, setLatestIssueId] = useState(null);

  const {
    docs: issues,
    fetching: loading,
  } = useFetchCollection('PastPublications', [orderBy('index', 'desc'), limit(3)]);

  useEffect(() => {
    if (!loading) setLatestIssueId(Object.keys(issues)[0]);
  }, [loading])

  return (<>
    <section className={cx(styles.hero, 'parallax', styles.parallax, styles.home, cormorant.className)}>
      <div className="container">
        <h1 className={open_sans.className}>Technodaya Newsletter</h1>
        <h4>The Technical Meraki of Arunachal</h4>
        {latestIssueId ? (
          <a href={`${issues[latestIssueId].PdfUrl}`} target="_blank" rel="noreferrer" className={[styles.btn, open_sans.className].join(' ')}>
            Read latest issue
          </a>
        ) : (
          <Link href="/read" className={[styles.btn, open_sans.className].join(' ')}>
            View all issues
          </Link>
        )}
      </div>
    </section>

    <section className={styles.home}>
      <div className="container">
        <header>
          <h1>Recent releases</h1>
          <Link href="/read" className={"btn"}>
            View all
          </Link>
        </header>
        <div className={styles.issues}>
          {loading
            ? <div className="grid-gallery"
              aria-label="Loading recent releases"
            >
              <MagazineCardSkeleton />
              <MagazineCardSkeleton />
              <MagazineCardSkeleton />
            </div>
            : <div className="grid-gallery">
              {Object.keys(issues).map((id, i) => {
                const { ImageUrl, Title, Vol, Issue, Month, Year, Link, PdfUrl, } = issues[id];
                return (
                  <MagazineCard key={id} imgsrc={ImageUrl} title={Title}
                    vol={Vol} iss={Issue} month={Month} year={Year}
                    link={Link} pdfLink={PdfUrl}
                  />
                );
              })}
            </div>}
        </div>
      </div>
    </section>
  </>)
}

export default HeroSection;