export type TemperatureUnit = 'CELSIUS' | 'FAHRENHEIT';
export const isTemperatureUnit = (value: string): value is TemperatureUnit => ['CELSIUS', 'FAHRENHEIT'].includes(value);

const FAHRENHEIT_TO_CELSIUS_RATIO = 5 / 9;
const FAHRENHEIT_TO_CELSIUS_OFFSET = 32;
const fahrenheitToCelsius = (value: number): number => (value - FAHRENHEIT_TO_CELSIUS_OFFSET) * FAHRENHEIT_TO_CELSIUS_RATIO;
const celsiusToFahrenheit = (value: number): number => value / FAHRENHEIT_TO_CELSIUS_RATIO + FAHRENHEIT_TO_CELSIUS_OFFSET;


export class TemperatureDifference {
  private constructor(private readonly differenceInCelsius: number) {
  }

  static forValueAndUnit(differenceValue: number, unit: TemperatureUnit): TemperatureDifference {
    return new TemperatureDifference(unit === 'CELSIUS' ? differenceValue : FAHRENHEIT_TO_CELSIUS_RATIO * differenceValue);
  }

  public valueIn(unit: TemperatureUnit): number {
    return unit === 'CELSIUS' ? this.differenceInCelsius : this.differenceInCelsius / FAHRENHEIT_TO_CELSIUS_RATIO;
  }
}

export class Temperature {

  private constructor(private readonly valueInCelsius: number) {
  }

  static forValueAndUnit(value: number, unit: TemperatureUnit): Temperature {
    return new Temperature(unit === 'CELSIUS' ? value : fahrenheitToCelsius(value));
  }


  public valueIn(unit: TemperatureUnit): number {
    return unit === 'CELSIUS' ? this.valueInCelsius : celsiusToFahrenheit(this.valueInCelsius);
  }

  public differenceWithISATemperatureAt(altitudeInFeet: number): TemperatureDifference {
    const diffInCelsius = this.valueInCelsius - Temperature.ISATemperatureAt(altitudeInFeet).valueInCelsius;
    return TemperatureDifference.forValueAndUnit(diffInCelsius, 'CELSIUS');
  }

  public add(value: TemperatureDifference): Temperature {
    return new Temperature(this.valueInCelsius + value.valueIn('CELSIUS'));
  }

  public static ISATemperatureAt(altitudeInFeet: number): Temperature {
    return new Temperature(15 - 1.98 * altitudeInFeet / 1000);
  }
}

