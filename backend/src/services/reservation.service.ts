import { Class } from '../models/class.model';
import { User } from '../models/user.model';
import { Reservation } from '../models/reservation.model';
import { sseService } from './sse.service';
import { Types } from 'mongoose';

export class ReservationService {

  // Crear Reserva
  async createReservation(userId: string, classId: string, idempotencyKey: string) {
    // 1. Verificación de existencia (Validación de negocio)
    const [userExists, classExists] = await Promise.all([
      User.exists({ _id: userId }),
      Class.exists({ _id: classId })
    ]);

    if (!userExists) {
      throw new Error('El usuario no existe');
    }

    if (!classExists) {
      throw new Error('La clase no existe');
    }

    // 2. Operación atómica de cupo (lo que ya teníamos)
    const updatedClass = await Class.findOneAndUpdate(
      { _id: classId, availableCapacity: { $gt: 0 }, isActive: true },
      { $inc: { availableCapacity: -1 } },
      { new: true }
    );

    if (!updatedClass) {
      throw new Error('Clase no disponible o agotada');
    }

    try {
      // 3. Creamos la reserva con el idempotencyKey para evitar duplicidad
      const reservation = await Reservation.create({ userId, classId, idempotencyKey, status: 'confirmed' });

      // Manejo de Eventos
      const classData = await Class.findById(classId);
      if (classData) {
        const dto = classData.toJSON();
        sseService.notifyAll({ ...dto, id: dto._id });
      }

      return reservation;
    } catch (error) {
      // 4. Rollback: Si la reserva falla (ej. duplicado), devolvemos el cupo
      await Class.updateOne({ _id: classId }, { $inc: { availableCapacity: 1 } });
      throw error;
    }
  }

  // Cancelar Reserva: Libera el cupo atómicamente
  async cancelReservation(reservationId: string) {
    const reservation = await Reservation.findOne({ _id: reservationId });

    if (!reservation) {
      throw new Error('La reserva solicitada no existe');
    }

    if (reservation.status === 'cancelled') {
      throw new Error('La reserva ya se encuentra cancelada');
    }

    // 1. Marcar reserva como cancelada
    reservation.status = 'cancelled';
    await reservation.save();

    // 2. Liberar cupo en la clase
    await Class.updateOne(
      { _id: reservation.classId.toString() },
      { $inc: { availableCapacity: 1 } }
    );

    // Manejo de Eventos
    const classData = await Class.findById(reservation.classId.toString());
    if (classData) {
      const dto = classData.toJSON();
      sseService.notifyAll({ ...dto, id: dto._id });
    }

    return { message: 'Reserva cancelada y cupo liberado exitosamente' };
  }

  async getReservationsByUser(userId: string) {
    return await Reservation.find({
      userId: new Types.ObjectId(userId) as any,
      isActive: true,
      status: 'confirmed'
    })
      .populate('classId', 'name instructor date') 
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 }); 
  }

  // Buscamos todas las reservas activas por usuario y clase
  async getOneReservationsByUser(userId: string, classId: string) {
    return await Reservation.find({
      userId: new Types.ObjectId(userId) as any,
      classId: new Types.ObjectId(classId) as any,
      isActive: true
    })
      .populate('classId', 'name instructor date')
      .populate('userId', 'name email role');
  }

  // Buscamos todas las reservas activas
  async getAllReservations() {
    return await Reservation.find({
      isActive: true
    })
      .populate('classId', 'name instructor date')
      .populate('userId', 'name email role');
  }
}