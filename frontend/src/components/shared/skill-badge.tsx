import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  "Programming Language": "bg-blue-100 text-blue-800 border-blue-200",
  "Frontend Framework": "bg-purple-100 text-purple-800 border-purple-200",
  "Backend Runtime": "bg-green-100 text-green-800 border-green-200",
  "Backend Framework": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Database": "bg-amber-100 text-amber-800 border-amber-200",
  "Cloud Platform": "bg-orange-100 text-orange-800 border-orange-200",
  "DevOps Tool": "bg-red-100 text-red-800 border-red-200",
  "DevOps Practice": "bg-rose-100 text-rose-800 border-rose-200",
  "API Technology": "bg-cyan-100 text-cyan-800 border-cyan-200",
  "AI/ML": "bg-indigo-100 text-indigo-800 border-indigo-200",
  "Version Control": "bg-slate-100 text-slate-800 border-slate-200",
  "Methodology": "bg-teal-100 text-teal-800 border-teal-200",
  "Architecture": "bg-violet-100 text-violet-800 border-violet-200",
};

export function SkillBadge({ name, category, size = "sm" }: { name: string; category?: string; size?: "sm" | "md" }) {
  const colorClass = category ? categoryColors[category] || "bg-gray-100 text-gray-800 border-gray-200" : "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <Badge variant="outline" className={cn(colorClass, size === "md" ? "px-3 py-1 text-sm" : "px-2 py-0.5 text-xs")}>
      {name}
    </Badge>
  );
}
