import { ApiProperty } from "@nestjs/swagger";
import { type ProductType, Product } from "../../domain/product";

export class ProductDataDto {
    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
    id!: string;

    @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
    categoryId!: string;

    @ApiProperty({ example: "Café Americano" })
    name!: string;

    @ApiProperty({ enum: ['STANDARD', 'PREPARED', 'KIT'] })
    typeProduct!: ProductType;

    @ApiProperty({ example: 45.5 })
    price!: number;

    @ApiProperty({ example: 100, required: false, nullable: true })
    stock!: number | null;

    @ApiProperty({ example: "https://res.cloudinary.com/image/upload/v1234/kfe/products/archivo.jpg" })
    imageUrl!: string;
}

export class PaginationMetaDto {
    @ApiProperty({ example: 1, description: "Página actual" })
    page!: number;

    @ApiProperty({ example: 5, description: "Total de paginas" })
    totalPages!: number;
}

export class ProductResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la operación finalizó con éxito' })
    success!: boolean;

    @ApiProperty({ example: 'Operación realizada con éxito', description: 'Mensaje descriptivo' })
    message!: string;

    @ApiProperty({ type: ProductDataDto, description: 'Datos resultantes' })
    data!: ProductDataDto

    static success(product: Product, message = "Producto Creado"): ProductResponseDto {
        const productData = new ProductDataDto();
        productData.id = product.id;
        productData.categoryId = product.categoryId;
        productData.name = product.name;
        productData.price = product.price;
        productData.stock = product.stock;
        productData.typeProduct = product.typeProduct;
        productData.imageUrl = product.imageUrl;

        const response = new ProductResponseDto();
        response.success = true;
        response.message = message;
        response.data = productData;

        return response;

    }

}

export class ProductListResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la operación finalizó con éxito' })
    success!: boolean;

    @ApiProperty({ example: 'Productos listados correctamente', description: 'Mensaje descriptivo' })
    message!: string;

    @ApiProperty({ type: [ProductDataDto], description: 'Lista de Productos' })
    data!: ProductDataDto[];

    @ApiProperty({ type: PaginationMetaDto })
    meta!: PaginationMetaDto;

    static success(
        products: ProductDataDto[],
        page: number,
        totalPages: number,
        message = "Lista de Productos"
    ): ProductListResponseDto {
        const response = new ProductListResponseDto();

        response.success = true;
        response.message = message;

        response.data = products.map(product => {
            const productData = new ProductDataDto();
            productData.id = product.id;
            productData.categoryId = product.categoryId;
            productData.name = product.name;
            productData.price = product.price;
            productData.stock = product.stock;
            productData.typeProduct = product.typeProduct;
            productData.imageUrl = product.imageUrl;
            return productData;
        });

        response.meta = {
            page,
            totalPages
        };

        return response;
    }

}