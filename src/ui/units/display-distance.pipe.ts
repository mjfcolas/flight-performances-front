import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {Temperature, TemperatureUnit} from "../../domain/physical-quantity/temperature";
import {Distance, DistanceUnit} from "../../domain/physical-quantity/distance";
import {DecimalPipe, formatNumber} from "@angular/common";
import {formatDistance} from "./format-physical-value";

@Pipe({
  name: 'displayDistance',
  standalone: true,
})
export class DisplayDistancePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private readonly locale: string) {
  }

  transform(value: Distance, unit: DistanceUnit): string {
    return formatDistance(value, unit, this.locale);
  }
}
