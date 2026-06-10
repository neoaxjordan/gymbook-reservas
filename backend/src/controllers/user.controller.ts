import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
     next(error);
  }
};

export const getAllClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Buscamos solo los que tengan rol 'client'
    const clients = await userService.getAllClients();
    
    const clientsDTO = clients.map(user => user.toDTO());
    res.json(clientsDTO);    
  } catch (error: any) {
    next(error);
  }
};