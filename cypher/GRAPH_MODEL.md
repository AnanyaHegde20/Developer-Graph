# DevGraph Graph Data Model

## Overview

DevGraph models relationships between developers, skills, projects, technologies, job roles, and companies using a graph database. This allows for efficient traversal of complex relationships and powerful recommendation queries.

## Node Labels

### Developer
- `id`: Unique identifier (UUID)
- `name`: Full name
- `email`: Email address
- `bio`: Short biography
- `yearsExperience`: Years of professional experience
- `location`: City/region
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Skill
- `id`: Unique identifier (UUID)
- `name`: Skill name (e.g., "JavaScript", "React")
- `category`: Skill category (e.g., "Programming Language", "Frontend Framework")
- `description`: Skill description
- `difficulty`: Difficulty level (beginner, intermediate, advanced)
- `createdAt`: Creation timestamp

### Technology
- `id`: Unique identifier (UUID)
- `name`: Technology name
- `category`: Technology category (e.g., "Frontend", "Backend", "Database")
- `description`: Technology description
- `website`: Official website URL
- `createdAt`: Creation timestamp

### Project
- `id`: Unique identifier (UUID)
- `name`: Project name
- `description`: Project description
- `startDate`: Project start date
- `endDate`: Project end date (optional)
- `status`: Project status (active, completed, archived)
- `repositoryUrl`: Git repository URL
- `createdAt`: Creation timestamp

### JobRole
- `id`: Unique identifier (UUID)
- `title`: Job title
- `description`: Job description
- `level`: Job level (junior, mid, senior, lead, principal)
- `averageSalary`: Average salary for this role
- `createdAt`: Creation timestamp

### Company
- `id`: Unique identifier (UUID)
- `name`: Company name
- `industry`: Industry sector
- `size`: Company size (startup, small, medium, large, enterprise)
- `location`: Headquarters location
- `website`: Company website
- `createdAt`: Creation timestamp

## Relationship Types

### Developer Relationships
- `Developer -[:HAS_SKILL]-> Skill`
  - Indicates a developer possesses a skill
  - Properties: None (relationship is binary)

- `Developer -[:WORKED_ON]-> Project`
  - Indicates a developer has worked on a project
  - Properties: None

- `Developer -[:TARGETS]-> JobRole`
  - Indicates a developer is targeting a specific job role
  - Properties: None

- `Developer -[:WORKS_AT]-> Company`
  - Indicates a developer works at a company
  - Properties: None

### Project Relationships
- `Project -[:USES]-> Technology`
  - Indicates a project uses a specific technology
  - Properties: None

- `Project -[:REQUIRES]-> Skill`
  - Indicates a project requires specific skills
  - Properties: None

### JobRole Relationships
- `JobRole -[:REQUIRES]-> Skill`
  - Indicates a job role requires specific skills
  - Properties: None

### Skill Relationships
- `Skill -[:RELATED_TO]-> Skill`
  - Indicates two skills are related (e.g., JavaScript -> TypeScript)
  - Properties: None

## Graph Traversal Patterns

### 1. Developer Skills
```
Developer -[:HAS_SKILL]-> Skill
```

### 2. Developer Projects
```
Developer -[:WORKED_ON]-> Project
```

### 3. Multi-hop Traversal (Developer -> Skill -> Project -> Technology)
```
Developer -[:HAS_SKILL]-> Skill <-[:REQUIRES]- Project -[:USES]-> Technology
```

### 4. Skill Gap Analysis
```
// Required skills for target job
Developer -[:TARGETS]-> JobRole -[:REQUIRES]-> RequiredSkill

// Current developer skills
Developer -[:HAS_SKILL]-> CurrentSkill

// Compare and find gaps
```

### 5. Project Recommendations
```
Developer -[:HAS_SKILL]-> Skill <-[:REQUIRES]- Project

// Match developer skills with project requirements
```

### 6. Related Skills
```
Skill -[:RELATED_TO]-> RelatedSkill
```

## Indexes

For optimal query performance, create indexes on:

```cypher
// Node ID indexes
CREATE INDEX FOR (d:Developer) ON (d.id);
CREATE INDEX FOR (s:Skill) ON (s.id);
CREATE INDEX FOR (p:Project) ON (p.id);
CREATE INDEX FOR (t:Technology) ON (t.id);
CREATE INDEX FOR (j:JobRole) ON (j.id);
CREATE INDEX FOR (c:Company) ON (c.id);

// Property indexes for search
CREATE INDEX FOR (d:Developer) ON (d.name);
CREATE INDEX FOR (s:Skill) ON (s.name);
CREATE INDEX FOR (p:Project) ON (p.name);
CREATE INDEX FOR (t:Technology) ON (t.name);
CREATE INDEX FOR (j:JobRole) ON (j.title);
CREATE INDEX FOR (c:Company) ON (c.name);
```

## Example Queries

### Get Developer Skills
```cypher
MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
RETURN s
ORDER BY s.name
```

### Multi-hop Traversal
```cypher
MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
      <-[:REQUIRES]-(p:Project)-[:USES]->(t:Technology)
RETURN DISTINCT
  s.name AS skillName,
  p.name AS projectName,
  t.name AS technologyName
```

### Skill Gap Analysis
```cypher
MATCH (d:Developer {id: $developerId})-[:TARGETS]->(j:JobRole)-[:REQUIRES]->(required:Skill)
WITH d, j, collect(required) AS requiredSkills
MATCH (d)-[:HAS_SKILL]->(current:Skill)
WITH d, j, requiredSkills, collect(current) AS currentSkills
UNWIND requiredSkills AS reqSkill
OPTIONAL MATCH (currentSkill)-[:RELATED_TO*0..2]->(reqSkill)
  WHERE currentSkill IN currentSkills
RETURN j.title AS targetJobRole,
       reqSkill.name AS requiredSkill,
       CASE WHEN currentSkill IS NOT NULL THEN true ELSE false END AS hasRelatedSkill
```

### Project Recommendations
```cypher
MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
WITH d, collect(s.id) AS skillIds
MATCH (p:Project)-[:REQUIRES]->(reqSkill:Skill)
WHERE reqSkill.id IN skillIds
WITH d, p, count(reqSkill) AS matchingSkills
MATCH (p)-[:REQUIRES]->(allRequired:Skill)
WITH d, p, matchingSkills, count(allRequired) AS totalRequired
WITH d, p, toFloat(matchingSkills) / totalRequired AS matchRatio
WHERE matchRatio >= 0.3
RETURN p.name AS projectName,
       round(matchRatio * 100, 2) AS matchPercentage
ORDER BY matchPercentage DESC
```

## Design Decisions

1. **UUID IDs**: Using UUIDs ensures stable identifiers that don't depend on database auto-increment.

2. **MERGE for Seed Data**: All seed queries use MERGE to prevent duplicate data on multiple runs.

3. **No Properties on Relationships**: Keeping relationships simple and binary. If properties are needed, they can be added later.

4. **Bidirectional Skill Relationships**: Using `RELATED_TO` for skill similarity allows traversal in both directions.

5. **Separate Node Types**: Each entity type has its own label for clear querying and indexing.
