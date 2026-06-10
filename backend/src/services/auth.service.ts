import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import bcrypt from 'bcryptjs';

export class AuthService {
    async login(email: string, pass: string) {
        const user = await User.findOne({ email });

        // Validar datos de la credencial
        if (!user || !(await bcrypt.compare(pass, user.password))) {
            throw new Error('Credenciales inválidas');
        }

        // Firmamos el token
        const new_token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: '1d' }
        );

        // DTO 
        const userDTO = user.toDTO();

        return {
            user: userDTO,
            token: new_token
        };
    }

    async register(email: string, name: string, pass: string, rol: number) {
        let newUser = new User();
        
        if (rol === 1) {
            newUser = await User.create({ email: email, name: name, password: pass });
        } else {
            newUser = await User.create({ email: email, name: name, password: pass, role: 'admin' });
        }

        const userDTO = newUser.toDTO();
        return userDTO;
    }
}