import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CorporativoService } from '../services/corporativo.service';
import swal from 'sweetalert2';
import { CorporateDetailModel, TwContactoCorporativo, UpdCorporativoDetailModel, ReqTwContactoCorporativo } from '../models/corporativos.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MomentService } from 'app/shared/services/moment.service';
import { NgbDate, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-detalle-corporativo',
  templateUrl: './detalle-corporativo.component.html',
  styles: [
    `
    .table-detalle-corp {
      display: table !important;
    }
    .table-detalle-corp thead tr th,
    .table-detalle-corp tbody tr td {
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
    }
    .table-detalle-corp thead tr th {
      font-weight: 500;
      background-color: #ececec;
    }

    @media screen and ( max-width: 1245px ) {
      .table-detalle-corp {
        display: block !important;
      }
    } 
    `
  ]
})
export class DetalleCorporativoComponent implements OnInit {

  private idCorporate: number;

  public idContactCorporate: number;
  public corporateDetail: CorporateDetailModel;
  public lstCorpContacts: TwContactoCorporativo[];

  public sizeContainerDetail: string = 'col-md-9';
  public flgEditContact: boolean = false;

  private emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';

  // Formulario de datos generales
  public generalForm: FormGroup = new FormGroup({
    shortName: new FormControl( { value: '', disabled: true }, [ ] ),
    fullName: new FormControl( { value: '', disabled: true }, [ ] ),
    status: new FormControl( { value: '', disabled: true }, [ Validators.required ]),
    incorporationDate: new FormControl( { value: '', disabled: true }, [ Validators.required ] ),
    systemUrl: new FormControl( { value: '', disabled: true }, [ Validators.required ] )
  });

  // Formulario de contactos
  public contactsForm: FormGroup = new FormGroup({
    name: new FormControl( { value: '', disabled: false }, [ Validators.required ]),
    position: new FormControl( { value: '', disabled: false }, [ Validators.required ]),
    comments: new FormControl( { value: '', disabled: false }, [ Validators.required ]),
    landLine: new FormControl( { value: '', disabled: false }, [
      Validators.required, Validators.maxLength( 10 )
    ]),
    cellPhone: new FormControl( { value: '', disabled: false }, [
      Validators.required
    ]),
    email: new FormControl( { value: '', disabled: false }, [
      Validators.required, Validators.pattern( this.emailPattern )
    ])
  });

  constructor(
    private readonly _spinner: NgxSpinnerService,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _corporateService: CorporativoService,
    private readonly _moment: MomentService
  ) { }

  // Instancia de controles para formulario general
  public get genFrm() { return this.generalForm.controls }

  // Instancia de controles formulario contactos
  public get conFrm() { return this.contactsForm.controls }

  public ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe( ( params: ParamMap ) => {
      this.idCorporate = Number( params.get( 'id' ) );
      this.getCorporateDetail();
    });
  }

  private getCorporateDetail(): void {

    if ( !this.idCorporate ) { return; }

    this._spinner.show();

    this._corporateService.getCorporateDetail( this.idCorporate ).subscribe(
      ( response: { data: object } ) => {

        this._spinner.hide();
        this.corporateDetail = ( response.data as CorporateDetailModel );
        this.lstCorpContacts = this.corporateDetail.corporativo.tw_contactos_corporativo;
        this.captureGeneralData( this.corporateDetail );
      },
      ( error ) => {

        this._spinner.hide();
        this.toast( 'error', 'Ocurrió un error al intentar obtener el corporativo' );

      }
    );

  }

  private captureGeneralData( corpDetail: CorporateDetailModel ): void {

    const date = new Date( corpDetail.corporativo.D_FechaIncorporacion );
    const incorpoYear = Number( this._moment.format( date, 'YYYY') );
    const incorpoMonth = Number( this._moment.format( date, 'MM' ) );
    const incorpoDay = Number( this._moment.format( date, 'DD' ) );

    this.generalForm.patchValue({
      shortName: corpDetail.corporativo.S_NombreCorto,
      fullName: corpDetail.corporativo.S_NombreCompleto,
      status: corpDetail.corporativo.S_Activo,
      incorporationDate: new NgbDate( incorpoYear, incorpoMonth, incorpoDay ),
      systemUrl: corpDetail.corporativo.S_SystemUrl
    });

  }

  public updateCorporateDetail(): void {
    
    const date: NgbDate = this.generalForm.value.incorporationDate;
    const month: string = date.month < 10 ? `0${String( date.month )}` : String( date.month );
    const day: string = date.day < 10 ? `0${String( date.day )}` : String( date.day );
    const hour: string = new Date().getHours() < 10 ? `0${new Date().getHours()}` : String( new Date().getHours() );
    const min: string = new Date().getMinutes() < 10 ? `0${new Date().getMinutes()}` : String( new Date().getMinutes() );
    const sec: string = new Date().getSeconds() < 10 ? `0${new Date().getSeconds()}` : String( new Date().getSeconds() );

    const request: UpdCorporativoDetailModel = {
      id: this.corporateDetail.corporativo.id,
      S_NombreCorto: this.generalForm.value.shortName,
      S_NombreCompleto: this.generalForm.value.fullName,
      S_LogoURL: this.corporateDetail.corporativo.S_LogoURL,
      S_Activo: this.generalForm.value.status,
      FK_Asignado_id: this.corporateDetail.corporativo.FK_Asignado_id,
      D_FechaIncorporacion: `${date.year}-${month}-${day} ${hour}:${min}:${sec}`
    };

    this._corporateService.updateCorporateDetail( request ).subscribe(
      ( response: { data: object } ) => {

        this.toast( 'success', 'Detalle guardado correctamente' );

        this.generalForm.disable();
        this.getCorporateDetail();

      },
      ( error ) => {

        this.toast( 'error', 'Ocurrió un error al intentar guardar el detalle' );

      }
    );
  }

  public changeTab( event: NgbNavChangeEvent ): void {
    this.sizeContainerDetail = event.nextId === 1 ? 'col-md-9' : 'col-md-11';
  }

  public editContact( contact: TwContactoCorporativo ): void {
    
    this.idContactCorporate = contact.id;

    this.contactsForm.patchValue({
      name: contact.S_Nombre,
      position: contact.S_Puesto,
      comments: contact.S_Comentarios,
      landLine: contact.N_TelefonoFijo,
      cellPhone: contact.N_TelefonoMovil,
      email: contact.S_Email
    });

    this.flgEditContact = true;

  }

  public saveContact(): void {

    if ( this.findInvalidControls( this.contactsForm ) ) { return; }

    const request: ReqTwContactoCorporativo = this.getRequestContact();

    this._spinner.show();

    this._corporateService.saveContactCorporateDetail( request ).subscribe(
      ( response: { data: object } ) => {
        
        this._spinner.hide();

        this.toast( 'success', 'Contacto guardado correctamente' );

        this.flgEditContact = false;
        this.contactsForm.reset();
        this.getCorporateDetail();
      },
      ( error ) => {
        this._spinner.hide();
        this.toast( 'error', 'Ocurrió un error al guardar el contacto' );
      }
    );

  }

  public updateContact(): void {

    if ( this.findInvalidControls( this.contactsForm ) ) { return; }

    const request: ReqTwContactoCorporativo = this.getRequestContact();

    this._spinner.show();

    this._corporateService.updateContactCorporateDetail( request, this.idContactCorporate ).subscribe(
      ( response: { data: object } ) => {

        this._spinner.hide();

        this.toast( 'success', 'Contacto actualizado correctamente' );

        this.flgEditContact = false;
        this.contactsForm.reset();
        this.getCorporateDetail();
      },
      ( error ) => {
        this._spinner.hide();
        this.toast( 'error', 'Ocurrió un error al actualizar el contacto' );
      }
    );
  }

  public deleteContact( idContact: number ): void {

    swal.fire({
      title: '¿Seguro que desea eliminar este contacto?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      cancelButtonText: 'No',
      confirmButtonText: 'Si',
      customClass: {
        cancelButton: 'btn btn-danger mr-3',
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false,
      reverseButtons: true
    }).then( ( result: { value: boolean } ) => {
      if ( result.value ) {

        this._spinner.show();

        this._corporateService.deleteContactCorporateDetail( idContact ).subscribe(
          ( response: { data: string } ) => {
            this._spinner.hide();
            this.toast( 'success', response.data );
            this.getCorporateDetail();
          },
          ( error ) => {
            this._spinner.hide();
            this.toast( 'error', 'Ocurrió un error al eliminar el contacto' );
          }
        );
      }
    });

  }

  private getRequestContact(): ReqTwContactoCorporativo {
    return {
      S_Nombre: this.contactsForm.value.name,
      S_Puesto: this.contactsForm.value.position,
      S_Comentarios: this.contactsForm.value.comments,
      N_TelefonoFijo: this.contactsForm.value.landLine,
      N_TelefonoMovil: this.contactsForm.value.cellPhone,
      S_Email: this.contactsForm.value.email,
      tw_corporativo_id: this.corporateDetail.corporativo.id
    }
  }

  private findInvalidControls( form: FormGroup ): boolean {

    let invalid = false;

    const controls = form.controls;

    for ( const name in controls ) {
      if ( controls[name].invalid ) {
        controls[name].markAsTouched();
        controls[name].markAsDirty();
        invalid = true;
      }
    }

    return invalid;
  }

  private toast( type: any, message: string ): void {

    const toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: false
    });

    toast.fire({
      icon: type,
      title: message
    });

  }
}
