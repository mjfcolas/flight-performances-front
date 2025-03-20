import {Distance, DistanceUnit} from "../../domain/physical-quantity/distance";
import {formatNumber} from "@angular/common";
import {Temperature, TemperatureDifference, TemperatureUnit} from "../../domain/physical-quantity/temperature";
import {Mass, MassUnit} from "../../domain/physical-quantity/mass";
import {displayDistanceUnit, displayMassUnit, displayTemperatureUnit} from "./format-unit";

export const formatDistance = (value: Distance, unit: DistanceUnit, locale: string): string => {
  return `${formatNumber(value.valueIn(unit), locale, "1.0-0")} ${displayDistanceUnit(unit)}`;
}

export const formatTemperature = (value: Temperature | TemperatureDifference, unit: TemperatureUnit, locale: string): string => {
  return `${formatNumber(value.valueIn(unit), locale, "1.1-1")} ${displayTemperatureUnit(unit)}`;
}

export const formatMass = (value: Mass, unit: MassUnit, locale: string): string => {
  return `${formatNumber(value.valueIn(unit), locale, "1.0-0")} ${displayMassUnit(unit)}`;
}
