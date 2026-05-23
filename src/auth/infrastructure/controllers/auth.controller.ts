    import { Body, ConflictException, Controller, HttpCode, InternalServerErrorException, Post, UnauthorizedException } from "@nestjs/common";
    import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
    import AccessUseCase from "../../application/accessUseCase";
    import { RegisterUseCase } from "../../application/registerUseCase";
    import AccessDto from "../dtos/acess.dto";
    import RegisterDto from "../dtos/register.dto";
    import { AuthResponseDto } from "../dtos/response.dto";
    import { InvalidCredentialsError } from "../../domain/errors/invalidCredentialsError";
    import { UserAlreadyExistsError } from "../../../users/domain/errors/UserAlreadyExistsError";


    @Controller('auth')
    @ApiTags("auth")
    export class AuthController {
        constructor(
            private readonly accessUseCase: AccessUseCase,
            private readonly registerUseCase: RegisterUseCase
        ) { }


        @Post('/access')
        @HttpCode(200)
        @ApiOperation({ summary: "Iniciar sesión" })
        @ApiResponse({ status: 200, description: "Login exitoso", type: AuthResponseDto })
        @ApiResponse({ status: 401, description: "Credenciales inválidas" })
        async access(@Body() user: AccessDto): Promise<AuthResponseDto> {
            try {
                const result = await this.accessUseCase.run(user.email, user.password);
                return AuthResponseDto.success(
                    result.user,
                    result.token,
                    'Inicio de sesión exitoso'
                )
            } catch (error) {
                console.log(error)
                if (error instanceof InvalidCredentialsError) {
                    throw new UnauthorizedException(error.message);
                }

                throw new InternalServerErrorException('Error interno del servidor');
            }

        }


        @Post('/register')
        @HttpCode(201)
        @ApiOperation({ summary: "Registrar usuario" })
        @ApiResponse({ status: 201, description: "Usuario registrado", type: AuthResponseDto })
        @ApiResponse({ status: 409, description: "El correo ya está registrado" })
        async register(@Body() userDto: RegisterDto): Promise<AuthResponseDto> {
            try {
                const result = await this.registerUseCase.run(userDto);
                return AuthResponseDto.success(
                    result.user,
                    result.token,
                    'Usuario registrado correctamente'
                );
            } catch (error) {
                if (error instanceof UserAlreadyExistsError) {
                    throw new ConflictException(error.message);
                }

                throw new InternalServerErrorException('Error interno del servidor');
            }

        }

    }