import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AlertService } from '@app/_services';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private alertService: AlertService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 200 && err.error && 'TagId' in err.error && 'TagName' in err.error) {
                // This is an OK response, not an error. Don't throw an error.
                return of(err);
            }

            if(err.status === 500 && err.statusText === 'OK' && err.error && "SQLite Error 19: 'FOREIGN KEY constraint failed'"){
                this.alertService.error("This item is in use and cannot be deleted.", { autoClose: true });
                return throwError(() => err);
            }
    
            const error = err.error?.message || err.statusText;
            this.alertService.error(error);
            console.error(err);
            return throwError(() => error);
        }))
    }
}