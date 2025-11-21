"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const walletRepository_1 = require("../../Persistence/Repos/walletRepository");
class WalletService {
    constructor() {
        this.walletRepository = new walletRepository_1.WalletRepositoryPostgres();
    }
    async getUserTokens(userId) {
        return this.walletRepository.getUserTokens(userId);
    }
}
exports.WalletService = WalletService;
