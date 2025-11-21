import { ProductionRepositoryPostgres } from '../../Persistence/Repos/productionRepository';
import { Production } from '../Models/production';

export class ProductionService {

    productionRepository = new ProductionRepositoryPostgres();

    async addProduction(production: Production): Promise<string> {
        return await this.productionRepository.createProduction(production);
    }

    async getProductionHistory(user_id: string): Promise<Production[]> {
        // Este metodo puede ser modificado para que devuelva unicamente la informacion relevante
        return await this.productionRepository.getProductionHistory(user_id);
    }
}