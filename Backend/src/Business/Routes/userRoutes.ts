import { Router } from 'express';
import UserController from '../Controllers/userController';

export const router = Router();

router.post('/create', UserController.createUser.bind(UserController));
/* Data received
    body = {
        username: string;
        first_name: string;
        last_name: string;
        email: string;
        user_type: 'farmer' | 'investor';
        wallet_address?: string;
        identification_number?: string;
        active?: boolean;
        farmerData?: { location: string;  }  // Si user_type es 'farmer'
        investorData?: {  }                     // Si user_type es 'investor'
    }
*/