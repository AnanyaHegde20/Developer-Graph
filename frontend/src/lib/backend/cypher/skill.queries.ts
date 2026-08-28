// Skill queries

export const GET_SKILL_BY_ID = `
  MATCH (s:Skill {id: $skillId})
  RETURN s
`;

export const GET_RELATED_SKILLS = `
  MATCH (s:Skill {id: $skillId})-[:RELATED_TO]->(related:Skill)
  RETURN related
  ORDER BY related.name
`;

export const GET_ALL_SKILLS = `
  MATCH (s:Skill)
  RETURN s
  ORDER BY s.name
`;

export const SEARCH_SKILLS = `
  MATCH (s:Skill)
  WHERE toLower(s.name) CONTAINS toLower($searchTerm)
  RETURN s
  ORDER BY s.name
  LIMIT 20
`;

export const GET_SKILLS_BY_CATEGORY = `
  MATCH (s:Skill)
  WHERE s.category = $category
  RETURN s
  ORDER BY s.name
`;
