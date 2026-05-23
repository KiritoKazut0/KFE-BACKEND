import { User } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class FindByEmailUserUseCase {
    constructor ( private readonly userRepository: UserRepository) {}

    async run (email: string): Promise<User | null> {
        return await this.userRepository.findByEmail(email)
    }
}