import { User } from "../Models/User";

export class UserService {
    private users: User[] = [];
    private nextId: number = 1;

    create(userData: Omit<User, "id">): User {
        const user: User = {
            id: this.nextId++,
            ...userData,
        };
        this.users.push(user);
        return user;
    }

    getById(id: number): User | undefined {
        return this.users.find((user) => user.id === id);
    }

    getAll(): User[] {
        return this.users;
    }

    update(id: number, userData: Partial<Omit<User, "id">>): User | undefined {
        const user = this.getById(id);
        if (!user) return undefined;

        Object.assign(user, userData);
        return user;
    }

    delete(id: number): boolean {
        const index = this.users.findIndex((user) => user.id === id);
        if (index === -1) return false;

        this.users.splice(index, 1);
        return true;
    }
}