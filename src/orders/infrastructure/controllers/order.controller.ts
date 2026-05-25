import { 
    Controller, 
    Post, 
    Get, 
    Patch, 
    Body, 
    Param, 
    Query, 
    UseInterceptors, 
    ClassSerializerInterceptor, 
    UseFilters,
    UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CreateOrderUseCase } from '../../application/createOrderUseCase';
import { CancelOrderUseCase } from '../../application/cancelOrderUseCase';
import { ListOrdersUseCase } from '../../application/listOrdersUseCase';
import { GetProductSalesUseCase } from '../../application/getProductSalesUseCase';
import { CreateOrderDto } from '../dtos/createOrder.dto';
import { GetSalesMetricsDto } from '../dtos/getSalesMetrics.dto'; 
import { OrderApiResponseDto } from '../dtos/orderResponse.dto';
import { PaginatedOrderApiResponseDto } from '../dtos/paginatedOrderResponse';
import { SalesMetricsApiResponseDto } from '../dtos/getSalesMetricsResponse.dto';
import { OrderDomainErrorFilter } from '../filters/order-exceptions.filter';
import { AuthGuard } from '../../../core/security/guards/auth.guard';
import { RolesGuard } from '../../../core/security/guards/roles.guard';
import { Roles } from '../../../core/security/decorators/roles.decorator';
import { UserRole } from '../../../users/domain/user';

@ApiTags('Orders')
@Controller('orders')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(ClassSerializerInterceptor) 
@UseFilters(OrderDomainErrorFilter)

export class OrdersController {
    constructor(
        private readonly createOrderUseCase: CreateOrderUseCase,
        private readonly cancelOrderUseCase: CancelOrderUseCase,
        private readonly listOrdersUseCase: ListOrdersUseCase,
        private readonly getProductSalesUseCase: GetProductSalesUseCase
    ) {}

    @Roles(UserRole.ADMIN, UserRole.CASHIER, UserRole.MANAGER)
    @Post()
    @ApiOperation({ summary: 'Crear un nuevo ticket de venta y descontar inventario' })
    @ApiResponse({ status: 201, type: OrderApiResponseDto })
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderApiResponseDto> {
        const order = await this.createOrderUseCase.run(createOrderDto);
        return {
            success: true,
            message: 'Orden procesada exitosamente',
            data: order 
        };
    }


    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Get('metrics/sales')
    @ApiOperation({ summary: 'Obtener gráficas y los productos más vendidos' })
    @ApiResponse({ status: 200, type: SalesMetricsApiResponseDto })
    async getSalesMetrics(@Query() query: GetSalesMetricsDto): Promise<SalesMetricsApiResponseDto> {
        const metrics = await this.getProductSalesUseCase.run(query);
        
        return {
            success: true,
            message: 'Reporte de ventas generado exitosamente',
            data: metrics as any
        };
    }

    @Roles(UserRole.ADMIN, UserRole.MANAGER)
    @Get()
    @ApiOperation({ summary: 'Obtener el historial de órdenes con paginación' })
    @ApiResponse({ status: 200, type: PaginatedOrderApiResponseDto })
    async listOrders(
        @Query('page') page: string = '1',
        @Query('limit') limit: string = '10'
    ): Promise<PaginatedOrderApiResponseDto> {
        const pageNumber = Number.parseInt(page, 10);
        const limitNumber = Number.parseInt(limit, 10);

        const result = await this.listOrdersUseCase.run(pageNumber, limitNumber);
        const totalPages = Math.ceil(result.total / limitNumber);

        return {
            success: true,
            message: 'Historial de órdenes obtenido exitosamente',
            data: {
                items: result.items as any,
                totalItems: result.total,
                currentPage: pageNumber,
                totalPages: totalPages
            }
        };
    }

    @Roles(UserRole.ADMIN)
    @Patch(':id/cancel')
    @ApiOperation({ summary: 'Cancelar una orden pagada y efectuar la acción compensatoria (devolver stock)' })
    @ApiResponse({ status: 200, type: OrderApiResponseDto })
    async cancelOrder(@Param('id') id: string): Promise<OrderApiResponseDto> {
        const order = await this.cancelOrderUseCase.run(id);

        return {
            success: true,
            message: 'Orden cancelada y stock devuelto exitosamente',
            data: order as any
        };
    }
}