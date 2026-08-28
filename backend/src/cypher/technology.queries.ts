// Technology queries

export const GET_TECHNOLOGY_BY_ID = `
  MATCH (t:Technology {id: $technologyId})
  RETURN t
`;

export const GET_TECHNOLOGY_PROJECTS = `
  MATCH (p:Project)-[:USES]->(t:Technology {id: $technologyId})
  RETURN p
`;

export const GET_ALL_TECHNOLOGIES = `
  MATCH (t:Technology)
  RETURN t
  ORDER BY t.name
`;

export const SEARCH_TECHNOLOGIES = `
  MATCH (t:Technology)
  WHERE toLower(t.name) CONTAINS toLower($searchTerm)
  RETURN t
  LIMIT 20
`;

export const GET_TECHNOLOGIES_BY_CATEGORY = `
  MATCH (t:Technology)
  WHERE t.category = $category
  RETURN t
  ORDER BY t.name
`;
