import {PlanePerformances, RunwayFactors, StepCoefficient, WindCoefficientComputationData} from "../../../domain/plane";
import {PerformanceDataPoint} from "../../../domain/performance-data-point";


type PlanePerformancesViewModelConstructorParameterType = {
  takeOffDataPoints: PerformanceDataPointViewModel[],
  landingDataPoints: PerformanceDataPointViewModel[],
  takeOffRunwayFactors: RunwayFactorsViewModel,
  landingRunwayFactors: RunwayFactorsViewModel,
  takeOffCoefficientsComputationData: StepCoefficient[],
  landingCoefficientsComputationData: StepCoefficient[]
}

export class PlanePerformancesViewModel {
  readonly takeOffDataPoints: PerformanceDataPointViewModel[];
  readonly landingDataPoints: PerformanceDataPointViewModel[];
  readonly takeOffRunwayFactors: RunwayFactorsViewModel;
  readonly landingRunwayFactors: RunwayFactorsViewModel;
  readonly takeOffCoefficientsComputationData: StepCoefficient[];
  readonly landingCoefficientsComputationData: StepCoefficient[];

  private constructor(
    params: PlanePerformancesViewModelConstructorParameterType) {
    this.takeOffDataPoints = params.takeOffDataPoints;
    this.landingDataPoints = params.landingDataPoints;
    this.takeOffRunwayFactors = params.takeOffRunwayFactors;
    this.landingRunwayFactors = params.landingRunwayFactors;
    this.takeOffCoefficientsComputationData = params.takeOffCoefficientsComputationData;
    this.landingCoefficientsComputationData = params.landingCoefficientsComputationData
  }

  public toPlanePerformances(): PlanePerformances {
    const takeOffDataPoints: PerformanceDataPoint[] = this.takeOffDataPoints
      .filter(dataPoint => dataPoint.distanceInMeters !== undefined)
      .map(dataPoint => dataPoint.toDomain());

    const landingDataPoints: PerformanceDataPoint[] = this.landingDataPoints
      .filter(dataPoint => dataPoint.distanceInMeters !== undefined)
      .map(dataPoint => dataPoint.toDomain());

    const takeOffRunwayFactors = this.takeOffRunwayFactors.toDomain();
    const landingRunwayFactors = this.landingRunwayFactors.toDomain();

    const takeOffCoefficientsComputationData = WindCoefficientComputationData.fromStepCoefficients(this.takeOffCoefficientsComputationData);
    const landingCoefficientsComputationData = WindCoefficientComputationData.fromStepCoefficients(this.landingCoefficientsComputationData);

    return new PlanePerformances(
      takeOffDataPoints,
      landingDataPoints,
      takeOffRunwayFactors,
      landingRunwayFactors,
      takeOffCoefficientsComputationData,
      landingCoefficientsComputationData
    );
  }

  public copyWith(params: Partial<PlanePerformancesViewModelConstructorParameterType>) {
    return new PlanePerformancesViewModel({
      takeOffDataPoints: params.takeOffDataPoints ?? this.takeOffDataPoints,
      landingDataPoints: params.landingDataPoints ?? this.landingDataPoints,
      takeOffRunwayFactors: params.takeOffRunwayFactors ?? this.takeOffRunwayFactors,
      landingRunwayFactors: params.landingRunwayFactors ?? this.landingRunwayFactors,
      takeOffCoefficientsComputationData: params.takeOffCoefficientsComputationData ?? this.takeOffCoefficientsComputationData,
      landingCoefficientsComputationData: params.landingCoefficientsComputationData ?? this.landingCoefficientsComputationData
    })
  };

  static empty() {
    return new PlanePerformancesViewModel({
      takeOffDataPoints: [],
      landingDataPoints: [],
      takeOffRunwayFactors: new RunwayFactorsViewModel({
        grass: undefined,
        grassWet: undefined,
        hard: undefined,
        hardWet: undefined,
      }),
      landingRunwayFactors: new RunwayFactorsViewModel({
        grass: undefined,
        grassWet: undefined,
        hard: undefined,
        hardWet: undefined,
      }),
      takeOffCoefficientsComputationData: [],
      landingCoefficientsComputationData: []
    });
  }

  static fromPlanePerformances(planePerformances: PlanePerformances): PlanePerformancesViewModel {
    return new PlanePerformancesViewModel({
      takeOffDataPoints: planePerformances.takeOffDataPoints.map(dataPoint => new PerformanceDataPointViewModel({
        pressureAltitudeInFeet: dataPoint.pressureAltitudeInFeet,
        temperatureInCelsius: dataPoint.temperatureInCelsius,
        massInKg: dataPoint.massInKg,
        distanceInMeters: dataPoint.distanceInMeters
      })),
      landingDataPoints: planePerformances.landingDataPoints.map(dataPoint => new PerformanceDataPointViewModel({
        pressureAltitudeInFeet: dataPoint.pressureAltitudeInFeet,
        temperatureInCelsius: dataPoint.temperatureInCelsius,
        massInKg: dataPoint.massInKg,
        distanceInMeters: dataPoint.distanceInMeters,
      })),
      takeOffRunwayFactors: new RunwayFactorsViewModel({
        grass: planePerformances.takeOffRunwayFactors.grass,
        grassWet: planePerformances.takeOffRunwayFactors.grassWet,
        hard: planePerformances.takeOffRunwayFactors.hard,
        hardWet: planePerformances.takeOffRunwayFactors.hardWet
      }),
      landingRunwayFactors: new RunwayFactorsViewModel({
        grass: planePerformances.landingRunwayFactors.grass,
        grassWet: planePerformances.landingRunwayFactors.grassWet,
        hard: planePerformances.landingRunwayFactors.hard,
        hardWet: planePerformances.landingRunwayFactors.hardWet,
      }),
      takeOffCoefficientsComputationData: planePerformances
        .takeOffCoefficientsComputationData
        .get()
        .map(stepCoefficient => ({
          step: stepCoefficient.step,
          coefficient: stepCoefficient.coefficient,
        })),
      landingCoefficientsComputationData: planePerformances
        .landingCoefficientsComputationData
        .get()
        .map(stepCoefficient => ({
          step: stepCoefficient.step,
          coefficient: stepCoefficient.coefficient,
        }))
    });
  }
}

export class RunwayFactorsViewModel {
  grass?: number | null;
  grassWet?: number | null;
  hard?: number | null;
  hardWet?: number | null;

  constructor(params: {
    grass?: number | null,
    grassWet?: number | null,
    hard?: number | null,
    hardWet?: number | null,
  }) {
    this.grass = params.grass;
    this.grassWet = params.grassWet;
    this.hard = params.hard;
    this.hardWet = params.hardWet;
  }

  static empty() {
    return new RunwayFactorsViewModel({
      grass: null,
      grassWet: null,
      hard: null,
      hardWet: null
    });
  }

  toDomain(): RunwayFactors {
    if (
      this.grass == undefined || this.grassWet == undefined || this.hard == undefined || this.hardWet == undefined) {
      throw new Error('RUNWAY_FACTOR_UNDEFINED_PARAMETER');
    }
    return {
      grass: this.grass,
      grassWet: this.grassWet,
      hard: this.hard,
      hardWet: this.hardWet
    }
  }
}

export class PerformanceDataPointViewModel {
  pressureAltitudeInFeet: number;
  temperatureInCelsius: number;
  massInKg: number;
  distanceInMeters?: number | null;

  constructor(params: {
    pressureAltitudeInFeet: number,
    temperatureInCelsius: number,
    massInKg: number,
    distanceInMeters?: number
  }) {
    this.pressureAltitudeInFeet = params.pressureAltitudeInFeet;
    this.temperatureInCelsius = params.temperatureInCelsius;
    this.massInKg = params.massInKg;
    this.distanceInMeters = params.distanceInMeters
  }

  toDomain(): PerformanceDataPoint {
    if (this.distanceInMeters == undefined) {
      throw new Error('PERFORMANCE_DATAPOINT_UNDEFINED_DISTANCE');
    }
    return {
      pressureAltitudeInFeet: this.pressureAltitudeInFeet,
      temperatureInCelsius: this.temperatureInCelsius,
      massInKg: this.massInKg,
      distanceInMeters: this.distanceInMeters,
    }
  }
}

