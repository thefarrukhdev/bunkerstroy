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

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorMessage = 'Ichki server xatoligi yuz berdi';
    let validationDetails: string[] | undefined = undefined;

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        errorMessage = res;
      } else if (typeof res === 'object' && res !== null) {
        const anyRes = res as Record<string, any>;
        if (Array.isArray(anyRes.message)) {
          // ValidationPipe errors (array of constraint messages)
          validationDetails = anyRes.message.map(String);
          errorMessage = validationDetails.join('; ');
        } else if (typeof anyRes.message === 'string') {
          errorMessage = anyRes.message;
        } else if (typeof anyRes.error === 'string') {
          errorMessage = anyRes.error;
        }
      }
    } else if (exception instanceof Error) {
      errorMessage = exception.message || 'Kutilmagan server xatoligi yuz berdi';
    }

    const requestPath = request.originalUrl || request.url || '';

    // Log error with appropriate severity
    if (statusCode >= 500) {
      this.logger.error(
        `[${request.method || 'HTTP'}] ${requestPath} - Status: ${statusCode} - Error: ${errorMessage}`,
        exception instanceof Error ? exception.stack : undefined
      );
    } else {
      this.logger.warn(
        `[${request.method || 'HTTP'}] ${requestPath} - Status: ${statusCode} - Message: ${errorMessage}`
      );
    }

    const errorPayload: Record<string, any> = {
      success: false,
      statusCode,
      error: errorMessage,
      message: errorMessage,
      path: requestPath,
      timestamp: new Date().toISOString(),
    };

    if (validationDetails && validationDetails.length > 0) {
      errorPayload.details = validationDetails;
    }

    response.status(statusCode).json(errorPayload);
  }
}
