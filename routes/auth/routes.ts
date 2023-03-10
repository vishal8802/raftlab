import { Router } from 'express';
import { register, login } from './controller';

const AuthRoute = Router();

AuthRoute.post('/register', register);
AuthRoute.post('/login', login);

export { AuthRoute };
