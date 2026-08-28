"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { SkillBadge } from "@/components/shared/skill-badge";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import type { Skill } from "@/lib/types";

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSkills(q);
      setSkills(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSkills(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadSkills(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    const cat = s.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
        <p className="text-muted-foreground mt-1">Browse skills in the knowledge graph</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search skills..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadSkills()} />
      ) : skills.length === 0 ? (
        <EmptyState title="No skills found" description={search ? "Try changing your search." : "No skills in the database."} />
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((s) => (
                    <Link key={s.id} href={`/skills/${s.id}`}>
                      <SkillBadge name={s.name} category={s.category} size="md" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
