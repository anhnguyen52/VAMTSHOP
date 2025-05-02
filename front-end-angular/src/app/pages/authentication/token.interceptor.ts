import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationService } from "../../service/authentication.service";
import { catchError, Observable, switchMap, throwError } from "rxjs";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError(error => {
        const user = localStorage.getItem('user');
        if (user !== null) {
            const parsedUser = JSON.parse(user);
            const userId = parsedUser._id;
            const token = this.authService.getToken();
            if ( token !== null && error.status === 401 && this.authService.isTokenExpired(token)) {
                return this.authService.refreshToken(userId).pipe(
                  switchMap((response: any) => {
                    const newAccessToken = response.access_token;
                    const cloned = req.clone({
                      headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`)
                    });
                    return next.handle(cloned);
                  })
                );
            }
          } else {
            console.error("User not found in localStorage");
            return throwError(() => error);
          }
        return throwError(() => error);
      })
    );
  }
}
