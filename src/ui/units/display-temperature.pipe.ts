import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {Temperature, TemperatureDifference, TemperatureUnit} from "../../domain/physical-quantity/temperature";
import {formatTemperature} from "./format-physical-value";

@Pipe({
  name: 'displayTemperature',
  standalone: true
})
export class DisplayTemperaturePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private readonly locale: string) {
  }

  transform(value: Temperature | TemperatureDifference, unit: TemperatureUnit): string {
    return formatTemperature(value, unit, this.locale);
  }
}
