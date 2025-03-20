import {Pipe, PipeTransform} from '@angular/core';
import {displayTemperatureUnit} from "./format-unit";
import {TemperatureUnit} from "../../domain/physical-quantity/temperature";

@Pipe({
  name: 'displayTemperatureUnit',
  standalone: true,
})
export class DisplayTemperatureUnitPipe implements PipeTransform {

  transform(unit: TemperatureUnit | undefined): string {
    if (unit === undefined) {
      return "";
    }
    return displayTemperatureUnit(unit);
  }
}
