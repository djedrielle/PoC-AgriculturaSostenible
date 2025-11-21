"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const tokenRepository_1 = require("../../Persistence/Repos/tokenRepository");
const marketRepository_1 = require("../../Persistence/Repos/marketRepository");
const walletRepository_1 = require("../../Persistence/Repos/walletRepository");
const transactionService_1 = __importDefault(require("./transactionService"));
class TokenService {
    constructor() {
        this.tokenRepository = new tokenRepository_1.TokenRepositoryPostgres();
        this.marketRepository = new marketRepository_1.MarketRepositoryPostgres();
        this.walletRepository = new walletRepository_1.WalletRepositoryPostgres();
        this.transactionService = new transactionService_1.default();
    }
    async createTokens(token) {
        return await this.tokenRepository.createTokens(token);
    }
    async buyTokens(transaction) {
        await this.marketRepository.removeTokensFromMarket(transaction.token_name, transaction.token_amount_transferred);
        await this.walletRepository.addTokensToWallet(transaction.buyer_id, transaction.token_name, transaction.token_amount_transferred, transaction.token_unit_price);
        const transactionId = await this.transactionService.createTransaction(transaction);
        return "Transaction Success ID:" + transactionId;
    }
    async sellTokens(userId, token_name, amount, token_unit_price) {
        await this.walletRepository.removeTokensFromWallet(userId, token_name, amount);
        await this.marketRepository.addTokensToMarket(userId, token_name, amount, token_unit_price);
        return true;
    }
    async removeSellerTokensFromMarket(seller_id, amount) {
        return this.marketRepository.removeTokensFromMarket(seller_id, amount);
    }
    async getAmountTokensOffMarket(token_id) {
        return this.tokenRepository.getAmountTokensOffMarket(token_id);
    }
}
exports.TokenService = TokenService;
exports.default = TokenService;
