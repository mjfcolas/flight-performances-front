export type MassUnit = 'KILOGRAMS' | 'POUNDS';
export const isMassUnit = (value: string): value is MassUnit => ['KILOGRAMS', 'POUNDS'].includes(value);

const POUNDS_IN_KILOGRAMS = 0.45359237;

export class Mass {

  private constructor(private readonly valueInKilograms: number) {
  }

  static forValueAndUnit(value: number, unit: MassUnit): Mass {
    return new Mass(unit === 'KILOGRAMS' ? value : value * POUNDS_IN_KILOGRAMS);
  }

  public valueIn(unit: MassUnit): number {
    return unit === 'KILOGRAMS' ? this.valueInKilograms : this.valueInKilograms / POUNDS_IN_KILOGRAMS;
  }

}
