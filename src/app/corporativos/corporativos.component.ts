import { Component, OnInit, ViewChild } from '@angular/core';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { MomentService } from '../shared/services/moment.service';
import { environment } from '../../environments/environment';
import { ColumnsCorporativoModel, CorporateModel } from './models/corporativos.model';
import { CorporativoService } from './services/corporativo.service';
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';


@Component({
  selector: 'app-corporativos',
  templateUrl: './corporativos.component.html',
  styles: []
})
export class CorporativosComponent implements OnInit {

  @ViewChild( DatatableComponent ) table: DatatableComponent;

  public rows: CorporateModel[];
  public ColumnMode = ColumnMode;
  public limitRef = 10;

  public columns: ColumnsCorporativoModel[] = [
    { name: "CORPORATIVO", prop: "corporativo" },
    { name: "URL", prop: "url" },
    { name: "INCORPORACIÓN", prop: "incorporacion" },
    { name: "CREADO EL", prop: "creado" },
    { name: "ASIGNADO A", prop: "asignado" },
    { name: "STATUS", prop: "status" },
    { name: "ACCIONES", prop: "acciones" }
  ];

  private domain: string = environment.domain;
  private tempData: CorporateModel[] = [];

  constructor(
    private readonly _spinner: NgxSpinnerService,
    private readonly _corporateService: CorporativoService,
    private readonly _moment: MomentService
  ) { }

  public ngOnInit(): void {
    this.getCorporates();
  }

  private getCorporates(): void {

    this._spinner.show();

    this._corporateService.getCorporates().subscribe(
      ( response: { data: [] } ) => {

        this._spinner.hide();
        this.rows = this.formatPropertiesCorps( response.data );

      },
      ( error ) => {

        this._spinner.hide();

        swal.fire({
          title: "¡Error!",
          text: "Ocurrió un error al intentar obtener los corporativos",
          icon: "error",
          customClass: {
            confirmButton: 'btn btn-primary'
          },
          buttonsStyling: false,
        });

      }
    );
  }

  private formatPropertiesCorps( corps: CorporateModel[] ): CorporateModel[] {

    const domainWithoutProtocol = this.domain.split('//')[1];

    corps.map(
      ( corp: CorporateModel ) => {

        const dateIncorporation = this._moment.format( new Date( corp.D_FechaIncorporacion ), 'D-MMM-YYYY' );
        const dateCreateAt = this._moment.format( new Date( corp.created_at ), 'DD-MMM-YYYY' );

        corp.url = `${domainWithoutProtocol}/sa/#/${corp.S_SystemUrl}`;
        corp.D_FechaIncorporacion = dateIncorporation;
        corp.created_at = dateCreateAt;

        return corp;
      }
    );

    this.tempData = corps;

    return corps;
  }

  public updateLimit( limit: any ): void {
    this.limitRef = limit.target.value;
  }

  public filterUpdate( event: any ): void {

    const val = event.target.value.toLowerCase();

    const temp = this.tempData.filter(
      ( corp: CorporateModel ) => 
        corp.S_NombreCorto.toLowerCase().indexOf( val ) !== -1 || !val
    );

    this.rows = temp;

    this.table.offset = 0;
  }

}
