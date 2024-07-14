import {PerformanceDataPoint} from "./performance-data-point";

export class Plane {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly immat: string,
    public readonly takeOfDataPoints: PerformanceDataPoint[],
    public readonly landingDataPoints: PerformanceDataPoint[],
  ) {
  }
}
