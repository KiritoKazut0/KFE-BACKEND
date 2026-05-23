import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseUUIDPipe, Patch, Post, UseFilters } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

import { ListUserUseCase } from "../../application/listUserUseCase";
import { CreateUserUseCase } from "../../application/createUserUseCase";
import { DeleteUserUseCase } from "../../application/deleteUser.useCase";
import { FindByIDUserUseCase } from "../../application/findByIdUserUseCase";
import { UpdateUserUseCase } from "../../application/updateUserUseCase";

import CreateUserDto from "../dtos/createUser.dto";
import UpdateUserDto from "../dtos/updateUser.dto";
import { UserListResponseDto, UserResponseDto } from "../dtos/userResponse.dto";
import { DomainErrorFilter } from "../filters/domain-error.filter";

@Controller('users')
@ApiTags("users")
@UseFilters(DomainErrorFilter)
export class UserController {

    constructor(
        private readonly listUserUseCase: ListUserUseCase,
        private readonly createUserUseCase: CreateUserUseCase,
        private readonly findByIdUserUseCase: FindByIDUserUseCase,
        private readonly updateUserUseCase: UpdateUserUseCase,
        private readonly deleteUserUseCase: DeleteUserUseCase
    ) { }

    @Get()
    @HttpCode(200)
    @ApiOperation({ summary: 'Obtener la lista de todos los empleados activos' })
    @ApiResponse({ status: 200, description: 'Lista de usuarios', type: [UserListResponseDto] })
    async findAll(): Promise<UserListResponseDto> {
        const users = await this.listUserUseCase.run();
        return UserListResponseDto.success(users, 'Usuarios listados exitosamente');
    }

    @Post('/')
    @HttpCode(201)
    @ApiOperation({ summary: 'Crear un nuevo empleado en KFE' })
    @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.', type: UserResponseDto })
    async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        const user = await this.createUserUseCase.run(createUserDto);
        return UserResponseDto.success(user, 'Usuario creado exitosamente en el sistema');
    }

    @Get('/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Buscar empleado en KFE por ID' })
    @ApiResponse({ status: 200, description: 'Usuario Encontrado', type: UserResponseDto })
    async findById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
        const user = await this.findByIdUserUseCase.run(id);
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return UserResponseDto.success(user, 'Usuario encontrado');
    }

    @Patch('/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Actualizar datos de un empleado en KFE' })
    @ApiResponse({ status: 200, description: 'Datos actualizados del empleado', type: UserResponseDto })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserResponseDto> {
        const user = await this.updateUserUseCase.run(id, updateUserDto);
        return UserResponseDto.success(user, 'Datos actualizados del empleado');
    }

    @Delete('/:id')
    @HttpCode(200)
    @ApiOperation({ summary: 'Dar de baja a un usuario' })
    @ApiResponse({ status: 200, description: 'Usuario dado de baja' })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<{ message: string }> {
        await this.deleteUserUseCase.run(id);
        return { message: 'User deleted successfully' };
    }
}