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

    const takeOffDataPointMinimumPressureAltitudeInFeet = request.plane.takeOfDataPoints.reduce((min, p) => p.pressureAltitudeInFeet < min ? p.pressureAltitudeInFeet : min, Number.MAX_VALUE);
    const takeOffDataPointMinimumMassInKg = request.plane.takeOfDataPoints.reduce((min, p) => p.massInKg < min ? p.massInKg : min, Number.MAX_VALUE);
    const takeOffDataPointMinimumTemperatureInCelsius = request.plane.takeOfDataPoints.reduce((min, p) => p.temperatureInCelsius < min ? p.temperatureInCelsius : min, Number.MAX_VALUE);

    const toInterpolateForTakeOff: PerformanceDataPoint = {
      pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
      temperatureInCelsius: Math.max(differenceWithISATemperatureInCelsius, takeOffDataPointMinimumTemperatureInCelsius),
      massInKg: Math.max(request.massInKg, takeOffDataPointMinimumMassInKg),
      distanceInMeters: 0
    }
    let rawTakeOffPerformance = 0;
    let outOfBoundTakeOffComputationError = false;
    try {
      rawTakeOffPerformance = this.interpolationProvider.interpolate(request.plane.takeOfDataPoints, toInterpolateForTakeOff);
    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    const landingDataPointMinimumPressureAltitudeInFeet = request.plane.landingDataPoints.reduce((min, p) => p.pressureAltitudeInFeet < min ? p.pressureAltitudeInFeet : min, Number.MAX_VALUE);
    const landingDataPointMinimumMassInKg = request.plane.landingDataPoints.reduce((min, p) => p.massInKg < min ? p.massInKg : min, Number.MAX_VALUE);
    const landingDataPointMinimumTemperatureInCelsius = request.plane.landingDataPoints.reduce((min, p) => p.temperatureInCelsius < min ? p.temperatureInCelsius : min, Number.MAX_VALUE);

    const toInterpolateForLanding: PerformanceDataPoint = {
      pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
      temperatureInCelsius: Math.max(differenceWithISATemperatureInCelsius, landingDataPointMinimumTemperatureInCelsius),
      massInKg: Math.max(request.massInKg, landingDataPointMinimumMassInKg),
      distanceInMeters: 0
    }
    let rawLandingPerformance = 0;
    let outOfBoundLandingComputationError = false;
    try {
      rawLandingPerformance = this.interpolationProvider.interpolate(request.plane.landingDataPoints, toInterpolateForLanding);
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

    let takeOffWindFactor;
    try {
      takeOffWindFactor = request.plane.takeOffCoefficientsComputationData.coefficientFor(request.headwindInKnots);
      takeOffComputationFactor.set("WIND", takeOffWindFactor);
      takeOffFactor *= takeOffWindFactor;
    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let landingWindFactor;
    try {
      landingWindFactor = request.plane.landingCoefficientsComputationData.coefficientFor(request.headwindInKnots);
      landingComputationFactor.set("WIND", landingWindFactor);
      landingFactor *= landingWindFactor;
    } catch (e) {
      outOfBoundLandingComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    takeOffComputationFactor.set("SECURITY", SECURITY_FACTOR);
    landingComputationFactor.set("SECURITY", SECURITY_FACTOR);

    const takeOffPerformanceComputeResponse = new PerformanceComputeResponse(
      !outOfBoundTakeOffComputationError ? rawTakeOffPerformance : undefined,
      !outOfBoundTakeOffComputationError ? rawTakeOffPerformance * takeOffFactor : undefined,
      outOfBoundTakeOffComputationError,
      new ComputationData(
        takeOffComputationFactor,
        toInterpolateForTakeOff.pressureAltitudeInFeet,
        toInterpolateForTakeOff.temperatureInCelsius,
        toInterpolateForTakeOff.massInKg
      )
    )

    const landingPerformanceComputeResponse = new PerformanceComputeResponse(
      !outOfBoundLandingComputationError ? rawLandingPerformance : undefined,
      !outOfBoundLandingComputationError ? rawLandingPerformance * landingFactor : undefined,
      outOfBoundLandingComputationError,
      new ComputationData(
        landingComputationFactor,
        toInterpolateForLanding.pressureAltitudeInFeet,
        toInterpolateForLanding.temperatureInCelsius,
        toInterpolateForLanding.massInKg
      )
    )

    return new TakeOffAndLandingPerformanceComputeResponse(
      takeOffPerformanceComputeResponse,
      landingPerformanceComputeResponse
    )
  }
}
