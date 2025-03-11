import {Distance} from "./distance";

describe(`Distance`, () => {

  test(`Given a value in meters,
  when instantiating a distance,
  then distance can be retrieved either in meters or feet`, () => {
    // Given
    const value = 2;
    const unit = 'METERS';
    // When
    const mass = Distance.forValueAndUnit(value, unit);
    // Then
    expect(mass.valueIn('METERS')).toBe(value);
    expect(mass.valueIn('FEET')).toBeCloseTo(6.562);
  });
});
