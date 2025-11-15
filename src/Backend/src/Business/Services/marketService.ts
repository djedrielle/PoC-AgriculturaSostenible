import { Injectable } from '@nestjs/common';

@Injectable()
export class MarketService {
    private tokens: Array<{
        id: string;
        name: string;
        symbol: string;
        price: number;
        quantity: number;
        description: string;
        publishedAt: Date;
    }> = [];

    /**
     * Obtiene todos los tokens publicados en el mercado
     */
    getAllTokens() {
        return this.tokens;
    }

    /**
     * Obtiene un token específico por su ID
     */
    getTokenById(id: string) {
        return this.tokens.find(token => token.id === id);
    }

    /**
     * Publica un nuevo token en el mercado
     */
    publishToken(tokenData: {
        id: string;
        name: string;
        symbol: string;
        price: number;
        quantity: number;
        description: string;
    }) {
        const token = {
            ...tokenData,
            publishedAt: new Date(),
        };
        this.tokens.push(token);
        return token;
    }

    /**
     * Elimina un token del mercado
     */
    removeToken(id: string): boolean {
        const index = this.tokens.findIndex(token => token.id === id);
        if (index > -1) {
            this.tokens.splice(index, 1);
            return true;
        }
        return false;
    }
}