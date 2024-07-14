export class Temperature {
  constructor(public readonly valueInCelsius: number) {
  }

  public differenceWithStandardTemperatureAt(altitudeInFeet: number): number {
    return this.valueInCelsius - Temperature.standardTemperatureAt(altitudeInFeet);
  }

  private static standardTemperatureAt(altitudeInFeet: number): number {
    return 15 - 1.98 * altitudeInFeet / 1000;
  }
}
