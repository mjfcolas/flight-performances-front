import {Temperature} from "./temperature";
import {Distance} from "./distance";
import {Mass} from "./mass";

type IsaTemperatureConstructorParameterType = {
  readonly pressureAltitudeInFeet: number;
  readonly diffWithIsaTemperatureInCelsius: number;
  readonly mass: Mass;
  readonly distance: Distance;
}

type AbsoluteTemperatureConstructorParameterType = {
  readonly pressureAltitudeInFeet: number;
  readonly absoluteTemperatureInCelsius: number;
  readonly mass: Mass;
  readonly distance: Distance;
}

export class PerformanceDataPoint {

  private constructor(readonly pressureAltitudeInFeet: number,
                      readonly mass: Mass,
                      readonly distance: Distance,
                      private readonly _diffWithIsaTemperatureInCelsius?: number,
                      private readonly _absoluteTemperatureInCelsius?: number,
  ) {
  }

  static fromDiffWithIsaTemperatureInCelsius(params: IsaTemperatureConstructorParameterType): PerformanceDataPoint {
    return new PerformanceDataPoint(params.pressureAltitudeInFeet, params.mass, params.distance, params.diffWithIsaTemperatureInCelsius);
  }

  static fromAbsoluteTemperatureInCelsius(params: AbsoluteTemperatureConstructorParameterType): PerformanceDataPoint {
    return new PerformanceDataPoint(params.pressureAltitudeInFeet, params.mass, params.distance, undefined, params.absoluteTemperatureInCelsius);
  }

  get diffWithIsaTemperatureInCelsius(): number {
    if (this._diffWithIsaTemperatureInCelsius !== undefined) {
      return this._diffWithIsaTemperatureInCelsius;
    } else {
      return new Temperature(this._absoluteTemperatureInCelsius as number).differenceWithISATemperatureAt(this.pressureAltitudeInFeet);
    }
  }

  get absoluteTemperatureInCelsius(): number {
    if (this._absoluteTemperatureInCelsius !== undefined) {
      return this._absoluteTemperatureInCelsius;
    } else {
      return Temperature.ISATemperatureAt(this.pressureAltitudeInFeet).valueInCelsius + (this._diffWithIsaTemperatureInCelsius as number);

    }
  }
}
