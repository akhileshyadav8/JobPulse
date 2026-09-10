import { getCompanies } from "@/lib/api";
import { InteractiveCompanies } from "@/components/companies/InteractiveCompanies";

export const revalidate = 60;

export default async function CompaniesPage() {
  const data = await getCompanies();

  return <InteractiveCompanies initialCompanies={data.items} />;
}
