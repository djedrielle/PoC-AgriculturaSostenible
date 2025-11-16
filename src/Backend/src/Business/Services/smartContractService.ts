import { SmartContractRepositoryPostgres } from '../../Persistence/Repos/smartContractRepository';
import { SmartContract } from '../Models/smart_contract';

export class SmartContractService {

    smartContractRepository = new SmartContractRepositoryPostgres();

    async addSmartContract(smartContract: SmartContract): Promise<string> {
        return await this.smartContractRepository.createSmartContract(smartContract);
    }
}