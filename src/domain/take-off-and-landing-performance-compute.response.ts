import {PerformanceComputeResponse} from "./performance-compute-response";

export class TakeOffAndLandingPerformanceComputeResponse {
  constructor(
    public readonly takeOffPerformanceComputeResponse: PerformanceComputeResponse,
    public readonly landingPerformanceComputeResponse: PerformanceComputeResponse,
  ) {
  }
}
