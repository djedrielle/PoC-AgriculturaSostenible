/**
 * Implementación de ejemplo: patrón Factory para crear distintos tipos de Token.
 * Cada token concreto puede definir su unidad de medida (p. ej. "cajuelas", "kilos").
 */

export abstract class Token {
    token_name: string;
    emition_date: string;
    token_price_USD: number;
    amount_tokens: number;
    owner_id: string;
    production_id: string;
    abstract unidad(): string;
    token_id?: string;

    constructor(token_name: string, emition_date: string, token_price_USD: number, amount_tokens: number, owner_id: string, production_id: string, token_id?: string) {
        this.token_name = token_name;
        this.emition_date = emition_date;
        this.token_price_USD = token_price_USD;
        this.amount_tokens = amount_tokens;
        this.owner_id = owner_id;
        this.production_id = production_id;
        this.token_id = token_id || undefined;
    }
}

export class CafeToken extends Token {
    unidad(): string { return 'cajuelas'; }
}

export class PinaToken extends Token {
    unidad(): string { return 'kilos'; }
}

export class BananoToken extends Token {
    unidad(): string { return 'racimos'; }
}

export class GenericToken extends Token {
    unidad(): string { return 'unidades'; }
}

export type TokenType = 'cafe' | 'pina' | 'banano' | string;

export class TokenFactory {
    /**
     * Crea una instancia de Token según el tipo.
     * - type: identifica la subclase a crear
     * - los siguientes parámetros son los comunes a todos los tokens
     */
    static create(type: TokenType, token_name: string, emition_date: string, token_price_USD: number, amount_tokens: number, owner_id: string, production_id: string, token_id?: string): Token {
        switch (type.toLowerCase()) {
            case 'cafe':
                return new CafeToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
            case 'pina':
                return new PinaToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
            case 'banano':
                return new BananoToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
            default:
                return new GenericToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
        }
    }
}

// Ejemplo rápido de uso (descomentar para pruebas locales):
// const t = TokenFactory.create('cafe', 'CFE-1', 'ctr-123', 'ownerA', 10, '2025-11-09', true);
// console.log(t.toString());
