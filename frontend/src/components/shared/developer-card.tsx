import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Developer } from "@/lib/types";

export function DeveloperCard({ developer }: { developer: Developer & { skills?: { id: string; name: string }[] } }) {
  return (
    <Link href={`/developers/${developer.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{developer.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{developer.email}</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {developer.location && (
            <p className="text-sm text-muted-foreground">{developer.location}</p>
          )}
          {developer.yearsExperience && (
            <p className="text-sm">{developer.yearsExperience} years experience</p>
          )}
          {developer.skills && (
            <div className="flex flex-wrap gap-1 mt-2">
              {developer.skills.slice(0, 4).map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs">
                  {s.name}
                </Badge>
              ))}
              {developer.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{developer.skills.length - 4}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
