"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const walletService_1 = require("../Services/walletService");
class WalletController {
    constructor() {
        this.walletService = new walletService_1.WalletService();
    }
    async getTokensOnWallet(req, res) {
        try {
            console.log('WalletController:', req.body);
            const tokens = await this.walletService.getUserTokens(req.body.user_id);
            return res.status(200).json(tokens);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.WalletController = WalletController;
exports.default = new WalletController();
