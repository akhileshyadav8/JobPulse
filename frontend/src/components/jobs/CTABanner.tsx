import { Button } from "@/components/ui/button";
import { Job } from "@/lib/api";
import { formatDistanceToNow } from "date-fns";

export function CTABanner({ job }: { job: Job }) {
  if (!job.apply_url) return null;
  
  const timeLeft = job.deadline ? formatDistanceToNow(new Date(job.deadline)) : null;

  return (
    <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-xl p-6 mb-6 text-center shadow-sm">
      <div className="text-3xl mb-2">🔥</div>
      <h3 className="text-xl font-bold text-teal-900 dark:text-teal-100 mb-2">Don&apos;t miss this opportunity!</h3>
      {timeLeft && (
        <p className="text-teal-700 dark:text-teal-300 mb-6">
          Apply before deadline — {timeLeft} left!
        </p>
      )}
      <a
        href={job.apply_url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-3 rounded-lg transition-colors"
      >
        ✅ Apply on Official Website →
      </a>
    </div>
  );
}
