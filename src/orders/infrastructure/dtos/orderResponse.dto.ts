import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
    @ApiProperty({ description: 'ID del ticket' })
    @Expose() id!: string;
    @ApiProperty({ description: 'ID del producto' })
    @Expose() productId!: string;
    @ApiProperty({ description: 'Cantidad comprada' })
    @Expose() quantity!: number;
    @ApiProperty({ description: 'Precio unitario al momento de la compra' })
    @Expose() unitPrice!: number;
    @ApiProperty({ description: 'Subtotal' })
    @Expose() subtotal!: number;
}

export class OrderResponseDto {
    @ApiProperty({ description: 'ID de la orden' })
    @Expose() id!: string;
    @ApiProperty({ description: 'ID del cajero que procesó la orden' })
    @Expose() userId!: string;
    @ApiProperty({ description: 'Total a pagar de la orden' })
    @Expose() total!: number;
    @ApiProperty({ description: 'Método de pago', enum: ['CASH', 'CARD', 'TRANSFER'] })
    @Expose() methodPayment!: string;
    @ApiProperty({ description: 'Estado actual de la orden', enum: ['PAID', 'CANCELED'] })
    @Expose() status!: string;
    @ApiProperty({ description: 'Fecha de creación de la orden' })
    @Expose() createdAt!: Date;

    @ApiProperty({ description: 'Detalles de la orden', type: [OrderItemResponseDto] })
    @Expose()
    @Type(() => OrderItemResponseDto)
    items!: OrderItemResponseDto[];
}


export class OrderApiResponseDto {
    @ApiProperty({ example: true, description: 'Indica si la petición fue exitosa' })
    @Expose() 
    success!: boolean;

    @ApiProperty({ example: 'Orden procesada exitosamente', description: 'Mensaje para el frontend' })
    @Expose() 
    message!: string;

    @ApiProperty({ description: 'Los datos reales de la orden', type: OrderResponseDto })
    @Expose()
    @Type(() => OrderResponseDto)
    data!: OrderResponseDto;
}