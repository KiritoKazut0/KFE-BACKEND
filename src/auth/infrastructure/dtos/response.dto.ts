import { ApiProperty } from "@nestjs/swagger";
import { User } from "../../../users/domain/user";
import { UserDataDto } from "../../../users/infrastructure/dtos/userResponse.dto";

export class AuthResponseDto {
    @ApiProperty({
        example: true,
        description: 'Indica si la autenticación fue exitosa'
    })
    success!: boolean;

    @ApiProperty({
        example: 'Inicio de sesión exitoso',
        description: 'Mensaje descriptivo del resultado'
    })
    message!: string;

    @ApiProperty({
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Token JWT para autenticación'
    })
    token!: string;

    @ApiProperty({
        type: UserDataDto,
        description: 'Información del usuario autenticado'
    })
    data!: UserDataDto;

    static success(
        user: User,
        token: string,
        message: string = 'Autenticación completada correctamente'
    ): AuthResponseDto {
        const userData = new UserDataDto();
        userData.id = user.id;
        userData.name = user.name;
        userData.email = user.email;
        userData.role = user.role;
        userData.createdAt = user.createdAt;
        userData.updatedAt = user.updatedAt;

        const response = new AuthResponseDto();
        response.success = true;
        response.message = message;
        response.token = token;
        response.data = userData;

        return response;
    }
}