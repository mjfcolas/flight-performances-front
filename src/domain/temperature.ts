export class Temperature {
  constructor(public readonly valueInCelsius: number) {
  }

  public differenceWithStandardTemperatureAt(altitudeInFeet: number): number {
    return this.valueInCelsius - Temperature.standardTemperatureAt(altitudeInFeet).valueInCelsius;
  }

  public static standardTemperatureAt(altitudeInFeet: number): Temperature {
    return new Temperature(15 - 1.98 * altitudeInFeet / 1000);
  }
}
