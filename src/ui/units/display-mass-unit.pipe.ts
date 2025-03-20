import {Pipe, PipeTransform} from '@angular/core';
import {displayMassUnit} from "./format-unit";
import {MassUnit} from "../../domain/physical-quantity/mass";

@Pipe({
  name: 'displayMassUnit',
  standalone: true,
})
export class DisplayMassUnitPipe implements PipeTransform {

  transform(unit: MassUnit | undefined): string {
    if (unit === undefined) {
      return "";
    }
    return displayMassUnit(unit);
  }
}
