import {AtmosphericPressure} from "./atmospheric-pressure";

export class PressureAltitude {
  private constructor(
    public readonly pressureAltitudeInFeet: number) {
  }

  static fromAltitudeInFeetAndQnh(altitudeInFeet: number, qnh: AtmosphericPressure): PressureAltitude {
    const standardPressureDelta = 1013 - qnh.valueIn("HPA");
    const pressureAltitudeInFeet = altitudeInFeet + standardPressureDelta * 28;
    return new PressureAltitude(pressureAltitudeInFeet);
  }

}
