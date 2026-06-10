import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';

export const validateCreateReservation = (req: Request, res: Response, next: NextFunction) => {
  const { userId, classId, idempotencyKey } = req.body;

  if (!userId || !Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'ID de usuario inválido' });
  }
  if (!classId || !Types.ObjectId.isValid(classId)) {
    return res.status(400).json({ error: 'ID de clase inválido' });
  }
  if (!idempotencyKey) {
    return res.status(400).json({ error: 'El campo "idempotencyKey" es requerido' });
  }
  next();
};