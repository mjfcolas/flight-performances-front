import {PerformanceComputeRequest} from "./performance-compute.request";
import {PerformanceComputeResponse} from "./performance-compute-response";
import {InterpolationProvider} from "./interpolation.provider";
import {PerformanceDataPoint} from "./performance-data-point";

const SECURITY_FACTOR = 1.2;

export class PerformanceComputer {

  constructor(private readonly interpolationProvider: InterpolationProvider) {
  }

  compute(request: PerformanceComputeRequest): PerformanceComputeResponse {
    const toInterpolate: PerformanceDataPoint = {
      altitudePressureInFeet: request.altitudePressure.altitudePressureInFeet,
      temperatureInCelsius: request.temperatureInCelsius.differenceWithStandardTemperatureAt(request.altitudePressure.altitudePressureInFeet),
      massInKg: request.massInKg,
      distanceInMeters: 0
    }
    const takeOffPerformance = this.interpolationProvider.interpolate(request.plane.takeOfDataPoints, toInterpolate);
    const landingPerformance = this.interpolationProvider.interpolate(request.plane.landingDataPoints, toInterpolate);

    return new PerformanceComputeResponse(
      takeOffPerformance,
      landingPerformance,
      takeOffPerformance * SECURITY_FACTOR,
      landingPerformance * SECURITY_FACTOR
    )
  }
}
