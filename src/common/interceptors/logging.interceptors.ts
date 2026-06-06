import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const method = request.method;
    const url = request.url;
    const startTime = Date.now();

    // Safely pull user identification if they are logged in
    const userId = request.user?.id || 'ANONYMOUS';

    return next.handle().pipe(
      // 1. SUCCESSFUL PATH LOGGER
      tap(() => {
        const duration = Date.now() - startTime;
        console.log(
          `\x1b[32m[INFO]\x1b[0m ${method} ${url} | User: ${userId} | Status: 200/201 | Duration: ${duration}ms`
        );
      }),
      // 2. EXCEPTION / ERROR PATH LOGGER
      catchError((error) => {
        const duration = Date.now() - startTime;
        const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const message = error.response?.message || error.message || 'Unknown Structural Error';

        console.error(
          `\x1b[31m[ERROR]\x1b[0m ${method} ${url} | User: ${userId} | Failed Status: ${status} | Reason: ${message} | Duration: ${duration}ms`
        );

        // Pass the error onward so Nest can send it back to the client
        return throwError(() => error);
      })
    );
  }
}