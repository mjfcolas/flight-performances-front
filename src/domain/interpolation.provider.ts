import {PerformanceDataPoint} from "./performance-data-point";
import {Distance} from "./distance";
import {TemperatureMode} from "./plane";

export abstract class InterpolationProvider {
  abstract interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint, temperatureMode: TemperatureMode): Distance;
}
