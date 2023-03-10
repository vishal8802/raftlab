import { Router } from 'express';
import { authenticateToken } from '../../util';
import {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} from './controller';

const UserRoute = Router();

UserRoute.get('/all', authenticateToken, getAllUsers);
UserRoute.get('/:id', authenticateToken, getUserById);
UserRoute.put('/:id', authenticateToken, updateUserById);
UserRoute.delete('/:id', authenticateToken, deleteUserById);

export { UserRoute };
