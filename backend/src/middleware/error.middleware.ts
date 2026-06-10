import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${req.method} ${req.path} - ${err.message}`);

  // Error de idempotencia / duplicate key 'idempotencyKey'
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || 'campo';
    res.status(409).json({
      success: false,
      message: `Ya existe un registro con estos datos`,
    });
    return;
  }

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e: any) => e.message);
    res.status(400).json({
      success: false,
      message: 'Error de validación',
      errors: messages,
    });
    return;
  }

  // ObjectId inválido (ej. ID mal formado en la URL)
  if (err.name === 'CastError') {
    res.status(400).json({
      success: false,
      message: `ID inválido: ${err.value}`,
    });
    return;
  }

  // Token JWT inválido o expirado
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Token inválido',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expirado, inicia sesión nuevamente',
    });
    return;
  }

  // Errores de negocio lanzados manualmente con throw new Error()
  if (err instanceof Error) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
    return;
  }

  // Error genérico
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
