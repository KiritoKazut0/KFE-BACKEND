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
import { SecurityModule } from "../core/security/security.module";
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
         useFactory: (userRepository: MysqlUserRepository) => {
            return new ListUserUseCase(userRepository)
         },
         inject: [MysqlUserRepository]
        },

        {
            provide: CreateUserUseCase,
            useFactory: (userRepository: MysqlUserRepository, hashService: HashServiceImpl) => {
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