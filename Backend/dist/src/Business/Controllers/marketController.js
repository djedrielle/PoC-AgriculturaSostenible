"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const marketService_1 = __importDefault(require("../Services/marketService"));
class MarketController {
    constructor() {
        this.marketService = new marketService_1.default();
    }
    async getAllTokensOnMarket(req, res) {
        try {
            const marketTokens = await this.marketService.getAllTokensOnMarket();
            return res.status(200).json(marketTokens);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.MarketController = MarketController;
exports.default = new MarketController();
