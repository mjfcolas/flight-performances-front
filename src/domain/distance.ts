export type DistanceUnit = 'METERS' | 'FEET';

const FEET_IN_METERS = 0.3048;

export class Distance {

  private constructor(private readonly valueInMeters: number) {
  }

  static forValueAndUnit(value: number, unit: DistanceUnit): Distance {
    return new Distance(unit === 'METERS' ? value : value * FEET_IN_METERS);
  }

  public valueIn(unit: DistanceUnit): number {
    return unit === 'METERS' ? this.valueInMeters : this.valueInMeters / FEET_IN_METERS;
  }

}
