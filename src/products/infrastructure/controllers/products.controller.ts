import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Post,
    Query,
    UploadedFile,
    UseGuards,
    UseInterceptors,
    BadRequestException,
    ConflictException,
    NotFoundException,
    ParseFilePipe,
    FileTypeValidator,
    MaxFileSizeValidator
} from "@nestjs/common";
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CreateProductUseCase } from "../../application/createProductUseCase";
import { DeleteProductUseCase } from "../../application/deleteProductUseCase";
import { GetProductsByCategoryUseCase } from "../../application/getProductsByCategory";
import { ListProductsUseCase } from "../../application/listProductsUseCase";
import { CreateProductDto } from "../dtos/createProduct.dto";
import { ProductAlreadyExistsError } from "../../domain/errors/productAlreadyExistsError";
import { ProductNotFoundError } from "../../domain/errors/productNotFoundError";
import { InvalidProductStockError } from "../../domain/errors/InvalidProductStockError";
import { AuthGuard } from "../../../core/security/guards/auth.guard";
import { RolesGuard } from "../../../core/security/guards/roles.guard";
import { Roles } from "../../../core/security/decorators/roles.decorator";
import 'multer';
import { ProductListResponseDto, ProductResponseDto } from "../dtos/productResponse.dto";
import { PaginatedResult } from "../../domain/productRepository";
import { Product } from "../../domain/product";
import { UserRole } from "../../../users/domain/user";

@Controller('products')
@ApiTags('Productos')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)

export class ProductsController {
    private readonly ITEMS_PER_PAGE = 12;

    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly getProductsByCategoryUseCase: GetProductsByCategoryUseCase,
        private readonly listProductsUseCase: ListProductsUseCase
    ) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({ summary: "Crear un nuevo producto con imagen" })
    @ApiConsumes('multipart/form-data')
    @ApiBody({type: CreateProductDto})
    @ApiResponse({status: 201, description: "Producto creado", type: ProductResponseDto})

    async create(
        @Body() dto: CreateProductDto,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                    new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
                    new MaxFileSizeValidator({
                        maxSize: 10 * 1024 * 1024,
                        message: 'File is too large. Max file size is 10MB',
                    }),
                ],
                fileIsRequired: true,
            }),
        )
        file: Express.Multer.File,
      
    ): Promise<ProductResponseDto> {
        try {
            const product = await this.createProductUseCase.run({
                categoryId: dto.categoryId,
                name: dto.name,
                typeProduct: dto.typeProduct,
                price: dto.price,
                stock: dto.stock ?? null,
                isActive: dto.isActive,
                imageBuffer: file.buffer
            });

            return ProductResponseDto.success(product, "Producto creado correctamente");

        } catch (error) {
            console.log(error)
            if (error instanceof ProductAlreadyExistsError) {
                throw new ConflictException(error.message);
            }
            if (error instanceof InvalidProductStockError) {
                throw new BadRequestException(error.message);
            }
            throw error;
        }
    }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.CASHIER, UserRole.MANAGER)
    @ApiOperation({ summary: "Listar todos los productos o filtrar por categoría" })
    @ApiQuery({ name: 'categoryId', required: false, type: String, description: 'UUID de la categoría (opcional)' })
    @ApiResponse({status: 200, description: "Lista de productos", type: ProductListResponseDto})
    async getProducts
        (@Query('categoryId') categoryId?: string,
            @Query('page') page: string = '1'
        ): Promise<ProductListResponseDto> {

        const pageNumber = Math.max(1, Number.parseInt(page, 10) || 1);
        let result: PaginatedResult<Product>;

        if (categoryId) {
            result = await this.getProductsByCategoryUseCase.run(categoryId, pageNumber, this.ITEMS_PER_PAGE);
        } else {
            result = await this.listProductsUseCase.run(pageNumber, this.ITEMS_PER_PAGE);

        }

        const totalPages = Math.ceil(result.total / this.ITEMS_PER_PAGE);

        return ProductListResponseDto.success(
            result.items,
            pageNumber,
            totalPages
        )

    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: "Dar de baja lógica un producto" })
    @ApiResponse({ status: 200, description: 'Producto dado de baja' })
    async deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
        try {
            await this.deleteProductUseCase.run(id);
            return {
                success: true,
                message: "Producto dado de baja correctamente"
            };
        } catch (error) {
            if (error instanceof ProductNotFoundError) {
                throw new NotFoundException(error.message);
            }
            throw error;
        }
    }
}