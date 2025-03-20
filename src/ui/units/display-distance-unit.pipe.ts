import {Pipe, PipeTransform} from '@angular/core';
import {DistanceUnit} from "../../domain/physical-quantity/distance";
import {displayDistanceUnit} from "./format-unit";

@Pipe({
  name: 'displayDistanceUnit',
  standalone: true,
})
export class DisplayDistanceUnitPipe implements PipeTransform {

  transform(unit: DistanceUnit | undefined): string {
    if (unit === undefined) {
      return "";
    }
    return displayDistanceUnit(unit);
  }
}
