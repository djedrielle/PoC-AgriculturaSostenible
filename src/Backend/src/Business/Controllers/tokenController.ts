import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../Services/tokenService';

export class TokenController {
    tokenService = new TokenService();
}