"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const marketRepository_1 = require("../../Persistence/Repos/marketRepository");
class MarketService {
    constructor() {
        this.marketRepository = new marketRepository_1.MarketRepositoryPostgres();
    }
    async publishOnMarket(tokens) {
        await this.marketRepository.publishOnMarket(tokens);
    }
    async getMarketTokensByTokenId(token_id) {
        return this.marketRepository.getMarketTokensByTokenId(token_id);
    }
    async getAllTokensOnMarket() {
        return this.marketRepository.getAllTokensOnMarket();
    }
}
exports.MarketService = MarketService;
exports.default = MarketService;
