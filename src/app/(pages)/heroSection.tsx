'use client'

import { limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import useFetchCollection from "@/hooks/fetchCollection";
import styles from "./page.module.scss";
import cx from "classnames";
import MagazineCard, { MagazineCardSkeleton } from "@/components/magazine-card/";
import type { Issue as IssueType } from "@/types/collection";

import { Cormorant, Open_Sans } from "next/font/google";
const open_sans = Open_Sans({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'] })
const cormorant = Cormorant({ display: 'swap', subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'] })

// type IssueType = {
//   ImageUrl: string;
//   Title: string;
//   Vol: string;
//   Issue: string;
//   Month: string;
//   Year: string;
//   Link: string;
//   PdfUrl: string;
//   id: string;
// }

const HeroSection = () => {
  const {
    docs: issues,
    fetching: loading,
  } = useFetchCollection<IssueType>('PastPublications', [orderBy('index', 'desc'), limit(3)]);

  const latestIssueUrl = Object.entries(issues).length > 0 ? issues[Object.keys(issues)[0]].PdfUrl : null;

  return (<>
    <section className={cx(styles.hero, 'parallax', styles.parallax, styles.home, cormorant.className)}>
      <div className="container">
        <h1 className={open_sans.className}>Technodaya Newsletter</h1>
        <h4>The Technical Meraki of Arunachal</h4>
        {latestIssueUrl ? (
          <a href={latestIssueUrl} target="_blank" rel="noreferrer" className={[styles.btn, open_sans.className].join(' ')}>
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
          {loading ? (
            <div className="grid-gallery"
              aria-label="Loading recent releases"
            >
              <MagazineCardSkeleton />
              <MagazineCardSkeleton />
              <MagazineCardSkeleton />
            </div>
          ) : (
            <div className="grid-gallery">
              {Object.keys(issues).map(id => {
                const { ImageUrl, Title, Vol, Issue, Month, Year, Link, PdfUrl, } = issues[id];
                return (
                  <MagazineCard key={id} imgsrc={ImageUrl} title={Title}
                    vol={Vol} iss={Issue} month={Month} year={Year}
                    link={Link} pdfLink={PdfUrl}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  </>)
}

export default HeroSection;
