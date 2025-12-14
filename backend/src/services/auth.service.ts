import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET as string;

// REGISTER
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error('Email ya registrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword
  });

  return {
    userId: user._id
  };
};

// LOGIN
export const loginUser = async (
  email: string,
  password: string
) => {
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign(
    { id: user._id },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return token;
};
