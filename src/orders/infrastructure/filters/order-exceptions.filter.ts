import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { EmptyOrderError } from '../../domain/errors/emptyOrderError';
import { InsufficientStockError } from '../../domain/errors/insufficientStockError';
import { OrderAlreadyCanceledError } from '../../domain/errors/orderAlreadyCanceledError';
import { OrderNotFoundError } from '../../domain/errors/orderNotFoundError';
import { ProductNotFoundError } from '../../../products/domain/errors/productNotFoundError';



@Catch(Error) 
export class OrderDomainErrorFilter implements ExceptionFilter {
    
    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (
            exception instanceof EmptyOrderError || 
            exception instanceof InsufficientStockError || 
            exception instanceof OrderAlreadyCanceledError
        ) {
            return response.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: exception.message,
                error: 'Bad Request'
            });
        }


        if (
            exception instanceof OrderNotFoundError || 
            exception instanceof ProductNotFoundError
        ) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: exception.message,
                error: 'Not Found'
            });
        }

        if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json(exception.getResponse());
        }

        console.error('Error no controlado en Órdenes:', exception);
        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
}