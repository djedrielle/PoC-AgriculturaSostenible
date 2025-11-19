import { Request, Response } from 'express';

import { ProductionService } from '../Services/productionService'; // Ajusta la ruta según tu proyecto
import { SmartContractService } from '../Services/smartContractService';
import { TokenService } from '../Services/tokenService';

import { Production } from '../Models/production'; // Ajusta la ruta según tu proyecto
import { SmartContract } from '../Models/smart_contract';
import { TokenFactory, Token } from '../Models/token';

export class ProductionController {

    productionService = new ProductionService();
    smartContractService = new SmartContractService();
    tokenService = new TokenService();
    
    async tokenizeProductionAsset(req: Request, res: Response) {
        // Crear un contrato inteligente para la tokenización del activo agrícola
        const smartContractData = req.body.smart_contract_data;
        const smartContractObj = new SmartContract(
            smartContractData.contract_id,
            smartContractData.contract_address,
            smartContractData.standard_implemented,
            smartContractData.initial_token_price,
            smartContractData.total_tokens,
            smartContractData.emition_date,
            smartContractData.active,
            smartContractData.contract_state
        );
        const contractId = await this.smartContractService.addSmartContract(smartContractObj);
        // Crear un objeto de producción a partir de los datos recibidos, y el contract_id retornado
        const productionData = req.body.production_data;
        const productionObj = new Production(
            productionData.location,
            productionData.farmer_id,
            productionData.crop_type,
            productionData.crop_variety,
            productionData.est_harvest_date,
            productionData.amount,
            productionData.measure_unit,
            productionData.biologic_features,
            productionData.agro_conditions,
            productionData.agro_protocols,
            productionData.active,
            contractId
        );
        const productionId = await this.productionService.addProduction(productionObj);
        // Ahora hay que crear los tokens
        const tokenData = req.body.token_data;
        const tokenObj: Token = TokenFactory.create(
            tokenData.type,
            tokenData.token_id,
            tokenData.token_name,
            tokenData.emition_date,
            tokenData.token_price_USD,
            tokenData.amount_tokens,
            tokenData.on_market,
            tokenData.owner_id,
            productionId
        );
        // Hay que analizar qué devolver
        const tokenId = await this.tokenService.createTokens(tokenObj);
        res.status(201).json({ message: 'Producción tokenizada con éxito', contractId, tokenId });
        // Publicar los tokens en Market, esto lo realiza el smart contract
        this.smartContractService.publishOnMarket(tokenObj);
    }

    async getProductionHistory(req: Request, res: Response) {
        const productionHistory = await this.productionService.getProductionHistory(req.body.user_id);
        return res.status(200).json(productionHistory);
    }

}

export default new ProductionController();