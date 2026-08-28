"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { SkillBadge } from "@/components/shared/skill-badge";
import { ProjectCard } from "@/components/shared/project-card";
import { GraphVisualization } from "@/components/shared/graph-viz";
import { LoadingSkeleton } from "@/components/shared/loading";
import { ErrorState, EmptyState } from "@/components/shared/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Building2, Target, CheckCircle2, XCircle, Briefcase } from "lucide-react";
import Link from "next/link";
import type { Developer, Skill, Project, JobRole, SkillGap, ProjectRecommendation } from "@/lib/types";

export default function DeveloperDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [summary, setSummary] = useState<{ developer: Developer; skills: Skill[]; projects: Project[]; targetRoles: JobRole[]; companies: { id: string; name: string }[] } | null>(null);
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
  const [roles, setRoles] = useState<JobRole[]>([]);
  const [skillGap, setSkillGap] = useState<SkillGap[] | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [gapLoading, setGapLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [sum, recs, rls] = await Promise.all([
        api.getDeveloper(id),
        api.getDeveloperRecommendations(id),
        api.getRoles(),
      ]);
      setSummary(sum);
      setRecommendations(recs);
      setRoles(rls);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load developer");
    } finally {
      setLoading(false);
    }
  };

  const loadSkillGap = async (roleId: string) => {
    setSelectedRole(roleId);
    setGapLoading(true);
    try {
      const gap = await api.getSkillGap(id, roleId);
      setSkillGap(gap);
    } catch {
      setSkillGap([]);
    } finally {
      setGapLoading(false);
    }
  };

  useEffect(() => { if (id) loadData(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) return <div className="space-y-6"><LoadingSkeleton count={4} /></div>;
  if (error) return <ErrorState message={error} onRetry={loadData} />;
  if (!summary) return <EmptyState title="Developer not found" />;

  const { developer, skills, projects, targetRoles, companies } = summary;

  return (
    <div className="space-y-6">
      <Link href="/developers" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Developers
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{developer.name}</h1>
        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
          {developer.location && (
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {developer.location}</span>
          )}
          {developer.yearsExperience && (
            <span>{developer.yearsExperience} years experience</span>
          )}
          {companies.length > 0 && (
              <span className="flex items-center gap-1">
              <Building2 className="h-3 w-3" /> {companies.map((c) => c.name).join(", ")}
            </span>
          )}
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="skill-gap">Skill Gap</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Skills ({skills.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <EmptyState title="No skills" />
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

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Projects ({projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <EmptyState title="No projects" />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {projects.map((p) => (
                    <div key={p.id} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-1">{p.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Target Roles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Target Job Roles ({targetRoles.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {targetRoles.length === 0 ? (
                <EmptyState title="No target roles set" />
              ) : (
                <div className="space-y-2">
                  {targetRoles.map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{r.title}</p>
                        <p className="text-xs text-muted-foreground">{r.description}</p>
                      </div>
                      {r.level && <Badge variant="outline">{r.level}</Badge>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="skill-gap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" /> Skill Gap Analysis
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Compare your skills against a target job role. See what you have and what you need.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedRole} onValueChange={(v) => { if (v) loadSkillGap(v); }}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select a target job role..." />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {gapLoading && (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              )}

              {!gapLoading && selectedRole && skillGap !== null && (
                <div className="space-y-6">
                  {(() => {
                    const matchedSkills = skills.filter((s) => !skillGap.some((g) => g.skillId === s.id));
                    const matchPercent = matchedSkills.length + skillGap.length > 0
                      ? Math.round((matchedSkills.length / (matchedSkills.length + skillGap.length)) * 100)
                      : 0;

                    return (
                      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-primary">{matchPercent}%</p>
                          <p className="text-xs text-muted-foreground">Match</p>
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all"
                              style={{ width: `${matchPercent}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {matchedSkills.length} of {matchedSkills.length + skillGap.length} skills matched
                          </p>
                        </div>
                      </div>
                    );
                  })()}

                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      Your Skills
                      <Badge variant="secondary" className="ml-1">
                        {skills.filter((s) => !skillGap.some((g) => g.skillId === s.id)).length}
                      </Badge>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {skills
                        .filter((s) => !skillGap.some((g) => g.skillId === s.id))
                        .map((s) => (
                          <div key={s.id} className="flex items-center gap-1.5 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 font-medium">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            {s.name}
                          </div>
                        ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Missing Skills
                      <Badge variant="outline" className="ml-1 border-red-200 text-red-700">
                        {skillGap.length}
                      </Badge>
                    </h4>
                    {skillGap.length === 0 ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                        <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-green-800">You have all required skills for this role!</p>
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {skillGap.map((g) => (
                          <div key={g.skillId} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 font-medium">
                            <XCircle className="h-4 w-4 text-red-500" />
                            {g.skillName}
                            <span className="text-xs text-red-500 ml-1">({g.skillCategory})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!selectedRole && !gapLoading && (
                <div className="py-8 text-center">
                  <Target className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Select a job role above to see your skill gaps.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Briefcase className="h-5 w-5" /> Recommended Projects
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Projects that match your skills, sorted by skill match count.
              </p>
            </CardHeader>
            <CardContent>
              {recommendations.length === 0 ? (
                <EmptyState title="No recommendations" description="No projects match your current skills." />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.map((r) => (
                    <ProjectCard key={r.projectId} project={r} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graph" className="space-y-6">
          <GraphVisualization developerId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
