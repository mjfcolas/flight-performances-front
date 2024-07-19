export interface ComputationFormOutput {
  readonly altitude: number;
  readonly qnhInHpa: number;
  readonly temperatureInCelsius: number;
  readonly massInKg: number;
  readonly runwayType: "HARD" | "GRASS";
  readonly runwayStatus: "DRY" | "WET";
  readonly headWindInKnots: number;
}
