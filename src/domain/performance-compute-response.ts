export class PerformanceComputeResponse {
  constructor(
    public readonly rawTakeOfPerformanceInMeters: number,
    public  readonly rawLandingPerformanceInMeters: number,
    public  readonly securedTakeOfPerformanceInMeters: number,
    public  readonly securedLandingPerformanceInMeters: number,
  ) {
  }
}
