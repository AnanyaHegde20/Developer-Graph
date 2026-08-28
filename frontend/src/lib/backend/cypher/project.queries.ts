// Project queries

export const GET_PROJECT_BY_ID = `
  MATCH (p:Project {id: $projectId})
  RETURN p
`;

export const GET_PROJECT_TECHNOLOGIES = `
  MATCH (p:Project {id: $projectId})-[:USES]->(t:Technology)
  RETURN t
`;

export const GET_PROJECT_REQUIRED_SKILLS = `
  MATCH (p:Project {id: $projectId})-[:REQUIRES]->(s:Skill)
  RETURN s
`;

export const GET_PROJECT_DEVELOPERS = `
  MATCH (d:Developer)-[:WORKED_ON]->(p:Project {id: $projectId})
  RETURN d
`;

export const GET_ALL_PROJECTS = `
  MATCH (p:Project)
  RETURN p
  ORDER BY p.startDate DESC
`;

export const SEARCH_PROJECTS = `
  MATCH (p:Project)
  WHERE toLower(p.name) CONTAINS toLower($searchTerm)
     OR toLower(p.description) CONTAINS toLower($searchTerm)
  RETURN p
  ORDER BY p.name
  LIMIT 20
`;
