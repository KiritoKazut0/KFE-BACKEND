import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./infrastructure/controllers/users.controller";
import { UserModel } from "./infrastructure/persistence/user.model";
import { MysqlUserRepository } from "./infrastructure/persistence/mysql-user.repository";
import HashServiceImpl from "../shared/infrastructure/service/hashServiceImpl";
import { CreateUserUseCase } from "./application/createUserUseCase";
import { FindByIDUserUseCase } from "./application/findByIdUserUseCase";
import { UpdateUserUseCase } from "./application/updateUserUseCase";
import { DeleteUserUseCase } from "./application/deleteUser.useCase";
import { ListUserUseCase } from "./application/listUserUseCase";
import { UserRepository } from "./domain/userRepository";
import { SecurityModule } from "../core/security/security.module";
import { HashService } from "../shared/application/service/hashService";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel]),
        SecurityModule
    ],
    controllers: [
        UserController
    ],
    providers: [
        MysqlUserRepository,
        HashServiceImpl,
        {
         provide: ListUserUseCase,
         useFactory: (userRepository: UserRepository) => {
            return new ListUserUseCase(userRepository)
         },
         inject: [MysqlUserRepository]
        },

        {
            provide: CreateUserUseCase,
            useFactory: (userRepository: MysqlUserRepository, hashService: HashService) => {
                return new CreateUserUseCase(userRepository, hashService)
            },
            inject: [MysqlUserRepository, HashServiceImpl]
        },
        {
            provide: FindByIDUserUseCase,
            useFactory: (userRepository: MysqlUserRepository) => {
                return new FindByIDUserUseCase(userRepository);
            },
            inject: [MysqlUserRepository]
        },
        {
            provide: UpdateUserUseCase,
            useFactory: (userRepository: MysqlUserRepository) => {
                return new UpdateUserUseCase(userRepository);
            },
            inject: [MysqlUserRepository]
        }, 
        {
           provide: DeleteUserUseCase,
            useFactory: (userRepository: MysqlUserRepository) => {
                return new DeleteUserUseCase(userRepository);
            },
            inject: [MysqlUserRepository] 
        }
    ],
    exports: [
        MysqlUserRepository,
        HashServiceImpl,
        CreateUserUseCase
    ]

})
export class UserModule { }