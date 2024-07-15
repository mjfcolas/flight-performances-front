import {AltitudePressure} from "./altitude-pressure";
import {Plane} from "./plane";
import {Temperature} from "./temperature";

export class PerformanceComputeRequest {
  constructor(
    public readonly plane: Plane,
    public readonly altitudePressure: AltitudePressure,
    public readonly temperatureInCelsius: Temperature,
    public readonly massInKg: number,
    public readonly trackStatus: "DRY" | "WET",
    public readonly trackType: "HARD" | "GRASS"
  ) {
  }
}
