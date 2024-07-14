import {PerformanceDataPoint} from "./performance-data-point";

export abstract class InterpolationProvider {
  abstract interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): number;
}
