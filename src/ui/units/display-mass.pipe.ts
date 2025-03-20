import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {Mass, MassUnit} from "../../domain/physical-quantity/mass";
import {formatMass} from "./format-physical-value";

@Pipe({
  name: 'displayMass',
  standalone: true
})
export class DisplayMassPipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private readonly locale: string) {
  }

  transform(value: Mass, unit: MassUnit | undefined): string {
    if(unit === undefined){
      return '';
    }
    return formatMass(value, unit, this.locale);
  }
}
