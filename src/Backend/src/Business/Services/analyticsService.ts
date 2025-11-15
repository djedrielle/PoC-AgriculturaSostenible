import axios from 'axios';

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
    private apiBaseUrl: string;
    private priceHistory: TokenPrice[] = [];

    constructor(apiBaseUrl: string = 'https://api.coingecko.com/api/v3') {
        this.apiBaseUrl = apiBaseUrl;
    }

    async getCurrentTokenPrice(): Promise<number> {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/simple/price`, {
                params: {
                    ids: 'agriculture-token', // Ajusta según tu token
                    vs_currencies: 'usd'
                }
            });
            return response.data['agriculture-token'].usd;
        } catch (error) {
            throw new Error('Error fetching current token price');
        }
    }

    async getMarketSupply(): Promise<number> {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/coins/agriculture-token`);
            return response.data.market_data.circulating_supply;
        } catch (error) {
            throw new Error('Error fetching market supply');
        }
    }

    async getTotalSupply(): Promise<number> {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/coins/agriculture-token`);
            return response.data.market_data.total_supply;
        } catch (error) {
            throw new Error('Error fetching total supply');
        }
    }

    async getPriceHistory(days: number = 30): Promise<TokenPrice[]> {
        try {
            const response = await axios.get(`${this.apiBaseUrl}/coins/agriculture-token/market_chart`, {
                params: {
                    vs_currency: 'usd',
                    days: days
                }
            });
            
            this.priceHistory = response.data.prices.map((price: [number, number]) => ({
                timestamp: new Date(price[0]),
                price: price[1]
            }));
            
            return this.priceHistory;
        } catch (error) {
            throw new Error('Error fetching price history');
        }
    }

    async getFullAnalytics(days: number = 30): Promise<TokenAnalytics> {
        try {
            const currentPrice = await this.getCurrentTokenPrice();
            const marketSupply = await this.getMarketSupply();
            const totalSupply = await this.getTotalSupply();
            const priceHistory = await this.getPriceHistory(days);

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