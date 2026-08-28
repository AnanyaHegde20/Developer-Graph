// Company queries

export const GET_COMPANY_BY_ID = `
  MATCH (c:Company {id: $companyId})
  RETURN c
`;

export const GET_COMPANY_DEVELOPERS = `
  MATCH (d:Developer)-[:WORKS_AT]->(c:Company {id: $companyId})
  RETURN d
`;

export const GET_ALL_COMPANIES = `
  MATCH (c:Company)
  RETURN c
  ORDER BY c.name
`;

export const SEARCH_COMPANIES = `
  MATCH (c:Company)
  WHERE toLower(c.name) CONTAINS toLower($searchTerm)
  RETURN c
  LIMIT 20
`;
