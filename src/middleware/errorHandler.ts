import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  const requestId = req.requestId ?? 'unknown';

  if (err instanceof AppError) {
    logger.warn(err.message, {
      requestId,
      code: err.code,
      statusCode: err.statusCode,
      path: req.path,
      method: req.method,
    });

    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(config.NODE_ENV === 'development' ? { requestId } : {}),
    });
    return;
  }

  logger.error('Unhandled error', {
    requestId,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(500).json({
    success: false,
    error: '服务器内部错误',
    code: 'INTERNAL_ERROR',
    ...(config.NODE_ENV === 'development' ? { requestId } : {}),
  });
}
