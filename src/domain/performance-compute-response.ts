import {Mass} from "./physical-quantity/mass";
import {Temperature, TemperatureDifference} from "./physical-quantity/temperature";
import {Distance} from "./physical-quantity/distance";

export type FactorType = "DRY_GRASS" | "WET_GRASS" | "DRY_HARD" | "WET_HARD" | "SECURITY" | "WIND";

export class PerformanceComputeResponse {
  constructor(
    public readonly rawPerformance: Distance | undefined,
    public readonly securedPerformance: Distance | undefined,
    public readonly outOfBoundComputationError: boolean,
    public readonly computationData: ComputationData
  ) {
  }
}

export class ComputationData {
  constructor(
    public readonly factorMap: Map<FactorType, number>,
    public readonly pressureAltitudeInFeet: number,
    public readonly differenceWithISATemperature: TemperatureDifference | undefined,
    public readonly absoluteTemperature: Temperature | undefined,
    public readonly mass: Mass,
  ) {
  }
}
