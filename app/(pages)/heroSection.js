'use client'

import { limit, orderBy } from "firebase/firestore";
import Link from "next/link";
import useFetchCollection from "@/hooks/fetchCollection";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import cx from "classnames";
import Loading from "../../components/icons/spinner-icon";
import MagazineCard from "@/components/magazine-card/";

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
        {latestIssueId && (<>
          <h4>Latest issue published</h4>
          <h1 className={open_sans.className}>{issues[latestIssueId].Title}</h1>
          <div className={styles["issue-info"]}>
            <p>Vol-{issues[latestIssueId].Vol} Issue-{issues[latestIssueId].Issue}</p>
            <p>{issues[latestIssueId].Month} {issues[latestIssueId].Year}</p>
          </div>
          <Link href="/magazine" className={[styles.btn, open_sans.className].join(' ')}>
            Read more
          </Link>
        </>)}
      </div>
    </section>

    <section className={styles.home}>
      <div className="container">
        <header>
          <h1>Recent releases</h1>
          <Link href="/magazine" className={"btn"}>
            View all
          </Link>
        </header>
        <div className={styles.issues}>
          {loading ? <Loading /> :
            <div className="grid-gallery">
              {Object.keys(issues).map((id) => {
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