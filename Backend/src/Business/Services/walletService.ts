import { Token } from '../Models/token';
import { WalletRepositoryPostgres } from '../../Persistence/Repos/walletRepository';

export class WalletService {

    walletRepository = new WalletRepositoryPostgres();

    async getUserTokens(userId: string): Promise<Token[]> {
        return this.walletRepository.getUserTokens(userId);
    }

}