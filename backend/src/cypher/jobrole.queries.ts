// Job role queries

export const GET_JOB_ROLE_BY_ID = `
  MATCH (j:JobRole {id: $jobRoleId})
  RETURN j
`;

export const GET_JOB_ROLE_REQUIRED_SKILLS = `
  MATCH (j:JobRole {id: $jobRoleId})-[:REQUIRES]->(s:Skill)
  RETURN s
  ORDER BY s.name
`;

export const GET_ALL_JOB_ROLES = `
  MATCH (j:JobRole)
  RETURN j
  ORDER BY j.title
`;

export const SEARCH_JOB_ROLES = `
  MATCH (j:JobRole)
  WHERE toLower(j.title) CONTAINS toLower($searchTerm)
     OR toLower(j.description) CONTAINS toLower($searchTerm)
  RETURN j
  ORDER BY j.title
  LIMIT 20
`;
