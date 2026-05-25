import { User } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class FindByIDUserUseCase {

    constructor(private readonly userRepository: UserRepository) { }

    async run(id: string): Promise<User | null> {
        return await this.userRepository.findById(id);
    }
}