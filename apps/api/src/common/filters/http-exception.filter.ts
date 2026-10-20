import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Ichki server xatoligi yuz berdi';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const anyRes = res as any;
        if (Array.isArray(anyRes.message)) {
          errorMessage = anyRes.message.join('; ');
        } else if (anyRes.message) {
          errorMessage = anyRes.message;
        } else if (anyRes.error) {
          errorMessage = anyRes.error;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled Exception at ${request.url}: ${exception.message}`, exception.stack);
      errorMessage = exception.message || 'Kutilmagan xatolik yuz berdi';
    }

    response.status(statusCode).json({
      success: false,
      error: errorMessage,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }
}
