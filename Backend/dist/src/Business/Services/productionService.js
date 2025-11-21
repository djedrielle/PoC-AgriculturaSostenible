"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionService = void 0;
const productionRepository_1 = require("../../Persistence/Repos/productionRepository");
class ProductionService {
    constructor() {
        this.productionRepository = new productionRepository_1.ProductionRepositoryPostgres();
    }
    async addProduction(production) {
        return await this.productionRepository.createProduction(production);
    }
    async getProductionHistory(user_id) {
        // Este metodo puede ser modificado para que devuelva unicamente la informacion relevante
        return await this.productionRepository.getProductionHistory(user_id);
    }
}
exports.ProductionService = ProductionService;
