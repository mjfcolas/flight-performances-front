import {InterpolationProvider} from "../../domain/interpolation.provider";
import {PerformanceDataPoint} from "../../domain/performance-data-point";
import {interpolate, D3Element} from "@mjfcolas/n-linear-interpolation";

export class TrilinearInterpolationProvider implements InterpolationProvider {
  interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): number {

    const raw: D3Element[] = grid
      .map(({
              pressureAltitudeInFeet,
              temperatureInCelsius,
              massInKg,
              distanceInMeters
            }) => [pressureAltitudeInFeet, temperatureInCelsius, massInKg, distanceInMeters]);

    return interpolate.d3(raw, [toInterpolate.pressureAltitudeInFeet, toInterpolate.temperatureInCelsius, toInterpolate.massInKg])
  }
}
