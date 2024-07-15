import {PerformanceComputeRequest} from "./performance-compute.request";
import {PerformanceComputeResponse} from "./performance-compute-response";
import {InterpolationProvider} from "./interpolation.provider";
import {PerformanceDataPoint} from "./performance-data-point";

export const SECURITY_FACTOR = 1.2;

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
    let takeOffPerformance;
    let outOfBoundTakeOffComputationError = false;
    try {
      takeOffPerformance = this.interpolationProvider.interpolate(request.plane.takeOfDataPoints, toInterpolate);

    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let landingPerformance;
    let outOfBoundLandingComputationError = false;
    try {
      landingPerformance = this.interpolationProvider.interpolate(request.plane.landingDataPoints, toInterpolate);
    } catch (e) {
      outOfBoundLandingComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let takeOffFactor = SECURITY_FACTOR;
    let landingFactor = SECURITY_FACTOR;

    if (request.trackStatus === "WET" && request.trackType === "GRASS") {
      takeOffFactor *= request.plane.takeOffTrackFactors.grassWet;
      landingFactor *= request.plane.landingTrackFactors.grassWet;
    }
    if (request.trackStatus === "WET" && request.trackType === "HARD") {
      takeOffFactor *= request.plane.takeOffTrackFactors.hardWet;
      landingFactor *= request.plane.landingTrackFactors.hardWet;
    }
    if (request.trackStatus === "DRY" && request.trackType === "GRASS") {
      takeOffFactor *= request.plane.takeOffTrackFactors.grass;
      landingFactor *= request.plane.landingTrackFactors.grass
    }
    if (request.trackStatus === "DRY" && request.trackType === "HARD") {
      takeOffFactor *= request.plane.takeOffTrackFactors.hard;
      landingFactor *= request.plane.landingTrackFactors.hard
    }


    return new PerformanceComputeResponse(
      takeOffPerformance,
      landingPerformance,
      takeOffPerformance ? takeOffPerformance * takeOffFactor : undefined,
      landingPerformance ? landingPerformance * landingFactor : undefined,
      outOfBoundTakeOffComputationError,
      outOfBoundLandingComputationError
    )
  }
}
