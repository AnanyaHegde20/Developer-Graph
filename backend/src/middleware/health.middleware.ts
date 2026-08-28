import { Request, Response, NextFunction } from 'express';
import { getDriver } from '../database/connection';

export const healthCheck = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const driver = getDriver();
    const session = driver.session();
    
    try {
      await session.run('RETURN 1');
      await session.close();
      
      res.status(200).json({
        status: 'healthy',
        database: 'connected',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      await session.close();
      throw error;
    }
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  }
};
