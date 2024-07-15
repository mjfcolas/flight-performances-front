import {PerformanceDataPoint} from "./performance-data-point";

export class Plane {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly immat: string,
    public readonly takeOfDataPoints: PerformanceDataPoint[],
    public readonly landingDataPoints: PerformanceDataPoint[],
    public readonly takeOffRunwayFactors: RunwayFactors,
    public readonly landingRunwayFactors: RunwayFactors
  ) {
  }
}

export class RunwayFactors {
  constructor(
    public readonly grass: number,
    public readonly grassWet: number,
    public readonly hard: number,
    public readonly hardWet: number,
  ) {
  }
}

