/**
 * Implementación de ejemplo: patrón Factory para crear distintos tipos de Token.
 * Cada token concreto puede definir su unidad de medida (p. ej. "cajuelas", "kilos").
 */

export abstract class Token {
    token_id: string;
    contract_id: string;
    owner_address: string;
    destiny_address_token_amount: number;
    fecha_emision: string;
    transferible: boolean;
    abstract unidad(): string;

    constructor(token_id: string, contract_id: string, owner_address: string, destiny_address_token_amount: number, fecha_emision: string, transferible: boolean) {
        this.token_id = token_id;
        this.contract_id = contract_id;
        this.owner_address = owner_address;
        this.destiny_address_token_amount = destiny_address_token_amount;
        this.fecha_emision = fecha_emision;
        this.transferible = transferible;
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

export type TokenType = 'cafe' | 'pina' | 'banano';

export class TokenFactory {
    /**
     * Crea una instancia de Token según el tipo.
     * - type: identifica la subclase a crear
     * - los siguientes parámetros son los comunes a todos los tokens
     */
    static create(type: TokenType, token_id: string, contract_id: string, owner_address: string, destiny_address_token_amount: number, fecha_emision: string, transferible: boolean): Token {
        switch (type) {
            case 'cafe':
                return new CafeToken(token_id, contract_id, owner_address, destiny_address_token_amount, fecha_emision, transferible);
            case 'pina':
                return new PinaToken(token_id, contract_id, owner_address, destiny_address_token_amount, fecha_emision, transferible);
            case 'banano':
                return new BananoToken(token_id, contract_id, owner_address, destiny_address_token_amount, fecha_emision, transferible);
            default:
                // Si se necesita comportamiento por defecto, cambiar aquí.
                throw new Error(`Tipo de token desconocido: ${type}`);
        }
    }
}

// Ejemplo rápido de uso (descomentar para pruebas locales):
// const t = TokenFactory.create('cafe', 'CFE-1', 'ctr-123', 'ownerA', 10, '2025-11-09', true);
// console.log(t.toString());
