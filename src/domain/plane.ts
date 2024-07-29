import {PerformanceDataPoint} from "./performance-data-point";

export class Plane {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly immat: string,
    public readonly performances: PlanePerformances
  ) {
  }
}

export class PlanePerformances {
  constructor(
    public readonly takeOffDataPoints: PerformanceDataPoint[],
    public readonly landingDataPoints: PerformanceDataPoint[],
    public readonly takeOffRunwayFactors: RunwayFactors,
    public readonly landingRunwayFactors: RunwayFactors,
    public readonly takeOffCoefficientsComputationData: WindCoefficientComputationData,
    public readonly landingCoefficientsComputationData: WindCoefficientComputationData
  ) {
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

  static fromStepCoefficients(stepCoefficients: StepCoefficient[]): WindCoefficientComputationData {
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
    stepCoefficients: StepCoefficient[]) {
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

