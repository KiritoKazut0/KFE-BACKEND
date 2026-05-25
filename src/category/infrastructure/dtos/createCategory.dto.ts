import { IsNotEmpty, IsString, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateCategoryDto {
    @ApiProperty({ example: "Bebidas Calientes" })
    @IsString()
    @IsNotEmpty()
    @MaxLength(50)
    name!: string;

    @ApiProperty({ example: "Cafés y tés servidos a temperatura alta" })
    @IsString()
    @MaxLength(255)
    description!: string;
}