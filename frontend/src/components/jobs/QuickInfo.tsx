import { Card, CardContent } from "@/components/ui/card";
import { Job } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export function QuickInfo({ job }: { job: Job }) {
  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <h2 className="text-lg font-bold flex items-center gap-2 mb-4 uppercase">
          ℹ️ QUICK INFO
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-slate-500 mb-1">Job ID</div>
            <div className="font-medium">{job.id}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Posted Date</div>
            <div className="font-medium">{formatDate(job.posted_at || job.first_seen_at)}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Job Type</div>
            <div className="font-medium">{job.employment_type}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Batch</div>
            <div className="font-medium">{job.eligible_batches?.join(', ') || 'Any'}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
