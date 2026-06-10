import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, rol } = req.body;
    const register = await authService.register(email, name, password, rol);

    if (!register) {
      return res.status(400).json({ error: 'Error al crear el nuevo usuario' });
    }

    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};
