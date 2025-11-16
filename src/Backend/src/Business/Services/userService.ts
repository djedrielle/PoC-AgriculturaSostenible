import { UserRepositoryPostgres } from "../../Persistence/Repos/userRepository";
import { User, Farmer, Investor } from "../Models/user";


export class UserService {

    userRepository = new UserRepositoryPostgres();
    
    async createUser(user: User): Promise<void> {
        this.userRepository.createUser(user);
    }

    async createFarmer(farmer: Farmer): Promise<void> {
        this.userRepository.createFarmer(farmer);
    }

    async createInvestor(investor: Investor): Promise<void> {
        this.userRepository.createInvestor(investor);
    }

    async getUserInfo(): Promise<any> {
        return this.userRepository.getUserInfo();
    }

    async deleteUser(userId: string): Promise<void> {
        this.userRepository.deleteUser(userId);
    }
}