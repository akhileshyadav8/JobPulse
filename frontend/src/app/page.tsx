import { getJobs, getOverviewStats } from "@/lib/api";
import { InteractiveJobFeed } from "@/components/jobs/InteractiveJobFeed";

export const revalidate = 60; // revalidate every 60 seconds

export default async function Home() {
  const [jobsData, stats] = await Promise.all([
    getJobs(),
    getOverviewStats()
  ]);

  return (
    <InteractiveJobFeed initialJobs={jobsData.items} stats={stats} />
  );
}
