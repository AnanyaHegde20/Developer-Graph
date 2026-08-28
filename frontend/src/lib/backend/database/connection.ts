import neo4j, { Driver, Session } from 'neo4j-driver';
import { config } from '@/lib/backend/config';

let driver: Driver | null = null;

export const connectDatabase = async (): Promise<Driver> => {
  if (driver) {
    return driver;
  }

  try {
    driver = neo4j.driver(
      config.cognodb.uri,
      neo4j.auth.basic(config.cognodb.username, config.cognodb.password),
      {
        maxConnectionPoolSize: 50,
        connectionAcquisitionTimeout: 60000,
        disableLosslessIntegers: true,
      }
    );

    // Verify connectivity
    await driver.verifyConnectivity();
    console.log('Connected to CognoDB successfully');

    return driver;
  } catch (error) {
    console.error('Failed to connect to CognoDB:', error);
    throw error;
  }
};

export const getDriver = (): Driver => {
  if (!driver) {
    throw new Error('Database driver not initialized. Call connectDatabase first.');
  }
  return driver;
};

export const getSession = (database?: string): Session => {
  const d = getDriver();
  return d.session({
    database: database || 'neo4j',
    defaultAccessMode: 'WRITE',
  });
};

export const closeDatabase = async (): Promise<void> => {
  if (driver) {
    await driver.close();
    driver = null;
    console.log('Database connection closed');
  }
};