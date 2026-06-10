import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { ReservationService } from '../services/reservation.service';

const reservationService = new ReservationService();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, classId, idempotencyKey } = req.body;
    const reservationCreate = await reservationService.createReservation(userId, classId, idempotencyKey);

    // Validación básica de creacion
    if (!reservationCreate) {
      return res.status(400).json({ error: 'No se pudo crear la reversa' });
    }

    const reservation = await reservationService.getOneReservationsByUser(userId, classId);

    res.status(201).json(reservation.map(c => c.toDTO()));
  } catch (error: any) {
    next(error);
  }
};

export const cancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservationId = req.params.reservationId as string;

    // Validación básica de presencia
    if (!reservationId) {
      return res.status(400).json({ error: 'reservationId es requerido' });
    }
    
    const result = await reservationService.cancelReservation(reservationId);
    res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const getByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId as string;

    // 1. Validación de formato de ID
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Formato de ID de usuario inválido' });
    }

    const reservations = await reservationService.getReservationsByUser(userId);

    // 2. Validar array vacío
    if (reservations.length === 0) {
      return res.status(404).json({ message: 'No se encontraron reservas para este usuario' });
    }

    res.status(200).json(reservations.map(c => c.toDTO()));
  } catch (error: any) {
    next(error);
  }
};

export const getAllReservations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reservations = await reservationService.getAllReservations();

    const reservationsDTO = reservations.map(r => r.toDTO());

    res.json(reservationsDTO);
  } catch (error: any) {
    next(error);
  }
};