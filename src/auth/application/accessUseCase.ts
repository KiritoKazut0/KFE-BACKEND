import { User } from "../../users/domain/user";
import { UserRepository } from "../../users/domain/userRepository";
import { HashService } from "../../shared/application/service/hashService";
import { TokenService } from "../../core/security/services/tokenService";
import { InvalidCredentialsError } from "../domain/errors/invalidCredentialsError";

export default class AccessUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly hashService: HashService,
        private readonly tokenService: TokenService
    ) { }

    async run(email: string, password: string): Promise<{ user: User, token: string }> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new InvalidCredentialsError();
        }

        const isMatchPassword = await this.hashService.compare(
            password,
            user.password
        );

        if (!isMatchPassword) {
            throw new InvalidCredentialsError();
        }

        const token = this.tokenService.generateToken({
            sub: user.id,
            role: user.role
        });

        return { user, token };
    }


}