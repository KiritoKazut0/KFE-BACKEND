import { User } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class ListUserUseCase {
    constructor(private readonly userRepository: UserRepository){}

    async run (): Promise<User[]> {
        return await this.userRepository.list();
    }
}