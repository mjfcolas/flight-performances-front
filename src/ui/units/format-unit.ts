import {DistanceUnit} from "../../domain/physical-quantity/distance";
import {TemperatureUnit} from "../../domain/physical-quantity/temperature";
import {MassUnit} from "../../domain/physical-quantity/mass";
import {AtmosphericPressureUnit} from "../../domain/physical-quantity/atmospheric-pressure";

export const displayDistanceUnit = (unit: DistanceUnit): string => {
  return unit === 'METERS' ? 'm' : 'ft';
}

export const displayTemperatureUnit = (unit: TemperatureUnit): string => {
  return unit === 'CELSIUS' ? '°C' : '°F';
}

export const displayMassUnit = (unit: MassUnit): string => {
  return unit === 'KILOGRAMS' ? 'kg' : 'lb';
}

export const displayAtmosphericPressureUnit = (unit: AtmosphericPressureUnit): string => {
  return unit === 'HPA' ? 'hPa' : 'inHg';
}
