import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: "How to Crack Off-Campus Hiring in 2026: The Ultimate Playbook",
      slug: "crack-off-campus-hiring-2026",
      category: "Career Strategy",
      readTime: "6 min read",
      date: "Sep 08, 2026",
      summary: "Most candidates apply weeks after a job is published when hundreds of applicants are already in the pipeline. Here is how applying within the first 1 hour via ATS triggers increases shortlisting odds by 5x.",
      tags: ["Off Campus", "Freshers", "Hiring"]
    },
    {
      id: 2,
      title: "Top 50 SQL Query Questions Asked in Data Analyst & Engineering Rounds",
      slug: "top-50-sql-questions-data-analyst",
      category: "Interview Prep",
      readTime: "10 min read",
      date: "Sep 05, 2026",
      summary: "A comprehensive breakdown of CTEs, Window Functions (ROW_NUMBER, DENSE_RANK), joins, and optimization questions commonly tested in technical assessments.",
      tags: ["SQL", "Data Analyst", "Interview"]
    },
    {
      id: 3,
      title: "Demystifying Company ATS: How Greenhouse, Lever & Ashby Screen Your Resume",
      slug: "demystifying-company-ats-greenhouse-lever",
      category: "Tech Guide",
      readTime: "8 min read",
      date: "Aug 29, 2026",
      summary: "Learn what really happens when your resume enters an Applicant Tracking System. Discover formatting rules, keyword density matching, and common myths.",
      tags: ["ATS", "Resume", "Tech Jobs"]
    },
    {
      id: 4,
      title: "DSA Roadmap for Product Companies: What Freshers Must Master",
      slug: "dsa-roadmap-product-companies",
      category: "Coding",
      readTime: "7 min read",
      date: "Aug 22, 2026",
      summary: "Which data structures matter most for junior SDE roles? Master binary search, two pointers, trees, and graphs without getting stuck in the dynamic programming trap.",
      tags: ["DSA", "LeetCode", "SDE"]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Engineering & Career Insights
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
            JobPulse Career Blog
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-base">
            Tactical guides on ATS hiring, coding interviews, and fresh opportunities for engineering students and tech professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-all dark:bg-slate-900 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <CardContent className="p-7 flex flex-col h-full">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <span className="font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-200 dark:border-teal-800">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 transition-colors mb-3 leading-snug">
                    {article.title}
                  </h2>

                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    {article.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 inline-flex items-center gap-1 hover:underline cursor-pointer">
                    Read Guide <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
