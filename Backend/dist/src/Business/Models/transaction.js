"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
class Transaction {
    constructor(token_name, token_amount_transferred, token_unit_price, platform_comition, buyer_id, seller_id, transaction_id, transaction_hash, transaction_date) {
        this.token_name = token_name;
        this.token_amount_transferred = token_amount_transferred;
        this.token_unit_price = token_unit_price;
        this.platform_comition = platform_comition;
        this.buyer_id = buyer_id;
        this.seller_id = seller_id;
        this.transaction_id = transaction_id;
        this.transaction_hash = transaction_hash;
        this.transaction_date = transaction_date;
    }
}
exports.Transaction = Transaction;
