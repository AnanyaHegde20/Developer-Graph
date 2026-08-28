"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { GraphVisualization } from "@/components/shared/graph-viz";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Network, User, Code2, FolderOpen, Briefcase, Database } from "lucide-react";
import type { Developer } from "@/lib/types";

interface NodeInfo {
  id: string;
  label: string;
  type: string;
  details?: Record<string, string>;
}

const TYPE_ICONS: Record<string, typeof User> = {
  Developer: User,
  Skill: Code2,
  Project: FolderOpen,
  JobRole: Briefcase,
  Technology: Database,
};

const TYPE_COLORS: Record<string, string> = {
  Developer: "bg-blue-100 text-blue-800",
  Skill: "bg-emerald-100 text-emerald-800",
  Project: "bg-amber-100 text-amber-800",
  JobRole: "bg-red-100 text-red-800",
  Technology: "bg-purple-100 text-purple-800",
};

export default function GraphExplorerPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [search, setSearch] = useState("");
  const [selectedDevId, setSelectedDevId] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const devs = await api.getDevelopers();
        setDevelopers(devs);
        if (devs.length > 0) {
          setSelectedDevId(devs[0].id);
        }
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Failed to load developers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = developers.filter(
    (d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="space-y-6"><LoadingSkeleton count={4} /></div>;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Network className="h-8 w-8" /> Explore Developer Graph
        </h1>
        <p className="text-muted-foreground mt-1">
          Discover how developers, skills, projects, technologies and career roles are connected.
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Select Developer</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search developers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {filtered.length === 0 ? (
              <EmptyState title="No developers found" />
            ) : (
              filtered.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setSelectedDevId(d.id); setSelectedNode(null); }}
                  className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                    selectedDevId === d.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <p className="font-medium">{d.name}</p>
                  <p className="text-xs opacity-70">{d.email}</p>
                </button>
              ))
            )}
          </div>

          {selectedNode && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  {(() => {
                    const Icon = TYPE_ICONS[selectedNode.type] || User;
                    return <Icon className="h-4 w-4" />;
                  })()}
                  Selected Node
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{selectedNode.label}</p>
                  <Badge variant="outline" className={TYPE_COLORS[selectedNode.type] || ""}>
                    {selectedNode.type}
                  </Badge>
                </div>
                {selectedNode.details && Object.keys(selectedNode.details).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Connections</p>
                    {Object.entries(selectedNode.details).map(([relation, name]) => (
                      <div key={relation} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{relation}</span>
                        <span className="font-medium">{name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          {selectedDevId ? (
            <GraphVisualization
              developerId={selectedDevId}
              onNodeSelect={setSelectedNode}
              selectedNode={selectedNode}
              height={600}
            />
          ) : (
            <Card className="flex items-center justify-center min-h-[600px]">
              <EmptyState
                title="Select a developer"
                description="Choose a developer from the list to explore their graph connections."
              />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
