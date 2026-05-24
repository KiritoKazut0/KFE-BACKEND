import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class SalesPeriodDto {
    @ApiProperty({ example: '2026-05-01T00:00:00Z', nullable: true })
    @Expose() from!: Date | null;

    @ApiProperty({ example: '2026-05-31T23:59:59Z', nullable: true })
    @Expose() to!: Date | null;
}

class ProductSalesMetricDto {
    @ApiProperty({ description: 'ID del producto', example: "awdawdawd" })
    @Expose() productId!: string;

    @ApiProperty({ description: 'Nombre del producto', example: "Café" })
    @Expose() productName!: string;

    @ApiProperty({ description: 'Cantidad total vendida', example: 5 })
    @Expose() quantitySold!: number;

    @ApiProperty({ description: 'Ingresos generados por este producto', example: 10 })
    @Expose() totalRevenue!: number;
}

export class SalesMetricsDataDto {
    @ApiProperty({ type: SalesPeriodDto })
    @Expose()
    @Type(() => SalesPeriodDto)
    period!: SalesPeriodDto;

    @ApiProperty({ type: [ProductSalesMetricDto] })
    @Expose()
    @Type(() => ProductSalesMetricDto)
    data!: ProductSalesMetricDto[];
}


export class SalesMetricsApiResponseDto {
    @ApiProperty({ example: true })
    @Expose() 
    success!: boolean;

    @ApiProperty({ example: 'Reporte de ventas generado exitosamente' })
    @Expose() 
    message!: string;

    @ApiProperty({ type: SalesMetricsDataDto })
    @Expose()
    @Type(() => SalesMetricsDataDto)
    data!: SalesMetricsDataDto;
}