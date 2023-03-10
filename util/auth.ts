import jwt from 'jsonwebtoken';
import { NextFunction, Response } from 'express';

// Middleware to authenticate token
function authenticateToken(req: any, res: Response, next: NextFunction) {
  const authHeader =
    req.headers['authorization'] || req.headers['Authorization'];

  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Authentication token missing' });
  }

  jwt.verify(token, process.env.JWT_SECRET || '', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

export { authenticateToken };
