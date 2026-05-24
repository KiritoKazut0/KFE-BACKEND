import { IsUUID, IsEnum, IsArray, ValidateNested, IsInt, Min, ArrayNotEmpty, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { type PaymentMethod } from '../../domain/order';

class OrderItemDto {
    @ApiProperty({ description: 'ID del producto a comprar', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    productId!: string;

    @ApiProperty({ description: 'Cantidad a comprar (mínimo 1)', example: 2 })
    @IsInt()
    @Min(1, { message: 'La cantidad mínima por producto es 1' })
    quantity!: number;
}

export class CreateOrderDto {
    @ApiProperty({ description: 'ID del cajero o usuario que realiza la venta', example: '123e4567-e89b-12d3-a456-426614174000' })
    @IsUUID()
    @IsNotEmpty()
    userId!: string;

    @ApiProperty({ description: 'Método de pago utilizado', enum: ['CASH', 'CARD', 'TRANSFER'], example: 'CASH' })
    @IsEnum(['CASH', 'CARD', 'TRANSFER'], { 
        message: 'El método de pago debe ser CASH, CARD o TRANSFER' 
    })
    @IsNotEmpty()
    methodPayment!: PaymentMethod;

    @ApiProperty({ description: 'Lista de productos en la orden', type: [OrderItemDto] })
    @IsArray()
    @ArrayNotEmpty({ message: 'La orden debe tener al menos un producto' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[];
}