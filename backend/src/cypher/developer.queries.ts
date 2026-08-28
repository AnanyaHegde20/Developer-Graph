// Developer queries

export const GET_DEVELOPER_BY_ID = `
  MATCH (d:Developer {id: $developerId})
  RETURN d
`;

export const GET_DEVELOPER_SKILLS = `
  MATCH (d:Developer {id: $developerId})-[:HAS_SKILL]->(s:Skill)
  RETURN s
  ORDER BY s.name
`;

export const GET_DEVELOPER_PROJECTS = `
  MATCH (d:Developer {id: $developerId})-[:WORKED_ON]->(p:Project)
  RETURN p
  ORDER BY p.startDate DESC
`;

export const GET_DEVELOPER_COMPANIES = `
  MATCH (d:Developer {id: $developerId})-[:WORKS_AT]->(c:Company)
  RETURN c
`;

export const GET_DEVELOPER_JOB_TARGETS = `
  MATCH (d:Developer {id: $developerId})-[:TARGETS]->(j:JobRole)
  RETURN j
`;

export const GET_DEVELOPER_SUMMARY = `
  MATCH (d:Developer {id: $developerId})
  OPTIONAL MATCH (d)-[:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (d)-[:WORKED_ON]->(p:Project)
  OPTIONAL MATCH (d)-[:TARGETS]->(j:JobRole)
  OPTIONAL MATCH (d)-[:WORKS_AT]->(c:Company)
  RETURN d,
         collect(DISTINCT s) AS skills,
         collect(DISTINCT p) AS projects,
         collect(DISTINCT j) AS targetRoles,
         collect(DISTINCT c) AS companies
`;

export const GET_ALL_DEVELOPERS = `
  MATCH (d:Developer)
  RETURN d
  ORDER BY d.name
`;

export const SEARCH_DEVELOPERS = `
  MATCH (d:Developer)
  WHERE toLower(d.name) CONTAINS toLower($searchTerm)
     OR toLower(d.email) CONTAINS toLower($searchTerm)
  RETURN d
  ORDER BY d.name
  LIMIT 20
`;
