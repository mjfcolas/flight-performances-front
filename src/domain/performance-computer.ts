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
    const absoluteTemperatureInCelsius: number = request.temperatureInCelsius.valueInCelsius;

    const takeOffDataPointMinimumPressureAltitudeInFeet = request.performances.takeOffDataPoints.reduce((min, p) => p.pressureAltitudeInFeet < min ? p.pressureAltitudeInFeet : min, Number.MAX_VALUE);
    const takeOffDataPointMinimumMassInKg = request.performances.takeOffDataPoints.reduce((min, p) => p.massInKg < min ? p.massInKg : min, Number.MAX_VALUE);

    let takeOffDataPointMinimumTemperatureInCelsius: number;
    let toInterpolateForTakeOff: PerformanceDataPoint

    if (request.performances.temperatureMode === 'ISA') {
      takeOffDataPointMinimumTemperatureInCelsius = request.performances.takeOffDataPoints.reduce((min, p) => p.diffWithIsaTemperatureInCelsius < min ? p.diffWithIsaTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForTakeOff = PerformanceDataPoint.fromDiffWithIsaTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
        diffWithIsaTemperatureInCelsius: Math.max(differenceWithISATemperatureInCelsius, takeOffDataPointMinimumTemperatureInCelsius),
        massInKg: Math.max(request.massInKg, takeOffDataPointMinimumMassInKg),
        distanceInMeters: 0
      });
    } else {
      takeOffDataPointMinimumTemperatureInCelsius = request.performances.takeOffDataPoints.reduce((min, p) => p.absoluteTemperatureInCelsius < min ? p.absoluteTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForTakeOff = PerformanceDataPoint.fromAbsoluteTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
        absoluteTemperatureInCelsius: Math.max(absoluteTemperatureInCelsius, takeOffDataPointMinimumTemperatureInCelsius),
        massInKg: Math.max(request.massInKg, takeOffDataPointMinimumMassInKg),
        distanceInMeters: 0
      });
    }

    let rawTakeOffPerformance = 0;
    let outOfBoundTakeOffComputationError = false;
    try {
      rawTakeOffPerformance = this.interpolationProvider.interpolate(request.performances.takeOffDataPoints, toInterpolateForTakeOff, request.performances.temperatureMode);
    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    const landingDataPointMinimumPressureAltitudeInFeet = request.performances.landingDataPoints.reduce((min, p) => p.pressureAltitudeInFeet < min ? p.pressureAltitudeInFeet : min, Number.MAX_VALUE);
    const landingDataPointMinimumMassInKg = request.performances.landingDataPoints.reduce((min, p) => p.massInKg < min ? p.massInKg : min, Number.MAX_VALUE);

    let landingDataPointMinimumTemperatureInCelsius: number
    let toInterpolateForLanding: PerformanceDataPoint

    if (request.performances.temperatureMode === 'ISA') {
      landingDataPointMinimumTemperatureInCelsius = request.performances.landingDataPoints.reduce((min, p) => p.diffWithIsaTemperatureInCelsius < min ? p.diffWithIsaTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForLanding = PerformanceDataPoint.fromDiffWithIsaTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
        diffWithIsaTemperatureInCelsius: Math.max(differenceWithISATemperatureInCelsius, landingDataPointMinimumTemperatureInCelsius),
        massInKg: Math.max(request.massInKg, landingDataPointMinimumMassInKg),
        distanceInMeters: 0
      })
    } else {
      landingDataPointMinimumTemperatureInCelsius = request.performances.landingDataPoints.reduce((min, p) => p.absoluteTemperatureInCelsius < min ? p.absoluteTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForLanding = PerformanceDataPoint.fromAbsoluteTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
        absoluteTemperatureInCelsius: Math.max(absoluteTemperatureInCelsius, landingDataPointMinimumTemperatureInCelsius),
        massInKg: Math.max(request.massInKg, landingDataPointMinimumMassInKg),
        distanceInMeters: 0
      })
    }

    let rawLandingPerformance = 0;
    let outOfBoundLandingComputationError = false;
    try {
      rawLandingPerformance = this.interpolationProvider.interpolate(request.performances.landingDataPoints, toInterpolateForLanding, request.performances.temperatureMode);
    } catch (e) {
      outOfBoundLandingComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let takeOffFactor = SECURITY_FACTOR;
    let landingFactor = SECURITY_FACTOR;

    const takeOffComputationFactor = new Map<FactorType, number>();
    const landingComputationFactor = new Map<FactorType, number>();

    if (request.runwayStatus === "WET" && request.runwayType === "GRASS") {
      takeOffFactor *= request.performances.takeOffRunwayFactors.grassWet;
      landingFactor *= request.performances.landingRunwayFactors.grassWet;
      takeOffComputationFactor.set("WET_GRASS", request.performances.takeOffRunwayFactors.grassWet);
      landingComputationFactor.set("WET_GRASS", request.performances.landingRunwayFactors.grassWet);
    }
    if (request.runwayStatus === "WET" && request.runwayType === "HARD") {
      takeOffFactor *= request.performances.takeOffRunwayFactors.hardWet;
      landingFactor *= request.performances.landingRunwayFactors.hardWet;
      takeOffComputationFactor.set("WET_HARD", request.performances.takeOffRunwayFactors.hardWet);
      landingComputationFactor.set("WET_HARD", request.performances.landingRunwayFactors.hardWet);
    }
    if (request.runwayStatus === "DRY" && request.runwayType === "GRASS") {
      takeOffFactor *= request.performances.takeOffRunwayFactors.grass;
      landingFactor *= request.performances.landingRunwayFactors.grass;
      takeOffComputationFactor.set("DRY_GRASS", request.performances.takeOffRunwayFactors.grass);
      landingComputationFactor.set("DRY_GRASS", request.performances.landingRunwayFactors.grass);
    }
    if (request.runwayStatus === "DRY" && request.runwayType === "HARD") {
      takeOffFactor *= request.performances.takeOffRunwayFactors.hard;
      landingFactor *= request.performances.landingRunwayFactors.hard
      takeOffComputationFactor.set("DRY_HARD", request.performances.takeOffRunwayFactors.hard);
      landingComputationFactor.set("DRY_HARD", request.performances.landingRunwayFactors.hard);
    }

    let takeOffWindFactor;
    try {
      takeOffWindFactor = request.performances.takeOffCoefficientsComputationData.coefficientFor(request.headwindInKnots);
      takeOffComputationFactor.set("WIND", takeOffWindFactor);
      takeOffFactor *= takeOffWindFactor;
    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    let landingWindFactor;
    try {
      landingWindFactor = request.performances.landingCoefficientsComputationData.coefficientFor(request.headwindInKnots);
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
        toInterpolateForTakeOff.diffWithIsaTemperatureInCelsius,
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
        toInterpolateForLanding.diffWithIsaTemperatureInCelsius,
        toInterpolateForLanding.massInKg
      )
    )

    return new TakeOffAndLandingPerformanceComputeResponse(
      takeOffPerformanceComputeResponse,
      landingPerformanceComputeResponse
    )
  }
}
