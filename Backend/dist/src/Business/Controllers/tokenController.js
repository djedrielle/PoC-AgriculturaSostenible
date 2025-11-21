"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenController = void 0;
const tokenService_1 = __importDefault(require("../Services/tokenService"));
const transaction_1 = require("../Models/transaction");
class TokenController {
    constructor() {
        this.tokenService = new tokenService_1.default();
    }
    async buyTokens(req, res) {
        try {
            const transaction = new transaction_1.Transaction(req.body.token_name, req.body.token_amount_transferred, req.body.token_unit_price, req.body.platform_comition, req.body.buyer_id, req.body.seller_id);
            const result = await this.tokenService.buyTokens(transaction);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
    async sellTokens(req, res) {
        try {
            const { seller_id, token_name, amount, token_unit_price } = req.body;
            const result = await this.tokenService.sellTokens(seller_id, token_name, amount, token_unit_price);
            res.status(200).json(result);
        }
        catch (error) {
            res.status(500).json({ message: error.message || 'Internal Server Error' });
        }
    }
}
exports.TokenController = TokenController;
exports.default = new TokenController();
