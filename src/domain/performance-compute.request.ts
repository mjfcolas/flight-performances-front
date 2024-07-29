import {PressureAltitude} from "./pressure-altitude";
import {Plane, PlanePerformances} from "./plane";
import {Temperature} from "./temperature";

export class PerformanceComputeRequest {
  constructor(
    public readonly performances: PlanePerformances,
    public readonly pressureAltitude: PressureAltitude,
    public readonly temperatureInCelsius: Temperature,
    public readonly massInKg: number,
    public readonly runwayStatus: "DRY" | "WET",
    public readonly runwayType: "HARD" | "GRASS",
    public readonly headwindInKnots: number,
  ) {
  }
}
