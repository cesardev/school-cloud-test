import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { TwContactoCorporativo, UpdCorporativoDetailModel, ReqTwContactoCorporativo } from '../models/corporativos.model';

@Injectable({ providedIn: 'root' })
export class CorporativoService {

  private readonly API = environment.apiURL;

  constructor(
    private readonly _http: HttpClient
  ) { }

  public getCorporates(): Observable<{ data: [] }> {
    return this._http.get<{ data: [] }>( `${this.API}/corporativos` );
  }

  public getCorporateDetail( idCorporate: number ): Observable<{ data: object }> {
    return this._http.get<{ data: object }>( `${this.API}/corporativos/${idCorporate}` );
  } 

  public updateCorporateDetail( corpDetail: UpdCorporativoDetailModel ): Observable<{ data: object }> {
    return this._http.put<{ data: object }>( `${this.API}/corporativos/${corpDetail.id}`, corpDetail );
  }

  public saveContactCorporateDetail( contact: ReqTwContactoCorporativo ): Observable<{ data: object }> {
    return this._http.post<{ data: object }>( `${this.API}/contactos`, contact );
  }
  
  public updateContactCorporateDetail( contact: ReqTwContactoCorporativo, idContact: number ): Observable<{ data: object }> {
    return this._http.put<{ data: object }>( `${this.API}/contactos/${idContact}`, contact );
  }

  public deleteContactCorporateDetail( idContact: number ): Observable<{ data: string }> {
    return this._http.delete<{ data: string }>( `${this.API}/contactos/${idContact}` );
  }

}
