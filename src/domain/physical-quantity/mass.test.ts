import {Mass} from "./mass";

describe(`Mass`, () => {

  test(`Given a value in kilograms,
  when instantiating a mass,
  then mass can be retrieved either in kilograms or pounds`, () => {
    // Given
    const value = 2;
    const unit = 'KILOGRAMS';
    // When
    const mass = Mass.forValueAndUnit(value, unit);
    // Then
    expect(mass.valueIn('KILOGRAMS')).toBe(value);
    expect(mass.valueIn('POUNDS')).toBeCloseTo(4.409);
  });

  test(`Given a value in pounds,
  when instantiating a mass,
  then mass can be retrieved either in kilograms or pounds`, () => {
    // Given
    const value = 4.409;
    const unit = 'POUNDS';
    // When
    const mass = Mass.forValueAndUnit(value, unit);
    // Then
    expect(mass.valueIn('KILOGRAMS')).toBeCloseTo(2, 1);
    expect(mass.valueIn('POUNDS')).toBe(value);
  });
});
