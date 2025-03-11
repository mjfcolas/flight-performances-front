import {Mass} from "./mass";

export type FactorType = "DRY_GRASS" | "WET_GRASS" | "DRY_HARD" | "WET_HARD" | "SECURITY" | "WIND";

export class PerformanceComputeResponse {
  constructor(
    public readonly rawPerformanceInMeters: number | undefined,
    public readonly securedPerformanceInMeters: number | undefined,
    public readonly outOfBoundComputationError: boolean,
    public readonly computationData: ComputationData
  ) {
  }
}

export class ComputationData {
  constructor(
    public readonly factorMap: Map<FactorType, number>,
    public readonly pressureAltitudeInFeet: number,
    public readonly differenceWithISATemperature: number | undefined,
    public readonly absoluteTemperature: number | undefined,
    public readonly mass: Mass,
  ) {
  }
}
