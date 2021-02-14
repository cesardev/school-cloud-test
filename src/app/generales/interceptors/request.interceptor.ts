import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RequestInterceptor implements HttpInterceptor {
 
   public intercept( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

      const token: string = `Bearer ${localStorage.getItem( 'tokenscloud' )}`;

      if ( token ) {

         request = request.clone({ headers: request.headers.set( 'Accept', 'application/json' ) });
   
         if ( !request.headers.has( 'Content-Type' ) ) {
            request = request.clone({ headers: request.headers.set( 'Content-Type', 'application/json;charset=UTF-8' ) });
         }
   
         request = request.clone({ headers: request.headers.set( 'Authorization', token ) });

      }

      return next.handle( request );
   }
   
}