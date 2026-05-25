import { IsOptional, IsDate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetSalesMetricsDto {
    @ApiPropertyOptional({ description: 'Fecha de inicio para el reporte', example: '2026-05-01T00:00:00Z' })
    @IsOptional()
    @IsDate({ message: 'La fecha de inicio debe ser una fecha válida' })
    @Type(() => Date)
    startDate?: Date;

    @ApiPropertyOptional({ description: 'Fecha de fin para el reporte', example: '2026-05-31T23:59:59Z' })
    @IsOptional()
    @IsDate({ message: 'La fecha de fin debe ser una fecha válida' })
    @Type(() => Date)
    endDate?: Date;

    @ApiPropertyOptional({ description: 'Límite de resultados (ej. 3 para el Top 3)', example: 3 })
    @IsOptional()
    @IsInt()
    @Min(1)
    @Type(() => Number)
    limit?: number;
}