import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CorporativosComponent } from "./corporativos.component";
import { DetalleCorporativoComponent } from "./detalle-corporativo/detalle-corporativo.component";


const ROUTES: Routes = [
   {
      path: '',
      component: CorporativosComponent,
      data: { title: 'Corporativos' }
   },
   {
      path: 'detalle/:id',
      component: DetalleCorporativoComponent,
      data: { title: 'Detalle corporativo '}
   }
];

@NgModule({
   imports: [ RouterModule.forChild( ROUTES ) ],
   exports: [ RouterModule ]
})
export class CorporativosRoutingModule { }
