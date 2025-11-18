import TransactionService from './transactionService';
import MarketService from './marketService';
import TokenService from './tokenService';

interface TokenPrice {
    timestamp: Date;
    price: number;
}

interface TokenAnalytics {
    currentPrice: number;
    marketSupply: number;
    totalSupply: number;
    priceHistory: TokenPrice[];
}

class AnalyticsService {
    private transactionService = new TransactionService();
    private marketService = new MarketService();
    private tokenService = new TokenService();
    
    private priceHistory: TokenPrice[] = [];
    // Por aqui hay que cargar el historial de precios desde la base de datos.

    async getCurrentTokenPrice(token_id: string, lastTokenPrice: number): Promise<number> {
        // Se va a consultar el precio de la ultima transaccion del token deseado.
        // Si esta es diferente al precio almacenado, se actualiza el precio almacenado.
        const lastTransaction = await this.transactionService.getLastTransactionPriceAndDate(token_id);
        if (lastTransaction && lastTransaction.price !== lastTokenPrice) {
            return lastTransaction.price;
        }

        return lastTokenPrice;
    }

    async getMarketSupply(token_id: string): Promise<number> {
        // Se va a consultar el suministro de mercado del token deseado.
        return this.marketService.getMarketTokensByTokenId(token_id);
    }

    async getTotalSupply(token_id: string): Promise<number> {
        // Se va a consultar el suministro total del token deseado.
        // Hay que buscar en las tablas market y tokens.
        let amountOffMarket = await this.tokenService.getAmountTokensOffMarket(token_id);
        let amountOnMarket = await this.marketService.getMarketTokensByTokenId(token_id);
        return amountOffMarket + amountOnMarket;
    }

    async getPriceHistory(token_id: string): Promise<TokenPrice[]> {
        // Se va a consultar el precio de la ultima transaccion del token deseado.
        // Si esta es diferente al ultimo precio almacenado, entonces se agrega a la lista.
        const lastTransaction = await this.transactionService.getLastTransactionPriceAndDate(token_id);
        if (lastTransaction) {
            const lastStoredPrice = this.priceHistory.length > 0 ? this.priceHistory[this.priceHistory.length - 1].price : null;
            if (lastTransaction.price !== lastStoredPrice) {
                this.priceHistory.push({
                    timestamp: new Date(lastTransaction.date),
                    price: lastTransaction.price
                });
            }
        }
        return this.priceHistory;
    }

    async getFullAnalytics(token_id: string, lastTokenPrice: number): Promise<TokenAnalytics> {
        try {
            const currentPrice = await this.getCurrentTokenPrice(token_id, lastTokenPrice);
            const marketSupply = await this.getMarketSupply(token_id);
            const totalSupply = await this.getTotalSupply(token_id);
            const priceHistory = await this.getPriceHistory(token_id);

            return {
                currentPrice,
                marketSupply,
                totalSupply,
                priceHistory
            };
        } catch (error) {
            throw new Error('Error fetching full analytics');
        }
    }
}

export default AnalyticsService;