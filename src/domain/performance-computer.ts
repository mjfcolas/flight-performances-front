import {PerformanceComputeRequest} from "./performance-compute.request";
import {ComputationData, FactorType, PerformanceComputeResponse} from "./performance-compute-response";
import {InterpolationProvider} from "./interpolation.provider";
import {PerformanceDataPoint} from "./performance-data-point";
import {TakeOffAndLandingPerformanceComputeResponse} from "./take-off-and-landing-performance-compute.response";

export const SECURITY_FACTOR = 1.2;

export class PerformanceComputer {

  constructor(private readonly interpolationProvider: InterpolationProvider) {
  }

  compute(request: PerformanceComputeRequest): TakeOffAndLandingPerformanceComputeResponse {

    const pressureAltitudeInFeet: number = request.pressureAltitude.pressureAltitudeInFeet;
    const differenceWithISATemperatureInCelsius: number = request.temperatureInCelsius.differenceWithISATemperatureAt(pressureAltitudeInFeet);

    const toInterpolate: PerformanceDataPoint = {
      pressureAltitudeInFeet: pressureAltitudeInFeet,
      temperatureInCelsius: differenceWithISATemperatureInCelsius,
      massInKg: request.massInKg,
      distanceInMeters: 0
    }
    let rawTakeOffPerformance;
    let outOfBoundTakeOffComputationError = false;
    try {
      rawTakeOffPerformance = this.interpolationProvider.interpolate(request.plane.takeOfDataPoints, toInterpolate);

    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let rawLandingPerformance;
    let outOfBoundLandingComputationError = false;
    try {
      rawLandingPerformance = this.interpolationProvider.interpolate(request.plane.landingDataPoints, toInterpolate);
    } catch (e) {
      outOfBoundLandingComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let takeOffFactor = SECURITY_FACTOR;
    let landingFactor = SECURITY_FACTOR;

    const takeOffComputationFactor = new Map<FactorType, number>();
    const landingComputationFactor = new Map<FactorType, number>();

    if (request.runwayStatus === "WET" && request.runwayType === "GRASS") {
      takeOffFactor *= request.plane.takeOffRunwayFactors.grassWet;
      landingFactor *= request.plane.landingRunwayFactors.grassWet;
      takeOffComputationFactor.set("WET_GRASS", request.plane.takeOffRunwayFactors.grassWet);
      landingComputationFactor.set("WET_GRASS", request.plane.landingRunwayFactors.grassWet);
    }
    if (request.runwayStatus === "WET" && request.runwayType === "HARD") {
      takeOffFactor *= request.plane.takeOffRunwayFactors.hardWet;
      landingFactor *= request.plane.landingRunwayFactors.hardWet;
      takeOffComputationFactor.set("WET_HARD", request.plane.takeOffRunwayFactors.hardWet);
      landingComputationFactor.set("WET_HARD", request.plane.landingRunwayFactors.hardWet);
    }
    if (request.runwayStatus === "DRY" && request.runwayType === "GRASS") {
      takeOffFactor *= request.plane.takeOffRunwayFactors.grass;
      landingFactor *= request.plane.landingRunwayFactors.grass;
      takeOffComputationFactor.set("DRY_GRASS", request.plane.takeOffRunwayFactors.grass);
      landingComputationFactor.set("DRY_GRASS", request.plane.landingRunwayFactors.grass);
    }
    if (request.runwayStatus === "DRY" && request.runwayType === "HARD") {
      takeOffFactor *= request.plane.takeOffRunwayFactors.hard;
      landingFactor *= request.plane.landingRunwayFactors.hard
      takeOffComputationFactor.set("DRY_HARD", request.plane.takeOffRunwayFactors.hard);
      landingComputationFactor.set("DRY_HARD", request.plane.landingRunwayFactors.hard);
    }

    takeOffComputationFactor.set("SECURITY", SECURITY_FACTOR);
    landingComputationFactor.set("SECURITY", SECURITY_FACTOR);

    const takeOffPerformanceComputeResponse = new PerformanceComputeResponse(
      rawTakeOffPerformance,
      rawTakeOffPerformance ? rawTakeOffPerformance * takeOffFactor : undefined,
      outOfBoundTakeOffComputationError,
      new ComputationData(
        takeOffComputationFactor,
        pressureAltitudeInFeet,
        differenceWithISATemperatureInCelsius,
        request.massInKg
      )
    )

    const landingPerformanceComputeResponse = new PerformanceComputeResponse(
      rawLandingPerformance,
      rawLandingPerformance ? rawLandingPerformance * landingFactor : undefined,
      outOfBoundLandingComputationError,
      new ComputationData(
        landingComputationFactor,
        pressureAltitudeInFeet,
        differenceWithISATemperatureInCelsius,
        request.massInKg
      )
    )

    return new TakeOffAndLandingPerformanceComputeResponse(
      takeOffPerformanceComputeResponse,
      landingPerformanceComputeResponse
    )
  }
}
