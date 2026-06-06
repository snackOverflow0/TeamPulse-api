import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define the absolute JSON response contract for the front-end engineering team
export interface Response<T> {
  success: boolean;
  timestamp: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        timestamp: new Date().toISOString(),
        // If an endpoint already returns a custom object with a message, pass it through seamlessly
        data: data?.message || data?.success !== undefined ? data : data,
      })),
    );
  }
}