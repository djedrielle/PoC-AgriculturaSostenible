import { Request, Response } from 'express';
import { UserService } from '../Services/userService'; // Ajusta la ruta según tu proyecto
import { User } from '../Models/user'; // Ajusta la ruta según tu proyecto

export class UserController {
    userService = new UserService();
    // Crear usuario
    async createUser(req: Request, res: Response) {
        
        try {
            const userData = req.body;

            // Crear instancia de User y guardarla (se usa User model para crear el objeto,
            // y UserService para persistirlo — ajusta según la firma de tu servicio)
            const userObj = new User({
                username: userData.username,
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                user_type: userData.user_type,
                wallet_address: userData.wallet_address,
                identification_number: userData.identification_number,
                active: userData.active
            });

            const createdUserId = await this.userService.createUser(userObj);

            // Si el usuario es farmer o investor, crear también el objeto correspondiente.
            let roleDoc = null;
            try {
                if (userData.user_type === 'farmer') {
                    const farmer = new Farmer({
                        user_id: createdUserId,
                        location: userData.farmerData?.location || ''
                    });
                    roleDoc = await this.userService.createFarmer(farmer);
                } else if (userData.user_type === 'investor') {
                    const investor = new Investor({
                        user_id: createdUserId
                    });
                    roleDoc = await this.userService.createInvestor(investor);
                }
            
            } catch (roleErr) {
                console.error('Error cleaning up user after role creation failure:', roleErr);
            }

            // Responder con el usuario creado y, si aplica, el documento de rol creado
            return res.status(201).json({ user_id: createdUserId, roleData: roleDoc });
        } catch (err: any) {
            console.error('UserController.create:', err);
            return res.status(500).json({ message: err?.message ?? 'Error interno del servidor' });
        }
    }
}

export default new UserController();