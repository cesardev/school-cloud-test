import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporativosComponent } from './corporativos.component';
import { CorporativosRoutingModule } from './corporativos-routing.module';
import { DetalleCorporativoComponent } from './detalle-corporativo/detalle-corporativo.component';
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { RequestInterceptor } from '../generales/interceptors/request.interceptor';
import { CorporativoService } from './services/corporativo.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnlyNumbersDirective } from '../shared/directives/only-numbers.directive';


@NgModule({
  declarations: [
    CorporativosComponent,
    DetalleCorporativoComponent,
    OnlyNumbersDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CorporativosRoutingModule,
    NgxDatatableModule,
    NgbModule
  ],
  exports: [
    OnlyNumbersDirective
  ],
  providers: [
    CorporativoService,
    RequestInterceptor,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }
  ]
})
export class CorporativosModule { }
