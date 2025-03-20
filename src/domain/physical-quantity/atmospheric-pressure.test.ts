import {AtmosphericPressure} from "./atmospheric-pressure";

describe(`Atmospheric Pressure`, () => {
  test(`Given a value in hectopascals,
  when instantiating an atmospheric pressure,
  then atmospheric pressure can be retrieved in hectopascals or in inches of mercury `, () => {
    // Given
    const value = 1013.25;
    const unit = 'HPA';
    // When
    const mass = AtmosphericPressure.forValueAndUnit(value, unit);
    // Then
    expect(mass.valueIn('HPA')).toBe(value);
    expect(mass.valueIn('INHG')).toBeCloseTo(29.92);
  });

  test(`Given a value in inches of mercury,
  when instantiating an atmospheric pressure,
  then atmospheric pressure can be retrieved in hectopascals or in inches of mercury `, () => {
    // Given
    const value = 29.92;
    const unit = 'INHG';
    // When
    const mass = AtmosphericPressure.forValueAndUnit(value, unit);
    // Then
    expect(mass.valueIn('HPA')).toBeCloseTo(1013.2, 1);
    expect(mass.valueIn('INHG')).toBe(value);
  });
})
