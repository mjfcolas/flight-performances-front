import {MassUnit} from "./mass";
import {DistanceUnit} from "./distance";
import {AtmosphericPressureUnit} from "./atmospheric-pressure";
import {TemperatureUnit} from "./temperature";

export abstract class DefaultUnitRepository {
  abstract getMassUnit(): MassUnit;

  abstract getHorizontalDistanceUnit(): DistanceUnit;

  abstract getAtmosphericPressureUnit(): AtmosphericPressureUnit;

  abstract getTemperatureUnit(): TemperatureUnit;
}
