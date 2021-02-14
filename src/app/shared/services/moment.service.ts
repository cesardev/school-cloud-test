import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';


moment.locale( 'es' );

moment.updateLocale( 'es', {
   months: [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio',
      'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
   ],
   monthsShort: [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul',
      'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
   ],
   weekdays: [
      'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
   ],
   weekdaysShort: [
      'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'
   ]
});

@Injectable({ providedIn: 'root' })
export class MomentService {

   constructor() { }

   public today(): any { return moment; }

   /**
    * @descripcion
    * Tubería para convertir un string en formato YYYY-MM-DD a n formato
    * @param fecha : valor que se desea formatear
    * @param formato : formato del string
    *  'D MMMM, YYYY' -> 01 Enero, 2020
    *  'D/MM/YYYY HH:mm:ss' -> 01/06/2020 12:00:00
    *  'D/MM/YYYY' -> 01/06/2020
    *  'ddd, D MMMM, YYYY' -> Lunes, 01 Enero, 2020
    *  'dddd, MMMM Do YYYY, h:mm:ss a' -> Lunes, Enero 1° 2020, 12:00:00
    *  'ddd, hA' -> Lun, 12PM
    *  '[Today is] dddd' -> Lun, 12PM
    *  'cualquier cosa que no sea fecha' -> Fecha no válida
    *  Para más tipos de formatos visitar la documentación de moment.js
    *  https://momentjs.com/docs/#/displaying/format/
   */
   public format( date: Date, format: string ): string {
      return moment( date ).format( format );
   }

}
