export class PerformanceComputeResponse {
  constructor(
    public readonly rawTakeOfPerformanceInMeters: number | undefined,
    public  readonly rawLandingPerformanceInMeters: number | undefined,
    public  readonly securedTakeOfPerformanceInMeters: number | undefined,
    public  readonly securedLandingPerformanceInMeters: number | undefined,
    public readonly outOfBoundTakeOffComputationError: boolean,
    public readonly outOfBoundLandingComputationError: boolean
  ) {
  }
}
