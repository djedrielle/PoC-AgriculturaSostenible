"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const userRepository_1 = require("../../Persistence/Repos/userRepository");
class UserService {
    constructor() {
        this.userRepository = new userRepository_1.UserRepositoryPostgres();
    }
    async createUser(user) {
        this.userRepository.createUser(user);
    }
    async getUserInfo() {
        return this.userRepository.getUserInfo();
    }
    async deleteUser(userId) {
        this.userRepository.deleteUser(userId);
    }
}
exports.UserService = UserService;
