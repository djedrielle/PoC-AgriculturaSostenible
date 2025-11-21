export class Market {
    token_name: string;
    current_token_price_USD: number;
    amount_tokens_on_market: number;
    initial_token_price: number;
    owner_id: string;
    
    constructor(token_name: string, current_token_price_USD: number, amount_tokens_on_market: number, initial_token_price: number, owner_id: string) {
        this.token_name = token_name;
        this.current_token_price_USD = current_token_price_USD;
        this.amount_tokens_on_market = amount_tokens_on_market;
        this.initial_token_price = initial_token_price;
        this.owner_id = owner_id;
    }
}