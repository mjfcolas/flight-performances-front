import {PerformanceComputeRequest} from "./performance-compute.request";
import {ComputationData, FactorType, PerformanceComputeResponse} from "./performance-compute-response";
import {InterpolationProvider} from "./interpolation.provider";
import {PerformanceDataPoint} from "./performance-data-point";
import {TakeOffAndLandingPerformanceComputeResponse} from "./take-off-and-landing-performance-compute.response";
import {Distance, DistanceUnit} from "./distance";
import {Mass} from "./mass";

export const SECURITY_FACTOR = 1.2;
const DEFAULT_DISTANCE_UNIT: DistanceUnit = "METERS";
const DEFAULT_MASS_UNIT = "KILOGRAMS";

export class PerformanceComputer {

  constructor(private readonly interpolationProvider: InterpolationProvider) {
  }

  compute(request: PerformanceComputeRequest): TakeOffAndLandingPerformanceComputeResponse {

    const pressureAltitudeInFeet: number = request.pressureAltitude.pressureAltitudeInFeet;
    const differenceWithISATemperatureInCelsius: number = request.temperatureInCelsius.differenceWithISATemperatureAt(pressureAltitudeInFeet);
    const absoluteTemperatureInCelsius: number = request.temperatureInCelsius.valueInCelsius;

    const takeOffDataPointMinimumPressureAltitudeInFeet = request.performances.takeOffDataPoints.map(value => value.pressureAltitudeInFeet).reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
    const takeOffDataPointMinimumMassInKg = request.performances.takeOffDataPoints.map(value => value.mass.valueIn(DEFAULT_MASS_UNIT)).reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);

    let takeOffDataPointMinimumTemperatureInCelsius: number;
    let toInterpolateForTakeOff: PerformanceDataPoint

    if (request.performances.temperatureMode === 'ISA') {
      takeOffDataPointMinimumTemperatureInCelsius = request.performances.takeOffDataPoints.reduce((min, p) => p.diffWithIsaTemperatureInCelsius < min ? p.diffWithIsaTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForTakeOff = PerformanceDataPoint.fromDiffWithIsaTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
        diffWithIsaTemperatureInCelsius: Math.max(differenceWithISATemperatureInCelsius, takeOffDataPointMinimumTemperatureInCelsius),
        mass: Mass.forValueAndUnit(Math.max(request.massInKg, takeOffDataPointMinimumMassInKg), DEFAULT_MASS_UNIT),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      });
    } else {
      takeOffDataPointMinimumTemperatureInCelsius = request.performances.takeOffDataPoints.reduce((min, p) => p.absoluteTemperatureInCelsius < min ? p.absoluteTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForTakeOff = PerformanceDataPoint.fromAbsoluteTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
        absoluteTemperatureInCelsius: Math.max(absoluteTemperatureInCelsius, takeOffDataPointMinimumTemperatureInCelsius),
        mass: Mass.forValueAndUnit(Math.max(request.massInKg, takeOffDataPointMinimumMassInKg), DEFAULT_MASS_UNIT),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      });
    }

    let rawTakeOffPerformance = 0;
    let outOfBoundTakeOffComputationError = false;
    try {
      rawTakeOffPerformance = this.interpolationProvider.interpolate(request.performances.takeOffDataPoints, toInterpolateForTakeOff, request.performances.temperatureMode).valueIn(DEFAULT_DISTANCE_UNIT);
    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    const landingDataPointMinimumPressureAltitudeInFeet = request.performances.landingDataPoints.map(value => value.pressureAltitudeInFeet).reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
    const landingDataPointMinimumMassInKg = request.performances.landingDataPoints.map(value => value.mass.valueIn(DEFAULT_MASS_UNIT)).reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);

    let landingDataPointMinimumTemperatureInCelsius: number
    let toInterpolateForLanding: PerformanceDataPoint

    if (request.performances.temperatureMode === 'ISA') {
      landingDataPointMinimumTemperatureInCelsius = request.performances.landingDataPoints.reduce((min, p) => p.diffWithIsaTemperatureInCelsius < min ? p.diffWithIsaTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForLanding = PerformanceDataPoint.fromDiffWithIsaTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
        diffWithIsaTemperatureInCelsius: Math.max(differenceWithISATemperatureInCelsius, landingDataPointMinimumTemperatureInCelsius),
        mass: Mass.forValueAndUnit(Math.max(request.massInKg, landingDataPointMinimumMassInKg), DEFAULT_MASS_UNIT),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      })
    } else {
      landingDataPointMinimumTemperatureInCelsius = request.performances.landingDataPoints.reduce((min, p) => p.absoluteTemperatureInCelsius < min ? p.absoluteTemperatureInCelsius : min, Number.MAX_VALUE);
      toInterpolateForLanding = PerformanceDataPoint.fromAbsoluteTemperatureInCelsius({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
        absoluteTemperatureInCelsius: Math.max(absoluteTemperatureInCelsius, landingDataPointMinimumTemperatureInCelsius),
        mass: Mass.forValueAndUnit(Math.max(request.massInKg, landingDataPointMinimumMassInKg), DEFAULT_MASS_UNIT),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      })
    }

    let rawLandingPerformance = 0;
    let outOfBoundLandingComputationError = false;
    try {
      rawLandingPerformance = this.interpolationProvider.interpolate(request.performances.landingDataPoints, toInterpolateForLanding, request.performances.temperatureMode).valueIn(DEFAULT_DISTANCE_UNIT);
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
        request.performances.temperatureMode === "ISA" ? toInterpolateForTakeOff.diffWithIsaTemperatureInCelsius : undefined,
        request.performances.temperatureMode === "ABSOLUTE" ? toInterpolateForTakeOff.absoluteTemperatureInCelsius : undefined,
        toInterpolateForTakeOff.mass
      )
    )

    const landingPerformanceComputeResponse = new PerformanceComputeResponse(
      !outOfBoundLandingComputationError ? rawLandingPerformance : undefined,
      !outOfBoundLandingComputationError ? rawLandingPerformance * landingFactor : undefined,
      outOfBoundLandingComputationError,
      new ComputationData(
        landingComputationFactor,
        toInterpolateForLanding.pressureAltitudeInFeet,
        request.performances.temperatureMode === "ISA" ? toInterpolateForLanding.diffWithIsaTemperatureInCelsius : undefined,
        request.performances.temperatureMode === "ABSOLUTE" ? toInterpolateForLanding.absoluteTemperatureInCelsius : undefined,
        toInterpolateForLanding.mass
      )
    )

    return new TakeOffAndLandingPerformanceComputeResponse(
      takeOffPerformanceComputeResponse,
      landingPerformanceComputeResponse
    )
  }
}
