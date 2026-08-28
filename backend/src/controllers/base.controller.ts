import { Request, Response } from 'express';

export abstract class BaseController {
  protected sendSuccess(res: Response, data: any, statusCode: number = 200): void {
    res.status(statusCode).json({
      success: true,
      data,
    });
  }

  protected sendError(res: Response, error: string | Error, statusCode: number = 500): void {
    const message = error instanceof Error ? error.message : error;
    res.status(statusCode).json({
      success: false,
      error: message,
    });
  }

  protected sendNotFound(res: Response, resource: string): void {
    res.status(404).json({
      success: false,
      error: `${resource} not found`,
    });
  }
}
