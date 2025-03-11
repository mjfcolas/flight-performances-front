import {PerformanceDataPoint} from "./performance-data-point";
import {TemperatureMode} from "./plane";

export abstract class InterpolationProvider {
  abstract interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint, temperatureMode: TemperatureMode): number;
}
