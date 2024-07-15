import {PerformanceDataPoint} from "./performance-data-point";

export class Plane {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly immat: string,
    public readonly takeOfDataPoints: PerformanceDataPoint[],
    public readonly landingDataPoints: PerformanceDataPoint[],
    public readonly takeOffTrackFactors: TrackFactors,
    public readonly landingTrackFactors: TrackFactors
  ) {
  }
}

export class TrackFactors {
  constructor(
    public readonly grass: number,
    public readonly grassWet: number,
    public readonly hard: number,
    public readonly hardWet: number,
  ) {
  }
}

