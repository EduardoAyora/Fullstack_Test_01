import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET!;

interface JwtPayload {
  id: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    const user = await User.findById(decoded.id).select('name email');
    if (!user) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    req.user = { id: user._id };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
