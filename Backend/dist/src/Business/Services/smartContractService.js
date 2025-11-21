"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartContractService = void 0;
const smartContractRepository_1 = require("../../Persistence/Repos/smartContractRepository");
const marketService_1 = require("./marketService");
class SmartContractService {
    constructor() {
        this.marketService = new marketService_1.MarketService();
        this.smartContractRepository = new smartContractRepository_1.SmartContractRepositoryPostgres();
    }
    async addSmartContract(smartContract) {
        return await this.smartContractRepository.createSmartContract(smartContract);
    }
    async publishOnMarket(tokens) {
        await this.marketService.publishOnMarket(tokens);
    }
}
exports.SmartContractService = SmartContractService;
