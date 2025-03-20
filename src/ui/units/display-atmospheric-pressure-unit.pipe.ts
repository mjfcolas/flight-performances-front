import {Pipe, PipeTransform} from '@angular/core';
import {displayAtmosphericPressureUnit, displayTemperatureUnit} from "./format-unit";
import {TemperatureUnit} from "../../domain/physical-quantity/temperature";
import {AtmosphericPressureUnit} from "../../domain/physical-quantity/atmospheric-pressure";

@Pipe({
  name: 'displayAtmosphericPressureUnit',
  standalone: true,
})
export class DisplayAtmosphericPressureUnitPipe implements PipeTransform {

  transform(unit: AtmosphericPressureUnit | undefined): string {
    if (unit === undefined) {
      return "";
    }
    return displayAtmosphericPressureUnit(unit);
  }
}
