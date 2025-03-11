import {InterpolationProvider} from "../../domain/interpolation.provider";
import {PerformanceDataPoint} from "../../domain/performance-data-point";
import {D3Element, interpolate} from "@mjfcolas/n-linear-interpolation";
import {TemperatureMode} from "../../domain/plane";

export class TrilinearInterpolationProvider implements InterpolationProvider {
  interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint, temperatureMode: TemperatureMode): number {
    if (temperatureMode === 'ISA') {
      return this.interpolateForDifferenceWithISATemperature(grid, toInterpolate);
    } else {
      return this.interpolateForAbsoluteTemperature(grid, toInterpolate);
    }
  }

  private interpolateForDifferenceWithISATemperature(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): number {

    const raw: D3Element[] = grid
      .map(({
              pressureAltitudeInFeet,
              diffWithIsaTemperatureInCelsius,
              massInKg,
              distanceInMeters
            }) => [pressureAltitudeInFeet, diffWithIsaTemperatureInCelsius, massInKg, distanceInMeters]);

    return interpolate.d3(raw, [toInterpolate.pressureAltitudeInFeet, toInterpolate.diffWithIsaTemperatureInCelsius, toInterpolate.massInKg])
  }

  private interpolateForAbsoluteTemperature(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): number {

    const raw: D3Element[] = grid
      .map(({
              pressureAltitudeInFeet,
              absoluteTemperatureInCelsius,
              massInKg,
              distanceInMeters
            }) => [pressureAltitudeInFeet, absoluteTemperatureInCelsius, massInKg, distanceInMeters]);

    return interpolate.d3(raw, [toInterpolate.pressureAltitudeInFeet, toInterpolate.absoluteTemperatureInCelsius, toInterpolate.massInKg])
  }
}
