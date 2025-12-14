import { Request, Response } from 'express';
import * as AuthService from '../services/auth.service';

// REGISTER
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const { userId } = await AuthService.registerUser(
      name,
      email,
      password
    );

    res.status(201).json({
      message: 'Usuario creado',
      userId
    });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

// LOGIN
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const token = await AuthService.loginUser(
      email,
      password
    );

    res.json({ token });
  } catch (error: any) {
    res.status(400).json({
      message: error.message
    });
  }
};

// PROFILE / GET USER
export const getUser = (req: Request, res: Response) => {
  res.json(req.user);
};
