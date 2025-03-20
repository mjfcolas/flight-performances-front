import {PerformanceDataPoint} from "./performance-data-point";
import {Distance} from "./physical-quantity/distance";
import {TemperatureMode} from "./plane";

export abstract class InterpolationProvider {
  abstract interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint, temperatureMode: TemperatureMode): Distance;
}
