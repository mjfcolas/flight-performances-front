import {Temperature, TemperatureDifference} from "./physical-quantity/temperature";
import {Distance} from "./physical-quantity/distance";
import {Mass} from "./physical-quantity/mass";

type IsaTemperatureConstructorParameterType = {
  readonly pressureAltitudeInFeet: number;
  readonly diffWithIsaTemperature: TemperatureDifference;
  readonly mass: Mass;
  readonly distance: Distance;
}

type AbsoluteTemperatureConstructorParameterType = {
  readonly pressureAltitudeInFeet: number;
  readonly absoluteTemperature: Temperature;
  readonly mass: Mass;
  readonly distance: Distance;
}

export class PerformanceDataPoint {

  private constructor(readonly pressureAltitudeInFeet: number,
                      readonly mass: Mass,
                      readonly distance: Distance,
                      private readonly _diffWithIsaTemperature?: TemperatureDifference,
                      private readonly _absoluteTemperature?: Temperature,
  ) {
  }

  static fromDiffWithIsaTemperature(params: IsaTemperatureConstructorParameterType): PerformanceDataPoint {
    return new PerformanceDataPoint(params.pressureAltitudeInFeet, params.mass, params.distance, params.diffWithIsaTemperature);
  }

  static fromAbsoluteTemperature(params: AbsoluteTemperatureConstructorParameterType): PerformanceDataPoint {
    return new PerformanceDataPoint(params.pressureAltitudeInFeet, params.mass, params.distance, undefined, params.absoluteTemperature);
  }

  get diffWithIsaTemperature(): TemperatureDifference {
    if (this._diffWithIsaTemperature !== undefined) {
      return this._diffWithIsaTemperature;
    } else {
      return (this._absoluteTemperature as Temperature).differenceWithISATemperatureAt(this.pressureAltitudeInFeet);
    }
  }

  get absoluteTemperature(): Temperature {
    if (this._absoluteTemperature !== undefined) {
      return this._absoluteTemperature;
    } else {
      return Temperature.ISATemperatureAt(this.pressureAltitudeInFeet).add(this._diffWithIsaTemperature as TemperatureDifference);
    }
  }
}
