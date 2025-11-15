import { Request, Response, NextFunction } from 'express';
import tokenService from '../Services/tokenService';

/**
 * Controlador para administración de tokens.
 * Asume que tokenService exporta métodos:
 * - createTokens(userId: string) -> { accessToken, refreshToken }
 * - refreshToken(refreshToken: string) -> { accessToken, refreshToken }
 * - revokeToken(token: string) -> void
 * - verifyToken(token: string) -> any (payload)
 *
 * Ajusta nombres de métodos si tu tokenService los expone diferentemente.
 */

const COOKIE_NAME = 'refreshToken';

const tokenController = {
    // Crear/emitir tokens para un usuario (por ejemplo en login)
    async issue(req: Request, res: Response, next: NextFunction) {
        try {
            const userId: string | undefined = req.body?.userId || req.user?.id;
            if (!userId) return res.status(400).json({ message: 'userId requerido' });

            const { accessToken, refreshToken } = await tokenService.createTokens(userId);

            // Opcional: almacenar refresh token en cookie httpOnly
            res.cookie(COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                // maxAge: 7 * 24 * 60 * 60 * 1000, // opcional
            });

            return res.status(201).json({ accessToken });
        } catch (err) {
            next(err);
        }
    },

    // Renovar tokens usando refresh token
    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const incoming =
                req.body?.refreshToken ||
                req.cookies?.[COOKIE_NAME] ||
                req.headers['x-refresh-token'];

            if (!incoming) return res.status(400).json({ message: 'refreshToken requerido' });

            const { accessToken, refreshToken } = await tokenService.refreshToken(String(incoming));

            res.cookie(COOKIE_NAME, refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
            });

            return res.json({ accessToken });
        } catch (err) {
            next(err);
        }
    },

    // Revocar un token (por ejemplo al logout)
    async revoke(req: Request, res: Response, next: NextFunction) {
        try {
            const token =
                req.body?.token || req.cookies?.[COOKIE_NAME] || req.headers['authorization']?.split(' ')[1];

            if (!token) return res.status(400).json({ message: 'token requerido para revocar' });

            await tokenService.revokeToken(String(token));

            // Borrar cookie si existe
            res.clearCookie(COOKIE_NAME);

            return res.sendStatus(204);
        } catch (err) {
            next(err);
        }
    },

    // Verificar un token y devolver su payload
    async verify(req: Request, res: Response, next: NextFunction) {
        try {
            const token =
                req.body?.token || req.headers['authorization']?.split(' ')[1] || req.query?.token;

            if (!token) return res.status(400).json({ message: 'token requerido' });

            const payload = await tokenService.verifyToken(String(token));

            return res.json({ payload });
        } catch (err) {
            next(err);
        }
    },
};

export default tokenController;