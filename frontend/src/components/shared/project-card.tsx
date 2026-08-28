import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkillBadge } from "./skill-badge";

interface ProjectCardData {
  name?: string;
  projectName?: string;
  description?: string;
  status?: string;
  matchingSkills?: string[];
  matchingSkillCount?: number;
  technologies?: string[];
  id?: string;
}

export function ProjectCard({ project }: { project: ProjectCardData }) {
  const projectName = project.name || project.projectName || "Untitled";
  return (
    <Card className="hover:shadow-md transition-shadow h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{projectName}</CardTitle>
          {project.status && (
            <span className={`text-xs px-2 py-1 rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' : project.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
              {project.status}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {project.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
        )}
        {project.matchingSkills && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">
              Your matching skills ({project.matchingSkillCount || project.matchingSkills.length})
            </p>
            <div className="flex flex-wrap gap-1">
              {project.matchingSkills.map((s) => (
                <SkillBadge key={s} name={s} />
              ))}
            </div>
          </div>
        )}
        {project.technologies && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Technologies</p>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((t) => (
                <SkillBadge key={t} name={t} />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
