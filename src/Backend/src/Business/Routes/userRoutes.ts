import { Router } from 'express';
import UserController from '../Controllers/userController';

export const router = Router();

router.post('/create', UserController.createUser.bind(UserController));
