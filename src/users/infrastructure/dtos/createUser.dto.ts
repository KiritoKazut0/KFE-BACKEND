import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length, IsIn } from 'class-validator';
import  { UserRole } from '../../domain/user';

export default class CreateUserDto {
    @ApiProperty({ 
        example: 'Carlos Ruiz', 
        description: 'Nombre completo del empleado',
        minLength: 5,
        maxLength: 50
    })
    @IsNotEmpty()
    @IsString()
    @Length(5, 50)
    name!: string;

    @ApiProperty({ 
        example: 'carlos.caja@kfe.com', 
        description: 'Correo electrónico corporativo' 
    })
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @ApiProperty({ 
        example: 'kfe_secure123', 
        description: 'Contraseña de acceso al sistema',
        minLength: 6,
        maxLength: 50
    })
    @IsNotEmpty()
    @IsString()
    @Length(6, 50)
    password!: string;

    @ApiProperty({ 
        enum: ['MANAGER', 'CASHIER', 'ADMIN'], 
        example: 'CASHIER', 
        description: 'Nivel de acceso y permisos' 
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['MANAGER', 'CASHIER', 'ADMIN'])
    role!: UserRole;
}