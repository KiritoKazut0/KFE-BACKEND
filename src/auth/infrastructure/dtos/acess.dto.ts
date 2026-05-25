import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';


export default class AccessDto {
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
}