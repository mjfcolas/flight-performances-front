import {PerformanceComputeRequest} from "./performance-compute.request";
import {ComputationData, FactorType, PerformanceComputeResponse} from "./performance-compute-response";
import {InterpolationProvider} from "./interpolation.provider";
import {PerformanceDataPoint} from "./performance-data-point";
import {TakeOffAndLandingPerformanceComputeResponse} from "./take-off-and-landing-performance-compute.response";
import {Distance, DistanceUnit} from "./physical-quantity/distance";
import {Mass} from "./physical-quantity/mass";
import {Temperature, TemperatureDifference} from "./physical-quantity/temperature";

export const SECURITY_FACTOR = 1.2;
const DEFAULT_DISTANCE_UNIT: DistanceUnit = "METERS";
const DEFAULT_MASS_UNIT = "KILOGRAMS";
const DEFAULT_TEMPERATURE_UNIT = "CELSIUS";

export class PerformanceComputer {

  constructor(private readonly interpolationProvider: InterpolationProvider) {
  }

  compute(request: PerformanceComputeRequest): TakeOffAndLandingPerformanceComputeResponse {

    const pressureAltitudeInFeet: number = request.pressureAltitude.pressureAltitudeInFeet;
    const differenceWithISATemperature: TemperatureDifference = request.temperature.differenceWithISATemperatureAt(pressureAltitudeInFeet);
    const absoluteTemperature: Temperature = request.temperature;

    const takeOffDataPointMinimumPressureAltitudeInFeet = request.performances.takeOffDataPoints
      .map(value => value.pressureAltitudeInFeet)
      .reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
    const takeOffDataPointMinimumMassInKg = request.performances.takeOffDataPoints
      .map(value => value.mass.valueIn(DEFAULT_MASS_UNIT))
      .reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);

    let takeOffDataPointMinimumTemperatureInCelsius: number;
    let toInterpolateForTakeOff: PerformanceDataPoint

    if (request.performances.temperatureMode === 'ISA') {
      takeOffDataPointMinimumTemperatureInCelsius = request.performances.takeOffDataPoints
        .map(value => value.diffWithIsaTemperature.valueIn(DEFAULT_TEMPERATURE_UNIT))
        .reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
      toInterpolateForTakeOff = PerformanceDataPoint.fromDiffWithIsaTemperature({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
        diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(
          Math.max(differenceWithISATemperature.valueIn(DEFAULT_TEMPERATURE_UNIT), takeOffDataPointMinimumTemperatureInCelsius),
          DEFAULT_TEMPERATURE_UNIT
        ),
        mass: Mass.forValueAndUnit(
          Math.max(request.mass.valueIn(DEFAULT_MASS_UNIT), takeOffDataPointMinimumMassInKg),
          DEFAULT_MASS_UNIT
        ),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      });
    } else {
      takeOffDataPointMinimumTemperatureInCelsius = request.performances.takeOffDataPoints
        .map(value => value.absoluteTemperature.valueIn(DEFAULT_TEMPERATURE_UNIT))
        .reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
      toInterpolateForTakeOff = PerformanceDataPoint.fromAbsoluteTemperature({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, takeOffDataPointMinimumPressureAltitudeInFeet),
        absoluteTemperature: Temperature.forValueAndUnit(
          Math.max(absoluteTemperature.valueIn(DEFAULT_TEMPERATURE_UNIT), takeOffDataPointMinimumTemperatureInCelsius),
          DEFAULT_TEMPERATURE_UNIT
        ),
        mass: Mass.forValueAndUnit(
          Math.max(request.mass.valueIn(DEFAULT_MASS_UNIT), takeOffDataPointMinimumMassInKg),
          DEFAULT_MASS_UNIT
        ),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      });
    }

    let rawTakeOffPerformance: Distance = Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT);
    let outOfBoundTakeOffComputationError = false;
    try {
      rawTakeOffPerformance = this.interpolationProvider.interpolate(request.performances.takeOffDataPoints, toInterpolateForTakeOff, request.performances.temperatureMode);
    } catch (e) {
      outOfBoundTakeOffComputationError = e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR';
    }

    const landingDataPointMinimumPressureAltitudeInFeet = request.performances.landingDataPoints.map(value => value.pressureAltitudeInFeet).reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
    const landingDataPointMinimumMassInKg = request.performances.landingDataPoints.map(value => value.mass.valueIn(DEFAULT_MASS_UNIT)).reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);

    let landingDataPointMinimumTemperatureInCelsius: number
    let toInterpolateForLanding: PerformanceDataPoint

    if (request.performances.temperatureMode === 'ISA') {
      landingDataPointMinimumTemperatureInCelsius = request.performances.landingDataPoints
        .map(value => value.diffWithIsaTemperature.valueIn(DEFAULT_TEMPERATURE_UNIT))
        .reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
      toInterpolateForLanding = PerformanceDataPoint.fromDiffWithIsaTemperature({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
        diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(
          Math.max(differenceWithISATemperature.valueIn(DEFAULT_TEMPERATURE_UNIT), landingDataPointMinimumTemperatureInCelsius),
          DEFAULT_TEMPERATURE_UNIT
        ),
        mass: Mass.forValueAndUnit(
          Math.max(request.mass.valueIn(DEFAULT_MASS_UNIT), landingDataPointMinimumMassInKg),
          DEFAULT_MASS_UNIT
        ),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      })
    } else {
      landingDataPointMinimumTemperatureInCelsius = request.performances.landingDataPoints
        .map(value => value.absoluteTemperature.valueIn(DEFAULT_TEMPERATURE_UNIT))
        .reduce((min, p) => p < min ? p : min, Number.MAX_VALUE);
      toInterpolateForLanding = PerformanceDataPoint.fromAbsoluteTemperature({
        pressureAltitudeInFeet: Math.max(pressureAltitudeInFeet, landingDataPointMinimumPressureAltitudeInFeet),
        absoluteTemperature: Temperature.forValueAndUnit(
          Math.max(absoluteTemperature.valueIn(DEFAULT_TEMPERATURE_UNIT), landingDataPointMinimumTemperatureInCelsius),
          DEFAULT_TEMPERATURE_UNIT),
        mass: Mass.forValueAndUnit(
          Math.max(request.mass.valueIn(DEFAULT_MASS_UNIT), landingDataPointMinimumMassInKg),
          DEFAULT_MASS_UNIT
        ),
        distance: Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT)
      })
    }

    let rawLandingPerformance: Distance = Distance.forValueAndUnit(0, DEFAULT_DISTANCE_UNIT);
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
      !outOfBoundTakeOffComputationError ? Distance.forValueAndUnit(rawTakeOffPerformance.valueIn(DEFAULT_DISTANCE_UNIT) * takeOffFactor, DEFAULT_DISTANCE_UNIT) : undefined,
      outOfBoundTakeOffComputationError,
      new ComputationData(
        takeOffComputationFactor,
        toInterpolateForTakeOff.pressureAltitudeInFeet,
        request.performances.temperatureMode === "ISA" ? toInterpolateForTakeOff.diffWithIsaTemperature : undefined,
        request.performances.temperatureMode === "ABSOLUTE" ? toInterpolateForTakeOff.absoluteTemperature : undefined,
        toInterpolateForTakeOff.mass
      )
    )

    const landingPerformanceComputeResponse = new PerformanceComputeResponse(
      !outOfBoundLandingComputationError ? rawLandingPerformance : undefined,
      !outOfBoundLandingComputationError ? Distance.forValueAndUnit(rawLandingPerformance.valueIn(DEFAULT_DISTANCE_UNIT) * landingFactor, DEFAULT_DISTANCE_UNIT) : undefined,
      outOfBoundLandingComputationError,
      new ComputationData(
        landingComputationFactor,
        toInterpolateForLanding.pressureAltitudeInFeet,
        request.performances.temperatureMode === "ISA" ? toInterpolateForLanding.diffWithIsaTemperature : undefined,
        request.performances.temperatureMode === "ABSOLUTE" ? toInterpolateForLanding.absoluteTemperature : undefined,
        toInterpolateForLanding.mass
      )
    )

    return new TakeOffAndLandingPerformanceComputeResponse(
      takeOffPerformanceComputeResponse,
      landingPerformanceComputeResponse
    )
  }
}
