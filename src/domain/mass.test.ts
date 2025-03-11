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
});
