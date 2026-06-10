import { Schema, model } from 'mongoose';

// Define primero la interfaz de datos
interface IClass {
  _id: string;
  name: string;
  instructor: string;
  date: Date;
  totalCapacity: number,
  availableCapacity: number,
  isActive: boolean;
}

// Define una interfaz para los métodos personalizados
interface IClassDocument extends IClass, Document {
  toDTO(): any;
}

const ClassSchema = new Schema({
  name: { type: String, required: true },
  instructor: { type: String, required: true },

  // Indexado para filtrado rápido
  date: { type: Date, required: true, index: true },

  // Límite físico: no puede haber más personas que máquinas/espacio
  totalCapacity: { type: Number, required: true, min: 1 },

  // Estado actual: este campo NUNCA debe ser mayor a totalCapacity
  availableCapacity: { type: Number, required: true, min: 0 },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Validación a nivel de esquema (opcional pero muy profesional)
ClassSchema.pre('save', function () {
  if (this.availableCapacity > this.totalCapacity) {
    return new Error('La disponibilidad no puede exceder la capacidad total');
  }
});

ClassSchema.methods.toDTO = function (this: IClassDocument) {
  const formatDate = (date: Date): string => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return {
    id: this._id,
    name: this.name,
    instructor: this.instructor,
    date: formatDate(this.date),
    totalCapacity: this.totalCapacity,
    availableCapacity: this.availableCapacity,
    isActive: this.isActive
  };
};

export const Class = model<IClassDocument>('Class', ClassSchema);