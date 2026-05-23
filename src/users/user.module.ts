import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserController } from "./infrastructure/controllers/users.controller";
import { UserModel } from "./infrastructure/persistence/user.model";
import { MysqlUserRepository } from "./infrastructure/persistence/mysql-user.repository";
import HashServiceImpl from "./infrastructure/services/hashServiceImpl";
import { CreateUserUseCase } from "./application/createUserUseCase";
import { FindByIDUserUseCase } from "./application/findByIdUserUseCase";
import { UpdateUserUseCase } from "./application/updateUserUseCase";
import { DeleteUserUseCase } from "./application/deleteUser.useCase";
import { ListUserUseCase } from "./application/listUserUseCase";
import { UserRepository } from "./domain/userRepository";


@Module({
    imports: [
        TypeOrmModule.forFeature([UserModel])
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
         inject: [MysqlUserRepository, HashServiceImpl]
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
    exports: []

})
export class UserModule { }