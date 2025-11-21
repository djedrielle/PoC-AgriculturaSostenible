"use strict";
/**
 * Implementación de ejemplo: patrón Factory para crear distintos tipos de Token.
 * Cada token concreto puede definir su unidad de medida (p. ej. "cajuelas", "kilos").
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenFactory = exports.BananoToken = exports.PinaToken = exports.CafeToken = exports.Token = void 0;
class Token {
    constructor(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id) {
        this.token_name = token_name;
        this.emition_date = emition_date;
        this.token_price_USD = token_price_USD;
        this.amount_tokens = amount_tokens;
        this.owner_id = owner_id;
        this.production_id = production_id;
        this.token_id = token_id || undefined;
    }
}
exports.Token = Token;
class CafeToken extends Token {
    unidad() { return 'cajuelas'; }
}
exports.CafeToken = CafeToken;
class PinaToken extends Token {
    unidad() { return 'kilos'; }
}
exports.PinaToken = PinaToken;
class BananoToken extends Token {
    unidad() { return 'racimos'; }
}
exports.BananoToken = BananoToken;
class TokenFactory {
    /**
     * Crea una instancia de Token según el tipo.
     * - type: identifica la subclase a crear
     * - los siguientes parámetros son los comunes a todos los tokens
     */
    static create(type, token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id) {
        switch (type) {
            case 'cafe':
                return new CafeToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
            case 'pina':
                return new PinaToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
            case 'banano':
                return new BananoToken(token_name, emition_date, token_price_USD, amount_tokens, owner_id, production_id, token_id);
            default:
                throw new Error(`Tipo de token desconocido: ${type}`);
        }
    }
}
exports.TokenFactory = TokenFactory;
// Ejemplo rápido de uso (descomentar para pruebas locales):
// const t = TokenFactory.create('cafe', 'CFE-1', 'ctr-123', 'ownerA', 10, '2025-11-09', true);
// console.log(t.toString());
