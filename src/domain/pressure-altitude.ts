export class PressureAltitude {
  private constructor(
    public readonly pressureAltitudeInFeet: number) {
  }

  static fromAltitudeInFeetAndQnhInHpa(altitudeInFeet: number, qnhInHpa: number): PressureAltitude {
    const standardPressureDelta = 1013 - qnhInHpa;
    const pressureAltitudeInFeet = altitudeInFeet + standardPressureDelta * 28;
    return new PressureAltitude(pressureAltitudeInFeet);
  }

}
