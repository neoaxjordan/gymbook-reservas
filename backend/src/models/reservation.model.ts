import { Schema, model, Types } from 'mongoose';

// Define primero la interfaz de datos
interface IReservation {
  _id: string;
  userId: Types.ObjectId; //string;
  classId: Types.ObjectId; //string;
  status: string;
  idempotencyKey: string;
  isActive: boolean;
  userName: string;
  className: string;
}

// Define una interfaz para los métodos personalizados
interface IReservationDocument extends IReservation, Document {
  toDTO(): any;
}

const ReservationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  // Campo de IdempotencyKey es vital para la concurrencia  
  idempotencyKey: { type: String, required: true, unique: true, index: true }, 
  isActive: { type: Boolean, default: true }
}, { timestamps: true });


ReservationSchema.methods.toDTO = function (this: IReservationDocument) {
  return {
    id: this._id,
    userId: this.userId,
    classId: this.classId,    
    status: this.status,
    idempotencyKey: this.idempotencyKey,
    isActive: this.isActive
  };
};

export const Reservation = model<IReservationDocument>('Reservation', ReservationSchema);