interface SkillBadgeProps {
  name: string;
  index?: number;
}

const COLORS = [
  "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
  "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800",
  "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800",
  "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
  "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-900/30 dark:text-fuchsia-300 dark:border-fuchsia-800",
];

export function SkillBadge({ name, index = 0 }: SkillBadgeProps) {
  const colorClass = COLORS[index % COLORS.length];
  
  return (
    <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${colorClass}`}>
      {name}
    </span>
  );
}
