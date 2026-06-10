import { Request, Response, NextFunction } from 'express';
import { ClassService } from '../services/class.service';

const classService = new ClassService();

export const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await classService.getAllClass() ; // Obtiene todas las clases
    res.json(classes);
  } catch (error: any) {
    next(error);
  }
};
