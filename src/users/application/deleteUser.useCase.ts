import { UserAlreadyDeletedError } from "../domain/errors/UserAlreadyDeletedError";
import { UserNotFoundError } from "../domain/errors/UserNotFoundError";
import { UserRepository } from "../domain/userRepository";

export class DeleteUserUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async run(id: string): Promise<void> {
        const userExisted = await this.userRepository.findById(id);
        if (!userExisted) throw new UserNotFoundError(id)
        if (userExisted.deletedAt !== null) throw new UserAlreadyDeletedError(id);
        userExisted.markAsDeleted();
        await this.userRepository.update(userExisted)

    }
}