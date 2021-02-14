interface BinnacleModel {
   id: number,
   S_Activo: number,
   created_at: string,
   updated_at: string,
   deleted_at?: string,
   tw_corporativo_id?: number
}

interface PropsCorporateModel extends BinnacleModel {
   S_NombreCorto: string,
   S_NombreCompleto: string,
   S_LogoURL: string,
   S_DBName: string,
   S_DBUsuario: string,
   S_SystemUrl: string,
   D_FechaIncorporacion: string,
   tw_users_id: number,
   FK_Asignado_id: number,
   user_created: UserModel,
   asignado: UserModel,
   url?: string
}

interface UserModel extends BinnacleModel {
   username: string,
   email: string,
   S_Nombre: string,
   S_Apellidos: string,
   S_FotoPerfilURL: string,
   verification_token: string,
   verified: string,
   tw_role_id: number
}

interface TwEmpresaCorporativo extends BinnacleModel {
   S_RazonSocial: string,
   S_RFC: string,
   S_Pais: string,
   S_Estado: string,
   S_Municipio: string,
   S_ColoniaLocalidad: string,
   S_Domicilio: string,
   N_CodigoPostal: number,
   S_UsoCFDI: string,
   S_UrlRFC: string,
   S_UrlActaConstitutiva: string,
   S_Comentarios: string
}

interface TwContratoCorporativo extends BinnacleModel {
   D_FechaInicio: string,
   D_FechaFin: string,
   S_URLContrato: string
}

interface TwDocumento extends BinnacleModel {
   S_Nombre: string,
   N_Obligatorio: number,
   S_Descripcion: string
}

interface TwDocumentoCorporativo extends BinnacleModel {
   tw_documento_id: number,
   S_ArchivoUrl: string,
   tw_documento: TwDocumento
}

interface PropsCorporateDetail extends PropsCorporateModel {
   tw_empresas_corporativo: TwEmpresaCorporativo[],
   tw_contactos_corporativo: TwContactoCorporativo[],
   tw_contratos_corporativo: TwContratoCorporativo[],
   tw_documentos_corporativo: TwDocumentoCorporativo[]
}

export interface TwContactoCorporativo extends BinnacleModel {
   S_Nombre: string,
   S_Puesto: string,
   S_Comentarios: string,
   N_TelefonoFijo: number,
   N_TelefonoMovil: number,
   S_Email: string,
   tw_corporativo_id: number
}

export interface ReqTwContactoCorporativo {
   S_Nombre: string,
   S_Puesto: string,
   S_Comentarios: string,
   N_TelefonoFijo: number,
   N_TelefonoMovil: number,
   S_Email: string,
   tw_corporativo_id: number
}

export interface ColumnsCorporativoModel {
   name: string;
   prop: string;
}

export interface CorporateModel extends PropsCorporateModel {
   user_created: UserModel,
   asignado: UserModel,
   url?: string
}

export interface UpdCorporativoDetailModel {
   id: number,
   S_NombreCorto: string,
   S_NombreCompleto: string,
   S_LogoURL: string,
   S_Activo: number,
   FK_Asignado_id: number,
   D_FechaIncorporacion: string
}

export interface CorporateDetailModel {
   corporativo: PropsCorporateDetail;
}
