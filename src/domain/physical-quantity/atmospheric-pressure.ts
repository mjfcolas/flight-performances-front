export type AtmosphericPressureUnit = 'HPA' | 'INHG';
export const isAtmosphericPressureUnit = (value: string): value is AtmosphericPressureUnit => ['HPA', 'INHG'].includes(value);

const INHG_IN_HPA = 33.863889532611;

export class AtmosphericPressure {

  private constructor(private readonly valueInHpa: number) {
  }

  static forValueAndUnit(value: number, unit: AtmosphericPressureUnit): AtmosphericPressure {
    return new AtmosphericPressure(unit === 'HPA' ? value : value * INHG_IN_HPA);
  }

  public valueIn(unit: AtmosphericPressureUnit): number {
    return unit === 'HPA' ? this.valueInHpa : this.valueInHpa / INHG_IN_HPA;
  }

}
