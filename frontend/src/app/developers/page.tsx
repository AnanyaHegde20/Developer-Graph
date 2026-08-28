"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DeveloperCard } from "@/components/shared/developer-card";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Developer } from "@/lib/types";

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDevelopers = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDevelopers(q);
      setDevelopers(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load developers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDevelopers(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDevelopers(search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Developers</h1>
        <p className="text-muted-foreground mt-1">Browse and search the developer network</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search developers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading ? (
        <LoadingSkeleton count={6} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadDevelopers()} />
      ) : developers.length === 0 ? (
        <EmptyState title="No developers found" description={search ? "Try changing your search." : "No developers in the database."} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {developers.map((dev) => (
            <DeveloperCard key={dev.id} developer={dev} />
          ))}
        </div>
      )}
    </div>
  );
}
