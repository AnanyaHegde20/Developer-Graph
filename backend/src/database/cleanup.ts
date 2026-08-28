import { connectDatabase, getSession, closeDatabase } from './connection';

const cleanup = async (): Promise<void> => {
  await connectDatabase();
  const session = getSession();

  try {
    await session.run('MATCH (n) DETACH DELETE n');
    console.log('All nodes and relationships deleted.');
  } catch (error) {
    console.error('Cleanup failed:', error);
    throw error;
  } finally {
    await session.close();
  }
};

if (require.main === module) {
  connectDatabase()
    .then(() => cleanup())
    .then(() => closeDatabase())
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
