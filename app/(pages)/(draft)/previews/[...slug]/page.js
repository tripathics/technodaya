import Issue from "@/components/issue/Issue";

export default function Page({ params }) {
  return <Issue params={params} draft={true} />
}