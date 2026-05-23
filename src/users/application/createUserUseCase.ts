import { UserAlreadyExistsError } from "../domain/errors/UserAlreadyExistsError";
import { User, UserRole } from "../domain/user";
import { UserRepository } from "../domain/userRepository";
import { HashService } from "./service/hashService";
import * as crypto from "node:crypto"

interface CreateUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export class CreateUserUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService
    ) { }

    async run(user: CreateUser): Promise<User> {

        const userExisted = await this.userRepository.findByEmail(user.email);
        if (userExisted) {
            throw new UserAlreadyExistsError(userExisted.email)
        }

        const hashedPassword = await this.hashService.hash(user.password);

        const newUser = new User(
            crypto.randomUUID(),
            user.name,
            user.email,
            hashedPassword,
            user.role,
            new Date(),
            new Date(),
            null
        );

        await this.userRepository.create(newUser);
        return newUser;
    }

}