import {MassUnit} from "./mass";
import {DistanceUnit} from "./distance";
import {AtmosphericPressureUnit} from "./atmospheric-pressure";
import {TemperatureUnit} from "./temperature";

export interface ChosenUnit {
  readonly massUnit: MassUnit;
  readonly horizontalDistanceUnit: DistanceUnit;
  readonly atmosphericPressureUnit: AtmosphericPressureUnit;
  readonly temperatureUnit: TemperatureUnit;
}
