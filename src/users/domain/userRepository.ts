import { User } from "./user";

export interface UserRepository {
    list(): Promise<User[]>
    create(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    update(user: User): Promise<User>;
}