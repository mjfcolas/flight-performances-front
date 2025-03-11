import {InterpolationProvider} from "../../domain/interpolation.provider";
import {PerformanceDataPoint} from "../../domain/performance-data-point";
import {D3Element, interpolate} from "@mjfcolas/n-linear-interpolation";
import {TemperatureMode} from "../../domain/plane";
import {Distance} from "../../domain/distance";

const horizontalDistanceInterpolationUnit = 'METERS';
const massInterpolationUnit = 'KILOGRAMS';

export class TrilinearInterpolationProvider implements InterpolationProvider {

  interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint, temperatureMode: TemperatureMode): Distance {
    if (temperatureMode === 'ISA') {
      return this.interpolateForDifferenceWithISATemperature(grid, toInterpolate);
    } else {
      return this.interpolateForAbsoluteTemperature(grid, toInterpolate);
    }
  }

  private interpolateForDifferenceWithISATemperature(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): Distance {

    const raw: D3Element[] = grid
      .map(({
              pressureAltitudeInFeet,
              diffWithIsaTemperatureInCelsius,
              mass,
              distance
            }
      ) => [
        pressureAltitudeInFeet,
        diffWithIsaTemperatureInCelsius,
        mass.valueIn(massInterpolationUnit),
        distance.valueIn(horizontalDistanceInterpolationUnit)
      ]);

    const valueInInterpolationUnit =  interpolate.d3(raw, [
      toInterpolate.pressureAltitudeInFeet,
      toInterpolate.diffWithIsaTemperatureInCelsius,
      toInterpolate.mass.valueIn(massInterpolationUnit)
    ])
    return Distance.forValueAndUnit(valueInInterpolationUnit, horizontalDistanceInterpolationUnit);
  }

  private interpolateForAbsoluteTemperature(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): Distance {

    const raw: D3Element[] = grid
      .map(({
              pressureAltitudeInFeet,
              absoluteTemperatureInCelsius,
              mass,
              distance
            }
      ) => [
        pressureAltitudeInFeet,
        absoluteTemperatureInCelsius,
        mass.valueIn(massInterpolationUnit),
        distance.valueIn(horizontalDistanceInterpolationUnit)
      ]);

    const valueInInterpolationUnit =  interpolate.d3(raw, [
      toInterpolate.pressureAltitudeInFeet,
      toInterpolate.absoluteTemperatureInCelsius,
      toInterpolate.mass.valueIn(massInterpolationUnit)
    ])
    return Distance.forValueAndUnit(valueInInterpolationUnit, horizontalDistanceInterpolationUnit);
  }
}
