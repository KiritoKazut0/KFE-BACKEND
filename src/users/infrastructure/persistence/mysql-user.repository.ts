import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { UserRepository } from '../../domain/userRepository';
import { User } from '../../domain/user';
import { UserModel } from './user.model';

@Injectable()
export class MysqlUserRepository implements UserRepository {
    constructor(
        @InjectRepository(UserModel)
        private readonly typeOrmRepository: Repository<UserModel>
    ) { }

    async list(): Promise<User[]> {
        const userModels = await this.typeOrmRepository.find({
            where: {deletedAt: IsNull()}
        });
        return userModels.map(model => this.toDomain(model));
    }

    async create(user: User): Promise<User> {
        const userModel = this.toPersistence(user);
        const newUser = await this.typeOrmRepository.save(userModel);
        return this.toDomain(newUser);
    }

    async findById(id: string): Promise<User | null> {
        const userModel = await this.typeOrmRepository.findOne({ where: { id } });
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    async findByEmail(email: string): Promise<User | null> {
        const userModel = await this.typeOrmRepository.findOne({ where: { email } });
        if (!userModel) return null;
        return this.toDomain(userModel);
    }

    async update(user: User): Promise<User> {
        const userModel = this.toPersistence(user);
        const updateUser = await this.typeOrmRepository.save(userModel);
        return this.toDomain(updateUser)
    }


    private toPersistence(user: User): UserModel {
        const model = new UserModel();
        model.id = user.id;
        model.name = user.name;
        model.email = user.email;
        model.password = user.password;
        model.role = user.role;
        model.createdAt = user.createdAt;
        model.updatedAt = user.updatedAt;
        model.deletedAt = user.deletedAt;
        return model;
    }

    private toDomain(model: UserModel): User {
        return new User(
            model.id,
            model.name,
            model.email,
            model.password,
            model.role,
            model.createdAt,
            model.updatedAt,
            model.deletedAt
        );
    }
}