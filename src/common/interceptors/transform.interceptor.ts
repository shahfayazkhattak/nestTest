import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export interface ResponseWrapper<T> {
  data: T;
  meta: { timestamp: string };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ResponseWrapper<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>
  ): Observable<ResponseWrapper<T>> | Promise<Observable<ResponseWrapper<T>>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        meta: { timestamp: new Date().toISOString() },
      }))
    );
  }
}
