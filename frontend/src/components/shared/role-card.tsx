import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { JobRole } from "@/lib/types";

export function RoleCard({ role }: { role: JobRole }) {
  const levelColors: Record<string, string> = {
    junior: "bg-green-100 text-green-800",
    mid: "bg-blue-100 text-blue-800",
    senior: "bg-purple-100 text-purple-800",
    lead: "bg-amber-100 text-amber-800",
    principal: "bg-red-100 text-red-800",
  };

  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{role.title}</CardTitle>
          {role.level && (
            <Badge variant="outline" className={levelColors[role.level] || ""}>
              {role.level}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
        {role.averageSalary && (
          <p className="text-sm font-medium">
            Avg. ${(role.averageSalary / 1000).toFixed(0)}k
          </p>
        )}
      </CardContent>
    </Card>
  );
}
