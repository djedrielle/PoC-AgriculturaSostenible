"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Market = void 0;
class Market {
    constructor(token_name, current_token_price_USD, amount_tokens_on_market, initial_token_price, owner_id) {
        this.token_name = token_name;
        this.current_token_price_USD = current_token_price_USD;
        this.amount_tokens_on_market = amount_tokens_on_market;
        this.initial_token_price = initial_token_price;
        this.owner_id = owner_id;
    }
}
exports.Market = Market;
