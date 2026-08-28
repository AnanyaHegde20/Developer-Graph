import { Session } from 'neo4j-driver';
import { getSession } from '../database/connection';

export class DatabaseService {
  protected async runQuery(cypher: string, params: Record<string, any> = {}): Promise<any> {
    const session = getSession();
    try {
      return await session.run(cypher, params);
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  protected extractRecords<T>(result: any, fieldName: string): T[] {
    return result.records.map((record: any) => record.get(fieldName).properties as T);
  }

  protected extractSingleRecord<T>(result: any, fieldName: string): T | null {
    if (result.records.length === 0) {
      return null;
    }
    return result.records[0].get(fieldName).properties as T;
  }

  protected extractField<T>(result: any, fieldName: string): T[] {
    return result.records.map((record: any) => record.get(fieldName) as T);
  }
}
