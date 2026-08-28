// Recommendation and analysis queries

// Multi-hop traversal: Developer -> Skill -> Project -> Technology
// This demonstrates graph traversal across 4 node types in a single query
export const DEVELOPER_SKILL_PROJECT_TECHNOLOGY = `
  MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
        <-[:REQUIRES]-(p:Project)-[:USES]->(t:Technology)
  RETURN
    p.id AS projectId,
    p.name AS projectName,
    p.description AS projectDescription,
    collect(DISTINCT s.name) AS matchingSkills,
    collect(DISTINCT t.name) AS technologies
  ORDER BY projectName
`;

// Skill gap analysis: Find skills required by a JobRole that the Developer lacks
// CognoDB does not handle NOT patterns with bound variables in Cartesian products,
// so we fetch both sets and compute the gap in the service layer.

export const GET_DEVELOPER_SKILL_IDS = `
  MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
  RETURN s.id AS skillId
`;

export const GET_ROLE_REQUIRED_SKILLS = `
  MATCH (j:JobRole {id: $roleId})-[:REQUIRES]->(s:Skill)
  RETURN s.id AS skillId, s.name AS skillName, s.category AS skillCategory, s.difficulty AS difficulty
  ORDER BY s.name
`;

// Project recommendations based on developer skills
// Finds projects where developer has matching required skills
export const PROJECT_RECOMMENDATIONS = `
  MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
  WITH d, collect(s.id) AS devSkillIds

  MATCH (p:Project)-[:REQUIRES]->(reqSkill:Skill)
  WHERE reqSkill.id IN devSkillIds
  WITH d, p, count(reqSkill) AS matchingCount, collect(reqSkill.name) AS matchingSkillNames

  RETURN p.id AS projectId,
         p.name AS projectName,
         matchingCount AS matchingSkillCount,
         matchingSkillNames AS matchingSkills
  ORDER BY matchingCount DESC
  LIMIT 10
`;

// Technology usage statistics
export const TECHNOLOGY_USAGE_STATS = `
  MATCH (t:Technology)<-[:USES]-(p:Project)
  WITH t, count(p) AS projectCount

  OPTIONAL MATCH (t)<-[:USES]-(p2:Project)-[:WORKED_ON]-(d:Developer)
  WITH t, projectCount, count(DISTINCT d) AS developerCount

  RETURN t.name AS technologyName,
         t.category AS category,
         projectCount,
         developerCount
  ORDER BY projectCount DESC
`;

// Company skill distribution
export const COMPANY_SKILL_DISTRIBUTION = `
  MATCH (c:Company)<-[:WORKS_AT]-(d:Developer)-[:HAS_SKILL]->(s:Skill)
  WITH c, s, count(d) AS developerCount

  RETURN c.name AS companyName,
         s.name AS skillName,
         s.category AS skillCategory,
         developerCount
  ORDER BY c.name, developerCount DESC
`;
