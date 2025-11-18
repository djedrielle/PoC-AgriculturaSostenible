import { Token } from '../../Business/Models/token';
import { MarketRepositoryPostgres } from '../../Persistence/Repos/marketRepository';

export class MarketService {

    marketRepository = new MarketRepositoryPostgres();

    async publishOnMarket(tokens: Token): Promise<void> {
        await this.marketRepository.publishOnMarket(tokens);
    }

    async getMarketTokensByTokenId(token_id: string): Promise<number> {
        return this.marketRepository.getMarketTokensByTokenId(token_id);
    }

    async getAllTokensOnMarket(): Promise<Token[]> {
        return this.marketRepository.getAllTokensOnMarket();
    }

}

export default MarketService;