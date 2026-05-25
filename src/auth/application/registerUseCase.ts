import { CreateUserUseCase } from "../../users/application/createUserUseCase";
import { TokenService } from "../../core/security/services/tokenService";
import { User, UserRole } from "../../users/domain/user";

interface RegisterUser {
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export class RegisterUseCase {
    constructor(
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly tokenService: TokenService,
    ) { }

    async run(user: RegisterUser): Promise<{ user: User, token: string }> {
        const newUser = await this.createUserUseCase.run(user);
        const token = this.tokenService.generateToken({
            sub: newUser.id,
            role: newUser.role
        });
        return { user: newUser, token }
    }




}