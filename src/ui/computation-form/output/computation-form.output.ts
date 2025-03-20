import {AtmosphericPressure} from "../../../domain/physical-quantity/atmospheric-pressure";
import {Temperature} from "../../../domain/physical-quantity/temperature";
import {Mass} from "../../../domain/physical-quantity/mass";

export interface ComputationFormOutput {
  readonly altitude: number;
  readonly qnh: AtmosphericPressure;
  readonly temperature: Temperature;
  readonly mass: Mass;
  readonly runwayType: "HARD" | "GRASS";
  readonly runwayStatus: "DRY" | "WET";
  readonly headWindInKnots: number;
}
