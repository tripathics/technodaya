'use client'
import MagazineCard, { MagazineCardSkeleton } from "../magazine-card";
import { limit as limitBy, orderBy } from "firebase/firestore";
import useFetchCollection from "@/hooks/fetchCollection";

export default function IssuesGroup({ limit = null }) {
  let filter = [orderBy('index', 'desc')]
  if (limit) { filter.push(limitBy(limit)) }

  const {
    docs: issues,
    fetching: loading,
  } = useFetchCollection('PastPublications', filter);

  return (
    <div className="issues">
      {loading
        ? <div className="grid-gallery"
          aria-label="Loading releases"
        >
          <MagazineCardSkeleton />
          <MagazineCardSkeleton />
          <MagazineCardSkeleton />
        </div>
        : <div className="grid-gallery">
          {Object.keys(issues).map((id) => {
            const { ImageUrl, Title, Vol, Issue, Month, Year, Link, PdfUrl } = issues[id]
            return <MagazineCard key={id} imgsrc={ImageUrl} title={Title} vol={Vol} iss={Issue} month={Month} year={Year} link={Link} pdfLink={PdfUrl} />
          })}
        </div>}
    </div>
  )
}