import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../domain/category';

export class CategoryDataDto {
    @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000', description: 'ID único' })
    id!: string;

    @ApiProperty({ example: 'Bebidas', description: 'Nombre de la categoria' })
    name!: string;

    @ApiProperty({ example: "Cafés y tés servidos a temperatura alta", description: "Descripcion de la categoria" })
    description!: string;
}

export class CategoryResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la operación finalizó con éxito' })
    success!: boolean;

    @ApiProperty({ example: 'Operación realizada con éxito', description: 'Mensaje descriptivo' })
    message!: string;

    @ApiProperty({ type: CategoryDataDto, description: 'Datos resultantes' })
    data!: CategoryDataDto


    static success(category: Category, message: string = "Operación exitosa"): CategoryResponseDto {
        const categoryData = new CategoryDataDto();
        categoryData.id = category.id;
        categoryData.name = category.name;
        categoryData.description = category.description;

        const response = new CategoryResponseDto();
        response.success = true;
        response.message = message;
        response.data = categoryData

        return response
    }
}


export class CategoryListResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la operación finalizó con éxito' })
    success!: boolean;

    @ApiProperty({ example: 'Operación realizada con éxito', description: 'Mensaje descriptivo' })
    message!: string;

    @ApiProperty({ type: CategoryDataDto, description: 'Datos resultantes' })
    data!: CategoryDataDto[];


    static success(categories: Category[], message: string = "Operación exitosa") : CategoryListResponseDto{

        const response = new CategoryListResponseDto();
        response.success = true;
        response.message = message;
        response.data = categories.map(category => {
            const categoryData = new CategoryDataDto();
            categoryData.id = category.id;
            categoryData.name = category.name;
            categoryData.description = category.description;
            return categoryData;
        });

        return response;
    }
}


