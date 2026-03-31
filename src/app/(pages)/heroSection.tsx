'use client'

import { limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import useFetchCollection from "@/hooks/fetchCollection";
import styles from "./page.module.scss";
import cx from "classnames";
import MagazineCard, { MagazineCardSkeleton } from "@/components/magazine-card/";
import type { Collections } from "@/types/collection";
import { MagazineGrid } from "@/components/magazine/magazine-grid";
import { cn } from "@/lib/utils";

const HeroSection = () => {
  const {
    docs: issues,
    fetching: loading,
  } = useFetchCollection<Collections.Issue>('PastPublications', [orderBy('index', 'desc'), limit(3)]);

  const latestIssueUrl = Object.entries(issues).length > 0 ? issues[Object.keys(issues)[0]].PdfUrl : null;

  return (<>
    <section className={cx(styles.hero, 'parallax', styles.parallax, styles.home, "font-display")}>
      <div className="container">
        <h1 className="font-sans">Technodaya Newsletter</h1>
        <h4>The Technical Meraki of Arunachal</h4>
        {latestIssueUrl ? (
          <a href={latestIssueUrl} target="_blank" rel="noreferrer" className={cn(styles.btn, "font-sans")}>
            Read latest issue
          </a>
        ) : (
          <Link href="/read" className={cn(styles.btn, "font-sans")}>
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
            <MagazineGrid aria-label="Loading recent releases">
              <MagazineCardSkeleton />
              <MagazineCardSkeleton />
              <MagazineCardSkeleton />
            </MagazineGrid>
          ) : (
            <MagazineGrid>
              {Object.keys(issues).map(id => {
                const { ImageUrl, Title, Vol, Issue, Month, Year, Link, PdfUrl, } = issues[id];
                return (
                  <MagazineCard key={id} imgsrc={ImageUrl} title={Title}
                    vol={Vol} iss={Issue} month={Month} year={Year}
                    link={Link} pdfLink={PdfUrl}
                  />
                );
              })}
            </MagazineGrid>
          )}
        </div>
      </div>
    </section>
  </>)
}

export default HeroSection;
