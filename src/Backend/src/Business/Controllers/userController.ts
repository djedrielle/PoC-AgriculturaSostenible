import { Request, Response } from 'express';
import UserService from '../Services/userService'; // Ajusta la ruta según tu proyecto

// DTOs simples
interface UserCreateDto {
    name: string;
    email: string;
    password: string;
    [key: string]: any;
}

interface UserUpdateDto {
    name?: string;
    email?: string;
    password?: string;
    [key: string]: any;
}

class UserController {
    // Crear usuario
    async create(req: Request, res: Response) {
        try {
            const payload: UserCreateDto = req.body;

            // Validaciones básicas
            if (!payload || !payload.name || !payload.email || !payload.password) {
                return res.status(400).json({ message: 'name, email y password son requeridos.' });
            }

            const created = await UserService.create(payload);
            return res.status(201).json(created);
        } catch (err: any) {
            console.error('UserController.create:', err);
            return res.status(500).json({ message: err?.message ?? 'Error interno del servidor' });
        }
    }

    // Obtener lista de usuarios (paginación opcional)
    async list(req: Request, res: Response) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 25;
            const result = await UserService.list({ page, limit });
            return res.status(200).json(result);
        } catch (err: any) {
            console.error('UserController.list:', err);
            return res.status(500).json({ message: err?.message ?? 'Error interno del servidor' });
        }
    }

    // Obtener usuario por id
    async getById(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: 'id es requerido' });

            const user = await UserService.getById(id);
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

            return res.status(200).json(user);
        } catch (err: any) {
            console.error('UserController.getById:', err);
            return res.status(500).json({ message: err?.message ?? 'Error interno del servidor' });
        }
    }

    // Actualizar usuario
    async update(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const payload: UserUpdateDto = req.body;
            if (!id) return res.status(400).json({ message: 'id es requerido' });
            if (!payload || Object.keys(payload).length === 0) {
                return res.status(400).json({ message: 'Datos a actualizar son requeridos' });
            }

            const updated = await UserService.update(id, payload);
            if (!updated) return res.status(404).json({ message: 'Usuario no encontrado' });

            return res.status(200).json(updated);
        } catch (err: any) {
            console.error('UserController.update:', err);
            return res.status(500).json({ message: err?.message ?? 'Error interno del servidor' });
        }
    }

    // Eliminar usuario
    async remove(req: Request, res: Response) {
        try {
            const id = req.params.id;
            if (!id) return res.status(400).json({ message: 'id es requerido' });

            const deleted = await UserService.remove(id);
            if (!deleted) return res.status(404).json({ message: 'Usuario no encontrado' });

            return res.status(204).send();
        } catch (err: any) {
            console.error('UserController.remove:', err);
            return res.status(500).json({ message: err?.message ?? 'Error interno del servidor' });
        }
    }
}

export default new UserController();