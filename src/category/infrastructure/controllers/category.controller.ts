import { Body, Controller, Get, Post, UseGuards, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateCategoryUseCase } from "../../application/createCategoryUseCase";
import { ListCategoriesUseCase } from "../../application/listCategoriesUseCase";
import { CreateCategoryDto } from "../dtos/createCategory.dto";
import { CategoryAlreadyExistsError } from "../../domain/errors/categoryAlreadyExistsError";
import { AuthGuard } from "../../../core/security/guards/auth.guard";
import { RolesGuard } from "../../../core/security/guards/roles.guard";
import { Roles } from "../../../core/security/decorators/roles.decorator";
import { UserRole } from "../../../users/domain/user";
import { CategoryListResponseDto, CategoryResponseDto } from "../dtos/categoryResponse.dto";

@Controller('categories')
@ApiTags('Categoria de productos')
@ApiBearerAuth() 
@UseGuards(AuthGuard, RolesGuard)
export class CategoriesController {
    constructor(
        private readonly createCategoryUseCase: CreateCategoryUseCase,
        private readonly listCategoriesUseCase: ListCategoriesUseCase
    ) {}

    @Post()
    @Roles(UserRole.ADMIN) 
    @ApiOperation({ summary: "Crear una nueva categoría" })
    @ApiResponse({ status: 201, description: "Categoría creada", type: CategoryResponseDto })
    async create(@Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
        try {
            const category = await this.createCategoryUseCase.run(dto.name, dto.description);
            return CategoryResponseDto.success(
                category,
                "Categoría creada correctamente"
            )
        } catch (error) {
            if (error instanceof CategoryAlreadyExistsError) {
                throw new ConflictException(error.message);
            }
            throw new InternalServerErrorException("Error interno del servidor");
        }
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.MANAGER, UserRole.CASHIER)
    @ApiOperation({ summary: "Listar todas las categorías activas" })
    @ApiResponse({ status: 201, description: "Categoría creada", type: [CategoryListResponseDto] })
    async findAll(): Promise<CategoryListResponseDto> {
        const categories = await this.listCategoriesUseCase.run();
        return CategoryListResponseDto.success(
            categories,
            "Lista de Categorias"
        )
        
    }
}