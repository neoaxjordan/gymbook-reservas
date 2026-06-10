import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define primero la interfaz de datos
interface IUser {
  _id: string;
  email: string;
  password: string;
  name: string;
  role: 'client' | 'admin';
  isActive: boolean;
}

// Define una interfaz para los métodos personalizados
interface IUserDocument extends IUser, Document {
  toDTO(): any;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['client', 'admin'], default: 'client' },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

UserSchema.pre('save', async function () {
  const user = this as any;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

UserSchema.methods.toDTO = function(this: IUserDocument) {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    isActive: this.isActive
  };
};

export const User = model<IUserDocument>('User', UserSchema);