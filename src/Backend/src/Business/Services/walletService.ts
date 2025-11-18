import { Token } from '../../Business/Models/token';
import { WalletRepositoryPostgres } from '../../Persistence/Repos/walletRepository';

export class WalletService {

    walletRepositorie = new WalletRepositoryPostgres();

    async getUserTokens(userId: string): Promise<Token[]> {
        return this.walletRepositorie.getUserTokens(userId);
    }

}