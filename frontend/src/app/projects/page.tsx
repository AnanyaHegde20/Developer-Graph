"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ProjectCard } from "@/components/shared/project-card";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Project } from "@/lib/types";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProjects(q);
      setProjects(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProjects(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground mt-1">Explore projects in the graph</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadProjects()} />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects found" description={search ? "Try changing your search." : "No projects in the database."} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
