import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserAlreadyExistsError } from '../../domain/errors/UserAlreadyExistsError';
import { UserNotFoundError } from '../../domain/errors/UserNotFoundError';
import { UserAlreadyDeletedError } from '../../domain/errors/UserAlreadyDeletedError';

@Catch(Error) 
export class DomainErrorFilter implements ExceptionFilter {

    catch(exception: Error, host: ArgumentsHost) {
        
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        if (exception instanceof UserAlreadyExistsError || exception instanceof UserAlreadyDeletedError) {
            return response.status(HttpStatus.CONFLICT).json({
                statusCode: HttpStatus.CONFLICT,
                message: exception.message,
                error: 'Conflict'
            });
        }

        if (exception instanceof UserNotFoundError) {
            return response.status(HttpStatus.NOT_FOUND).json({
                statusCode: HttpStatus.NOT_FOUND,
                message: exception.message,
                error: 'Not Found'
            });
        }

        if (exception instanceof HttpException) {
            return response.status(exception.getStatus()).json(exception.getResponse());
        }

        return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error'
        });
    }
}