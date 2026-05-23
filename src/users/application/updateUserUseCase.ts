import { User, UserRole } from "../domain/user";
import { UserRepository } from "../domain/userRepository";

export interface UpdateUser {
    name?: string;
    role?: UserRole;
}

export class UpdateUserUseCase {
    constructor (private readonly userRepository: UserRepository){}

    async run (id: string, user: UpdateUser): Promise<User> {
        const userExisted = await this.userRepository.findById(id);
        
        if (!userExisted){
            throw new Error ('User does not exist');
        }
        if (user.name) {
            userExisted.name = user.name;
            userExisted.updatedAt = new Date(); 
        }

        if (user.role) {
            userExisted.changeRole(user.role); 
        }

        await this.userRepository.update(userExisted);

        return userExisted;
    }
}