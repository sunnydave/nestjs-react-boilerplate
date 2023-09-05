import {
    BadGatewayException,
    CallHandler,
    ExecutionContext, HttpException,
    Injectable,
    NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(async (exception) => {
                exception instanceof HttpException
                    ? throwError(
                        new HttpException(
                            (exception as HttpException).getResponse(),
                            (exception as HttpException).getStatus(),
                        ),
                    )
                    : throwError(new BadGatewayException());
            }),
        );
    }
}
