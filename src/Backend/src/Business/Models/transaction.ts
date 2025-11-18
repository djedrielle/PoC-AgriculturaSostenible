export class Transaction {
    transaction_id: string;
    transaction_hash: string;
    token_amount_transferred: number;
    token_unit_price: number;
    platform_comition: number;
    transaction_date: string;
    buyer_id?: string;
    seller_id?: string;


    constructor(transaction_id: string, transaction_hash: string, token_amount_transferred: number, token_unit_price: number, platform_comition: number, transaction_date: string, buyer_id?: string, seller_id?: string) {
        this.transaction_id = transaction_id;
        this.transaction_hash = transaction_hash;
        this.token_amount_transferred = token_amount_transferred;
        this.token_unit_price = token_unit_price;
        this.platform_comition = platform_comition;
        this.transaction_date = transaction_date;
        this.buyer_id = buyer_id;
        this.seller_id = seller_id;
    }
}