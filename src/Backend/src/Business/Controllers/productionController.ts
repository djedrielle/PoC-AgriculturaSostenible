import { Request, Response } from 'express';
import { ProductionService } from '../Services/productionService'; // Ajusta la ruta según tu proyecto
import { SmartContractService } from '../Services/smartContractService';

import { Production } from '../Models/production'; // Ajusta la ruta según tu proyecto
import { SmartContract } from '../Models/smart_contract';

export class ProductionController {
    productionService = new ProductionService();
    smartContractService = new SmartContractService();
    async tokenizeProductionAsset(req: Request, res: Response) {
        // Crear un contrato inteligente para la tokenización del activo agrícola
        const smartContractData = req.body.smart_contract;
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
        const productionData = req.body;
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
        this.productionService.addProduction(productionObj);
        // Ahora hay que crear y publicar los tokens en el mercado

}