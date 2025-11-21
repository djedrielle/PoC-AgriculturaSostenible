"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionController = void 0;
const productionService_1 = require("../Services/productionService"); // Ajusta la ruta según tu proyecto
const smartContractService_1 = require("../Services/smartContractService");
const tokenService_1 = require("../Services/tokenService");
const production_1 = require("../Models/production"); // Ajusta la ruta según tu proyecto
const smart_contract_1 = require("../Models/smart_contract");
const token_1 = require("../Models/token");
class ProductionController {
    constructor() {
        this.productionService = new productionService_1.ProductionService();
        this.smartContractService = new smartContractService_1.SmartContractService();
        this.tokenService = new tokenService_1.TokenService();
    }
    async tokenizeProductionAsset(req, res) {
        try {
            // Crear un contrato inteligente para la tokenización del activo agrícola
            const smartContractData = req.body.smart_contract_data;
            const smartContractObj = new smart_contract_1.SmartContract(smartContractData.contract_address, smartContractData.standard_implemented, smartContractData.initial_token_price, smartContractData.total_tokens, smartContractData.active, smartContractData.contract_state, smartContractData.emition_date);
            const contractId = await this.smartContractService.addSmartContract(smartContractObj);
            // Crear un objeto de producción a partir de los datos recibidos, y el contract_id retornado
            const productionData = req.body.production_data;
            const productionObj = new production_1.Production(productionData.location, productionData.farmer_id, productionData.crop_type, productionData.crop_variety, productionData.est_harvest_date, productionData.amount, productionData.measure_unit, productionData.biologic_features, productionData.agro_conditions, productionData.agro_protocols, productionData.active, contractId);
            const productionId = await this.productionService.addProduction(productionObj);
            // Ahora hay que crear los tokens
            const tokenData = req.body.token_data;
            const tokenObj = token_1.TokenFactory.create(tokenData.type, tokenData.token_name, tokenData.emition_date, tokenData.token_price_USD, tokenData.amount_tokens, tokenData.owner_id, productionId);
            // Hay que analizar qué devolver
            const tokenId = await this.tokenService.createTokens(tokenObj);
            // Publicar los tokens en Market, esto lo realiza el smart contract
            this.smartContractService.publishOnMarket(tokenObj);
            return res.status(201).json({ message: 'Producción tokenizada con éxito', contractId, tokenId });
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getProductionHistory(req, res) {
        try {
            const productionHistory = await this.productionService.getProductionHistory(req.body.user_id);
            return res.status(200).json(productionHistory);
        }
        catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.ProductionController = ProductionController;
exports.default = new ProductionController();
