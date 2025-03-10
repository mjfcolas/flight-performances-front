import {Temperature} from "./temperature";

type IsaTemperatureConstructorParameterType = {
  readonly pressureAltitudeInFeet: number;
  readonly diffWithIsaTemperatureInCelsius: number;
  readonly massInKg: number;
  readonly distanceInMeters: number;
}

type AbsoluteTemperatureConstructorParameterType = {
  readonly pressureAltitudeInFeet: number;
  readonly absoluteTemperatureInCelsius: number;
  readonly massInKg: number;
  readonly distanceInMeters: number;
}

export class PerformanceDataPoint {

  private constructor(readonly pressureAltitudeInFeet: number,
                      readonly massInKg: number,
                      readonly distanceInMeters: number,
                      private readonly _diffWithIsaTemperatureInCelsius?: number,
                      private readonly _absoluteTemperatureInCelsius?: number,
  ) {
  }

  static fromDiffWithIsaTemperatureInCelsius(params: IsaTemperatureConstructorParameterType): PerformanceDataPoint {
    return new PerformanceDataPoint(params.pressureAltitudeInFeet, params.massInKg, params.distanceInMeters, params.diffWithIsaTemperatureInCelsius);
  }

  static fromAbsoluteTemperatureInCelsius(params: AbsoluteTemperatureConstructorParameterType): PerformanceDataPoint {
    return new PerformanceDataPoint(params.pressureAltitudeInFeet, params.massInKg, params.distanceInMeters, undefined, params.absoluteTemperatureInCelsius);
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
