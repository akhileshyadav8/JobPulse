import Link from "next/link";
import { MapPin, Clock, Briefcase, GraduationCap, Building2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Job } from "@/lib/api";
import { formatSalary, formatRelativeTime, formatDate, getWorkModeColor, getEmploymentTypeColor } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <CardContent className="p-5 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-400 font-bold text-xl flex-shrink-0">
              {job.company.name.charAt(0)}
            </div>
            <div>
              <Link href={`/jobs/${job.slug}`} className="group">
                <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {job.title}
                </h3>
              </Link>
              <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                <Building2 className="w-4 h-4 mr-1" />
                <span className="line-clamp-1">{job.company.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {job.location.map((loc, i) => (
            <div key={i} className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3 h-3 mr-1" />
              {loc}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge 
            title={job.salary_basis || "Based on company's past hiring records and role market benchmarks"}
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 font-semibold shadow-xs flex items-center gap-1 cursor-help"
          >
            <span>💰 {formatSalary(job.salary_min, job.salary_max, job.salary_currency, job.salary_period, true)}</span>
          </Badge>
          <Badge className={getEmploymentTypeColor(job.employment_type)}>
            {job.employment_type}
          </Badge>
          <Badge className={getWorkModeColor(job.work_mode)}>
            {job.work_mode}
          </Badge>
        </div>

        {job.eligible_batches && job.eligible_batches.length > 0 && (
          <div className="flex items-center gap-2 mb-2 text-xs text-slate-500 dark:text-slate-400">
            <GraduationCap className="w-4 h-4" />
            <span>Batch: {job.eligible_batches.join(', ')}</span>
          </div>
        )}

        {job.deadline ? (
          <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-md border border-amber-200 dark:border-amber-800/60 w-fit">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Deadline: {formatDate(job.deadline)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 mb-4 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/60 w-fit">
            <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>🔥 Apply ASAP (Rolling Hiring)</span>
          </div>
        )}

        {job.skills_required && job.skills_required.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto">
            {job.skills_required.slice(0, 4).map((skill, i) => (
              <span key={i} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                {skill}
              </span>
            ))}
            {job.skills_required.length > 4 && (
              <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                +{job.skills_required.length - 4}
              </span>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-5 pt-0 mt-auto flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400" suppressHydrationWarning>
          <Clock className="w-3.5 h-3.5 mr-1" />
          <span suppressHydrationWarning>{formatRelativeTime(job.posted_at || job.first_seen_at)}</span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/jobs/${job.slug}`}
            className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Details
          </Link>
          {job.apply_url && (
            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-3 py-1.5 text-sm font-medium rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors"
            >
              Apply
            </a>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
