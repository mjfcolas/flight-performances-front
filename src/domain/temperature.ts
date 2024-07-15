export class Temperature {
  constructor(public readonly valueInCelsius: number) {
  }

  public differenceWithISATemperatureAt(altitudeInFeet: number): number {
    return this.valueInCelsius - Temperature.ISATemperatureAt(altitudeInFeet).valueInCelsius;
  }

  public static ISATemperatureAt(altitudeInFeet: number): Temperature {
    return new Temperature(15 - 1.98 * altitudeInFeet / 1000);
  }
}
