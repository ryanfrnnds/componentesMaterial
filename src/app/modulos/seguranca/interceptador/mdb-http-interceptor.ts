import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MDB } from '../../../util/mdb';

@Injectable()
export class MdbHttpInterceptor implements HttpInterceptor {
constructor() { }

intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq: HttpRequest<any>;
    let cabecalho = req.headers ? req.headers.append('Content-Type', 'application/json; charset=utf-8') : new HttpHeaders().append('Content-Type', 'application/json; charset=utf-8');
    if (MDB.contexto().possuiLogin()) {
      cabecalho = cabecalho.set('X-MDB_TOKEN', MDB.contexto().localStorage.usuario.token);
    }
    authReq = req.clone({headers: cabecalho});
    return next.handle(authReq);
  }
}



