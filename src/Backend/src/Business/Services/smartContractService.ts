import { SmartContractRepositoryPostgres } from '../../Persistence/Repos/smartContractRepository';

import { MarketService } from './marketService';

import { SmartContract } from '../Models/smart_contract';
import { Token } from '../Models/token';

export class SmartContractService {

    marketService = new MarketService();
    smartContractRepository = new SmartContractRepositoryPostgres();

    async addSmartContract(smartContract: SmartContract): Promise<string> {
        return await this.smartContractRepository.createSmartContract(smartContract);
    }

    async publishOnMarket(tokens: Token): Promise<void> {
        await this.marketService.publishOnMarket(tokens);
    }

}