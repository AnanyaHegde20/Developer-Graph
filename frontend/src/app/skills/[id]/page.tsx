"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { SkillBadge } from "@/components/shared/skill-badge";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Link2 } from "lucide-react";
import Link from "next/link";
import type { Skill } from "@/lib/types";

export default function SkillDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [related, setRelated] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [s, rel] = await Promise.all([
        api.getSkill(id),
        api.getRelatedSkills(id),
      ]);
      setSkill(s);
      setRelated(rel);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load skill");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (id) loadData(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="space-y-6"><LoadingSkeleton count={3} /></div>;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!skill) return <EmptyState title="Skill not found" />;

  return (
    <div className="space-y-6">
      <Link href="/skills" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Skills
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">{skill.name}</h1>
        <div className="flex items-center gap-3 mt-2">
          <SkillBadge name={skill.category} category={skill.category} size="md" />
          {skill.difficulty && (
            <span className="text-sm text-muted-foreground capitalize">{skill.difficulty}</span>
          )}
        </div>
        {skill.description && (
          <p className="text-muted-foreground mt-3">{skill.description}</p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Link2 className="h-5 w-5" /> Related Skills ({related.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {related.length === 0 ? (
            <EmptyState title="No related skills" />
          ) : (
            <div className="flex flex-wrap gap-2">
              {related.map((s) => (
                <Link key={s.id} href={`/skills/${s.id}`}>
                  <SkillBadge name={s.name} category={s.category} size="md" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
