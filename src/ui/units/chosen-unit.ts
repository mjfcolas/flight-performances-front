import {MassUnit} from "../../domain/physical-quantity/mass";
import {DistanceUnit} from "../../domain/physical-quantity/distance";
import {AtmosphericPressureUnit} from "../../domain/physical-quantity/atmospheric-pressure";
import {TemperatureUnit} from "../../domain/physical-quantity/temperature";

export interface ChosenUnit {
  readonly massUnit: MassUnit;
  readonly horizontalDistanceUnit: DistanceUnit;
  readonly atmosphericPressureUnit: AtmosphericPressureUnit;
  readonly temperatureUnit: TemperatureUnit;
}
