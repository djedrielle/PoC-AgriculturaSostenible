import { UserRepositoryPostgres } from "../../Persistence/Repos/userRepository";
import { User } from "../Models/user";


export class UserService {

    userRepository = new UserRepositoryPostgres();
    
    async createUser(user: User): Promise<void> {
        this.userRepository.createUser(user);
    }

    async getUserInfo(): Promise<any> {
        return this.userRepository.getUserInfo();
    }

    async deleteUser(userId: string): Promise<void> {
        this.userRepository.deleteUser(userId);
    }
}