import { Card, CardContent } from "@/components/ui/card";
import { formatSalary } from "@/lib/utils";
import { Job } from "@/lib/api";

export function SalaryInsights({ job }: { job: Job }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          🔥 SALARY INSIGHTS
        </h2>
        <div className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mb-2">
          {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period)}
        </div>
        <button className="text-teal-600 dark:text-teal-400 font-medium text-sm hover:underline">
          View Detailed Salary Insights (coming soon)
        </button>
      </CardContent>
    </Card>
  );
}
