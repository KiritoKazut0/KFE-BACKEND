import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { OrderResponseDto } from './orderResponse.dto'; 

export class PaginatedOrderDataDto {
    @ApiProperty({ description: 'Lista de órdenes', type: [OrderResponseDto] })
    @Expose()
    @Type(() => OrderResponseDto)
    items!: OrderResponseDto[];

    @ApiProperty({ description: 'Total de órdenes', example: 150 })
    @Expose() totalItems!: number;

    @ApiProperty({ description: 'Página actual', example: 1 })
    @Expose() currentPage!: number;

    @ApiProperty({ description: 'Total de páginas', example: 15 })
    @Expose() totalPages!: number;
}


export class PaginatedOrderApiResponseDto {
    @ApiProperty({ example: true })
    @Expose() 
    success!: boolean;

    @ApiProperty({ example: 'Historial de órdenes obtenido exitosamente' })
    @Expose() 
    message!: string;

    @ApiProperty({ type: PaginatedOrderDataDto })
    @Expose()
    @Type(() => PaginatedOrderDataDto)
    data!: PaginatedOrderDataDto;
}