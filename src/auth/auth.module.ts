import { Module } from "@nestjs/common";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { UserModule } from "../users/user.module";
import { SecurityModule } from "../core/security/security.module";
import { MysqlUserRepository } from "../users/infrastructure/persistence/mysql-user.repository";
import HashServiceImpl from "../shared/infrastructure/service/hashServiceImpl";
import { TokenService } from "../core/security/services/tokenService";
import { CreateUserUseCase } from "../users/application/createUserUseCase";

import AccessUseCase from "./application/accessUseCase";
import { RegisterUseCase } from "./application/registerUseCase";

@Module({
    imports: [
        UserModule,    
        SecurityModule
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: AccessUseCase,
            useFactory: (
                userRepository: MysqlUserRepository, 
                hashService: HashServiceImpl, 
                tokenService: TokenService
            ) => {
                return new AccessUseCase(userRepository, hashService, tokenService);
            },
            inject: [MysqlUserRepository, HashServiceImpl, TokenService]
        },
        {
            provide: RegisterUseCase,
            useFactory: (
                createUserUseCase: CreateUserUseCase, 
                tokenService: TokenService
            ) => {
                return new RegisterUseCase(createUserUseCase, tokenService);
            },
            inject: [CreateUserUseCase, TokenService]
        }
    ]
})
export class AuthModule {}