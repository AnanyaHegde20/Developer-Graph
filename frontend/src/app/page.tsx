"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/shared/stat-card";
import { SkillBadge } from "@/components/shared/skill-badge";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Code2, FolderOpen, Briefcase, ArrowRight, Network } from "lucide-react";
import Link from "next/link";
import type { Skill, Project, MultiHopResult } from "@/lib/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<{ developers: number; skills: number; projects: number; roles: number } | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [multiHop, setMultiHop] = useState<MultiHopResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [devs, sks, prjs] = await Promise.all([
        api.getDevelopers(),
        api.getSkills(),
        api.getProjects(),
      ]);
      setStats({ developers: devs.length, skills: sks.length, projects: prjs.length, roles: 0 });
      setSkills(sks.slice(0, 12));
      setProjects(prjs.slice(0, 3));

      if (devs.length > 0) {
        try {
          const mh = await api.getMultiHop(devs[0].id);
          setMultiHop(mh.slice(0, 3));
        } catch {}
      }

      try {
        const roles = await api.getRoles();
        setStats((prev) => prev ? { ...prev, roles: roles.length } : null);
      } catch {}
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  if (loading) return <div className="space-y-6"><LoadingSkeleton count={8} /></div>;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground max-w-2xl">
          Explore how developers, skills, projects, technologies and career roles are connected
          through a graph-backed knowledge network.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Developers" value={stats?.developers || 0} icon={Users} description="Active developers" />
        <StatCard title="Skills" value={stats?.skills || 0} icon={Code2} description="Tracked skills" />
        <StatCard title="Projects" value={stats?.projects || 0} icon={FolderOpen} description="Projects in graph" />
        <StatCard title="Job Roles" value={stats?.roles || 0} icon={Briefcase} description="Career paths" />
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Network className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-lg">Explore Developer Graph</h2>
                <p className="text-sm text-muted-foreground">
                  Visualize connections between developers, skills, projects and technologies.
                </p>
              </div>
            </div>
            <Link
              href="/graph"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors sm:ml-auto"
            >
              Open Graph Explorer <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Popular Skills</CardTitle>
              <Link href="/skills" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {skills.length === 0 ? (
              <EmptyState title="No skills found" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {skills.map((s) => (
                  <Link key={s.id} href={`/skills/${s.id}`}>
                    <SkillBadge name={s.name} category={s.category} size="md" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Featured Projects</CardTitle>
              <Link href="/projects" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {projects.length === 0 ? (
              <EmptyState title="No projects found" />
            ) : (
              projects.map((p) => (
                <div key={p.id} className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.description}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {multiHop.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Graph Traversal: Developer → Skill → Project → Technology</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {multiHop.map((mh, i) => (
              <div key={i} className="p-3 border rounded-lg">
                <p className="font-medium text-sm">{mh.projectName}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {mh.matchingSkills.map((s: string) => (
                    <SkillBadge key={s} name={s} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {mh.technologies.map((t: string) => (
                    <SkillBadge key={t} name={t} category="Database" />
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
