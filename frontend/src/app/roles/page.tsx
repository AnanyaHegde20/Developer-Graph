"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { RoleCard } from "@/components/shared/role-card";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { JobRole } from "@/lib/types";

export default function RolesPage() {
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRoles = async (q?: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getRoles(q);
      setRoles(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadRoles(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadRoles(search || undefined), 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Job Roles</h1>
        <p className="text-muted-foreground mt-1">Career paths and role requirements</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search roles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {loading ? (
        <LoadingSkeleton count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadRoles()} />
      ) : roles.length === 0 ? (
        <EmptyState title="No roles found" description={search ? "Try changing your search." : "No roles in the database."} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((r) => (
            <RoleCard key={r.id} role={r} />
          ))}
        </div>
      )}
    </div>
  );
}
