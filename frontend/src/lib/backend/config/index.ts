export const config = {
  cognodb: {
    uri: process.env.COGNODB_URI || 'neo4j+s://localhost:7687',
    username: process.env.COGNODB_USERNAME || 'cognodb',
    password: process.env.COGNODB_PASSWORD || '',
  },
  server: {
    port: parseInt(process.env.PORT || '5000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
};