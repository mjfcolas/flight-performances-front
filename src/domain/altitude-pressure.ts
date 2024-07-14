export class AltitudePressure{
  private constructor(
    public readonly altitudePressureInFeet: number) {
  }

  static fromAltitudePressureInFeet(altitudePressureInFeet: number): AltitudePressure {
    return new AltitudePressure(altitudePressureInFeet);
  }

  static fromAltitudeInFeetAndQnhInHpa(altitudeInFeet: number, qnhInHpa: number): AltitudePressure {
    const standardPressureDelta = 1013 - qnhInHpa;
    const altitudePressureInFeet = altitudeInFeet + standardPressureDelta * 28;
    return new AltitudePressure(altitudePressureInFeet);
  }

}
