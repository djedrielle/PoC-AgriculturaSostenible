import { Router } from 'express';
import { createUser, getUserInfo, updateUser, deleteUser } from '../Controllers/userController';

export const router = Router();

router.post('/create', createUser);

router.get('/info', getUserInfo);

router.put('/update', updateUser);

router.delete('/delete', deleteUser);