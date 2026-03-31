'use client'
import MagazineCard, { MagazineCardSkeleton } from "../magazine-card";
import { limit as limitBy, orderBy, QueryConstraint } from "firebase/firestore";
import useFetchCollection from "@/hooks/fetchCollection";
import type { Collections } from "@/types/collection";
import { MagazineGrid } from "../magazine/magazine-grid";

export default function IssuesGroup({ limit = null }) {
  const filter: QueryConstraint[] = [orderBy('index', 'desc')]
  if (limit) { filter.push(limitBy(limit)) }

  const {
    docs: issues,
    fetching: loading,
  } = useFetchCollection<Collections.Issue>('PastPublications', filter);

  return (
    <div className="issues">
      {loading
        ? <MagazineGrid aria-label="Loading releases">
          <MagazineCardSkeleton />
          <MagazineCardSkeleton />
          <MagazineCardSkeleton />
        </MagazineGrid>
        : <MagazineGrid aria-label="Loading releases">
          {Object.keys(issues).map((id) => {
            const { ImageUrl, Title, Vol, Issue, Month, Year, Link, PdfUrl } = issues[id]
            return <MagazineCard key={id} imgsrc={ImageUrl} title={Title} vol={Vol} iss={Issue} month={Month} year={Year} link={Link} pdfLink={PdfUrl} />
          })}
        </MagazineGrid>}
    </div>
  )
}
