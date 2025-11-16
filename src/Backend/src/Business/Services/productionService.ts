import { ProductionRepositoryPostgres } from '../../Persistence/Repos/productionRepository';
import { Production } from '../Models/production';

export class ProductionService {

    productionRepository = new ProductionRepositoryPostgres();

    async addProduction(production: Production): Promise<string> {
        return await this.productionRepository.createProduction(production);
    }
}