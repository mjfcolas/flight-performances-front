import {PressureAltitude} from "./physical-quantity/pressure-altitude";
import {Plane, PlanePerformances} from "./plane";
import {Temperature} from "./physical-quantity/temperature";
import {Mass} from "./physical-quantity/mass";

export class PerformanceComputeRequest {
  constructor(
    public readonly performances: PlanePerformances,
    public readonly pressureAltitude: PressureAltitude,
    public readonly temperature: Temperature,
    public readonly mass: Mass,
    public readonly runwayStatus: "DRY" | "WET",
    public readonly runwayType: "HARD" | "GRASS",
    public readonly headwindInKnots: number,
  ) {
  }
}
