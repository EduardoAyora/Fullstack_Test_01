import { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';

// Obtener usuario por ID
export const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select('name email');
  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  res.json(user);
};
