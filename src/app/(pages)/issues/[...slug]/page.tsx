import Issue from "@/components/issue/Issue";

export default async function Page(props) {
  const params = await props.params;
  return <Issue params={params} />
}