import { ApiProperty } from '@nestjs/swagger';
import { User, UserRole } from '../../domain/user';


export class UserDataDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID único' })
    id!: string;

    @ApiProperty({ example: 'Juan Perez', description: 'Nombre completo' })
    name!: string;

    @ApiProperty({ example: 'juan.cajero@kfe.com', description: 'Correo electrónico' })
    email!: string;

    @ApiProperty({ enum: ['MANAGER', 'CASHIER', 'ADMIN'], example: 'CASHIER', description: 'Rol asignado' })
    role!: UserRole;

    @ApiProperty({ description: 'Fecha de registro' })
    createdAt!: Date;

    @ApiProperty({ description: 'Fecha de última actualización' })
    updatedAt!: Date;
}


export class UserResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la operación finalizó con éxito' })
    success!: boolean;

    @ApiProperty({ example: 'Operación realizada con éxito', description: 'Mensaje descriptivo' })
    message!: string;

    @ApiProperty({ type: UserDataDto, description: 'Datos resultantes' })
    data!: UserDataDto;

    static success(user: User, message: string = 'Operación exitosa'): UserResponseDto {
        const userData = new UserDataDto();
        userData.id = user.id;
        userData.name = user.name;
        userData.email = user.email;
        userData.role = user.role;
        userData.createdAt = user.createdAt;
        userData.updatedAt = user.updatedAt;

        const response = new UserResponseDto();
        response.success = true;
        response.message = message;
        response.data = userData;
        
        return response;
    }
}


export class UserListResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la operación finalizó con éxito' })
    success!: boolean;

    @ApiProperty({ example: 'Usuarios listados correctamente', description: 'Mensaje descriptivo' })
    message!: string;


    @ApiProperty({ type: [UserDataDto], description: 'Lista de usuarios' })
    data!: UserDataDto[];

    static success(users: User[], message: string = 'Operación exitosa'): UserListResponseDto {
        const response = new UserListResponseDto();
        response.success = true;
        response.message = message;
        
        response.data = users.map(user => {
            const userData = new UserDataDto();
            userData.id = user.id;
            userData.name = user.name;
            userData.email = user.email;
            userData.role = user.role;
            userData.createdAt = user.createdAt;
            userData.updatedAt = user.updatedAt;
            return userData;
        });
        
        return response;
    }
}