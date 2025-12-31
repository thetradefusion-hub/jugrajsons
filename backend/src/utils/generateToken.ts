import jwt, { SignOptions } from 'jsonwebtoken';

export const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRE || '7d') as string
  };
  
  return jwt.sign({ id }, secret, options);
};

