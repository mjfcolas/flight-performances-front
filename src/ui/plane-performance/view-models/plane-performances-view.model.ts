import {
  PlanePerformances,
  RunwayFactors,
  StepCoefficient,
  TemperatureMode,
  WindCoefficientComputationData
} from "../../../domain/plane";
import {PerformanceDataPoint} from "../../../domain/performance-data-point";
import {Distance} from "../../../domain/physical-quantity/distance";
import {Mass} from "../../../domain/physical-quantity/mass";
import {Temperature, TemperatureDifference} from "../../../domain/physical-quantity/temperature";
import {ChosenUnit} from "../../units/chosen-unit";


type PlanePerformancesViewModelConstructorParameterType = {
  temperatureMode: TemperatureMode,
  takeOffDataPoints: PerformanceDataPointViewModel[],
  landingDataPoints: PerformanceDataPointViewModel[],
  takeOffRunwayFactors: RunwayFactorsViewModel,
  landingRunwayFactors: RunwayFactorsViewModel,
  takeOffCoefficientsComputationData: StepCoefficient[],
  landingCoefficientsComputationData: StepCoefficient[]
}

export class PlanePerformancesViewModel {
  readonly temperatureMode: TemperatureMode;
  readonly takeOffDataPoints: PerformanceDataPointViewModel[];
  readonly landingDataPoints: PerformanceDataPointViewModel[];
  readonly takeOffRunwayFactors: RunwayFactorsViewModel;
  readonly landingRunwayFactors: RunwayFactorsViewModel;
  readonly takeOffCoefficientsComputationData: StepCoefficient[];
  readonly landingCoefficientsComputationData: StepCoefficient[];

  private constructor(
    params: PlanePerformancesViewModelConstructorParameterType) {
    this.temperatureMode = params.temperatureMode;
    this.takeOffDataPoints = params.takeOffDataPoints;
    this.landingDataPoints = params.landingDataPoints;
    this.takeOffRunwayFactors = params.takeOffRunwayFactors;
    this.landingRunwayFactors = params.landingRunwayFactors;
    this.takeOffCoefficientsComputationData = params.takeOffCoefficientsComputationData;
    this.landingCoefficientsComputationData = params.landingCoefficientsComputationData
  }

  public toPlanePerformances(): PlanePerformances {
    const takeOffDataPoints: PerformanceDataPoint[] = this.takeOffDataPoints
      .filter(dataPoint => dataPoint.distance !== undefined)
      .map(dataPoint => dataPoint.toDomain(this.temperatureMode));

    const landingDataPoints: PerformanceDataPoint[] = this.landingDataPoints
      .filter(dataPoint => dataPoint.distance !== undefined)
      .map(dataPoint => dataPoint.toDomain(this.temperatureMode));

    const takeOffRunwayFactors = this.takeOffRunwayFactors.toDomain();
    const landingRunwayFactors = this.landingRunwayFactors.toDomain();

    const takeOffCoefficientsComputationData = WindCoefficientComputationData.fromStepCoefficients(this.takeOffCoefficientsComputationData);
    const landingCoefficientsComputationData = WindCoefficientComputationData.fromStepCoefficients(this.landingCoefficientsComputationData);

    return new PlanePerformances(
      this.temperatureMode,
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
      temperatureMode: params.temperatureMode ?? this.temperatureMode,
      takeOffDataPoints: params.takeOffDataPoints ?? this.takeOffDataPoints,
      landingDataPoints: params.landingDataPoints ?? this.landingDataPoints,
      takeOffRunwayFactors: params.takeOffRunwayFactors ?? this.takeOffRunwayFactors,
      landingRunwayFactors: params.landingRunwayFactors ?? this.landingRunwayFactors,
      takeOffCoefficientsComputationData: params.takeOffCoefficientsComputationData ?? this.takeOffCoefficientsComputationData,
      landingCoefficientsComputationData: params.landingCoefficientsComputationData ?? this.landingCoefficientsComputationData
    })
  };

  changeTemperatureMode(temperatureMode: TemperatureMode): PlanePerformancesViewModel {
    return new PlanePerformancesViewModel({
      ...this,
      temperatureMode: temperatureMode
    });
  }

  changeChosenUnit(chosenUnit: ChosenUnit): PlanePerformancesViewModel {
    return new PlanePerformancesViewModel({
      ...this,
      chosenUnit: chosenUnit
    });
  }

  static empty(): PlanePerformancesViewModel {
    return new PlanePerformancesViewModel({
      temperatureMode: 'ISA',
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

    const temperatureGetter = (dataPoint: PerformanceDataPoint) =>
      planePerformances.temperatureMode === 'ISA'
        ? dataPoint.diffWithIsaTemperature.valueIn('CELSIUS')
        : dataPoint.absoluteTemperature.valueIn('CELSIUS');

    return new PlanePerformancesViewModel({
      temperatureMode: planePerformances.temperatureMode,
      takeOffDataPoints: planePerformances.takeOffDataPoints.map(dataPoint => new PerformanceDataPointViewModel({
        pressureAltitudeInFeet: dataPoint.pressureAltitudeInFeet,
        temperatureInCelsius: temperatureGetter(dataPoint),
        mass: dataPoint.mass,
        distance: dataPoint.distance
      })),
      landingDataPoints: planePerformances.landingDataPoints.map(dataPoint => new PerformanceDataPointViewModel({
        pressureAltitudeInFeet: dataPoint.pressureAltitudeInFeet,
        temperatureInCelsius: temperatureGetter(dataPoint),
        mass: dataPoint.mass,
        distance: dataPoint.distance
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
  mass: Mass;
  distance?: Distance;

  constructor(params: {
    pressureAltitudeInFeet: number,
    temperatureInCelsius: number,
    mass: Mass,
    distance?: Distance
  }) {
    this.pressureAltitudeInFeet = params.pressureAltitudeInFeet;
    this.temperatureInCelsius = params.temperatureInCelsius;
    this.mass = params.mass;
    this.distance = params.distance;
  }

  toDomain(temperatureMode: TemperatureMode): PerformanceDataPoint {
    if (this.distance == undefined) {
      throw new Error('PERFORMANCE_DATAPOINT_UNDEFINED_DISTANCE');
    }

    if (temperatureMode === 'ISA') {
      return PerformanceDataPoint.fromDiffWithIsaTemperature({
        pressureAltitudeInFeet: this.pressureAltitudeInFeet,
        diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(this.temperatureInCelsius, 'CELSIUS'),
        mass: this.mass,
        distance: this.distance,
      });
    } else {
      return PerformanceDataPoint.fromAbsoluteTemperature({
        pressureAltitudeInFeet: this.pressureAltitudeInFeet,
        absoluteTemperature: Temperature.forValueAndUnit(this.temperatureInCelsius, 'CELSIUS'),
        mass: this.mass,
        distance: this.distance,
      });
    }
  }
}

