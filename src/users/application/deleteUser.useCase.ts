import { User } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async run(id: string): Promise<void> {
        const userExisted = await this.userRepository.findById(id);
        if (!userExisted) {
            throw new Error('User does not exist')
        }

        if (userExisted.deletedAt !== null) {
            throw new Error('User is already deleted');
        }

        userExisted.markAsDeleted();
        await this.userRepository.update(userExisted)

    }
}