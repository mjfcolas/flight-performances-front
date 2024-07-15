import {PressureAltitude} from "./pressure-altitude";
import {Plane} from "./plane";
import {Temperature} from "./temperature";

export class PerformanceComputeRequest {
  constructor(
    public readonly plane: Plane,
    public readonly pressureAltitude: PressureAltitude,
    public readonly temperatureInCelsius: Temperature,
    public readonly massInKg: number,
    public readonly runwayStatus: "DRY" | "WET",
    public readonly runwayType: "HARD" | "GRASS"
  ) {
  }
}
