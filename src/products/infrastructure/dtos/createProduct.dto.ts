import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { Type, Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { type ProductType } from "../../domain/product";

export class CreateProductDto {
    @ApiProperty({ example: "aa2rad141-awdawd1-12awda"})
    @IsUUID()
    @IsNotEmpty()
    categoryId!: string;

    @ApiProperty({ example: "Café Americano"})
    @IsString()
    @IsNotEmpty()
    name!: string;

    @ApiProperty({ enum: ['STANDARD', 'PREPARED', 'KIT'] })
    @IsEnum(['STANDARD', 'PREPARED', 'KIT'])
    @IsNotEmpty()
    typeProduct!: ProductType;

    @ApiProperty({ example: 45.5 })
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price!: number;

    @ApiProperty({ example: 100, required: false })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    stock?: number;

    @ApiProperty({ example: true })
    @Transform(({ value }) => value === 'true' || value === true)
    @IsBoolean()
    isActive!: boolean;
    
}