import {PerformanceDataPoint} from "./performance-data-point";
import {User} from "./user/user";

export type TemperatureMode = 'ISA' | 'ABSOLUTE';

export class Plane {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly registration: string,
    public readonly performances: PlanePerformances,
    public readonly owner?: User
  ) {
  }
}

export class PlanePerformances {
  constructor(
    public readonly temperatureMode: TemperatureMode,
    public readonly takeOffDataPoints: PerformanceDataPoint[],
    public readonly landingDataPoints: PerformanceDataPoint[],
    public readonly takeOffRunwayFactors: RunwayFactors,
    public readonly landingRunwayFactors: RunwayFactors,
    public readonly takeOffCoefficientsComputationData: WindCoefficientComputationData,
    public readonly landingCoefficientsComputationData: WindCoefficientComputationData
  ) {
    if(this.takeOffCoefficientsComputationData.get().length === 0){
      throw new Error("TAKE_OFF_WIND_COEFFICIENTS_EMPTY");
    }
    if(this.landingCoefficientsComputationData.get().length === 0){
      throw new Error("LANDING_WIND_COEFFICIENTS_EMPTY");
    }
  }

}

export class RunwayFactors {
  constructor(
    public readonly grass: number,
    public readonly grassWet: number,
    public readonly hard: number,
    public readonly hardWet: number,
  ) {
  }
}

export class WindCoefficientComputationData {
  private constructor(
    private readonly byStepsCoefficients: ByStepCoefficients | undefined
  ) {
  }

  public coefficientFor(value: number): number {
    return this.byStepsCoefficients?.coefficientFor(value) ?? 1;
  }

  static fromStepCoefficients(stepCoefficients: readonly StepCoefficient[]): WindCoefficientComputationData {
    return new WindCoefficientComputationData(new ByStepCoefficients(stepCoefficients));
  }

  public get() {
    if (!this.byStepsCoefficients) {
      throw new Error();
    }
    return this.byStepsCoefficients.stepCoefficients;
  }
}

export class ByStepCoefficients {

  public readonly stepCoefficients: readonly StepCoefficient[];

  constructor(
    stepCoefficients: readonly StepCoefficient[]) {
    this.stepCoefficients = [...stepCoefficients]
      .sort((a, b) => a.step - b.step);
  }

  coefficientFor(value: number): number {
    const availableCoefficients
      = this.stepCoefficients.filter(stepCoefficient => stepCoefficient.step <= value)

    if (availableCoefficients.length === 0) {
      throw new Error("OUT_OF_BOUND_ERROR");
    }

    return availableCoefficients[availableCoefficients.length - 1].coefficient;
  }
}

export interface StepCoefficient {
  readonly step: number;
  readonly coefficient: number;
}

