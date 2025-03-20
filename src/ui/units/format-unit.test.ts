import {
  displayAtmosphericPressureUnit,
  displayDistanceUnit,
  displayMassUnit,
  displayTemperatureUnit
} from "./format-unit";

describe('FormatUnit', () => {
  describe('displayDistanceUnit', () => {
    test('returns "m" for METERS unit', () => {
      expect(displayDistanceUnit('METERS')).toBe('m');
    });

    test('returns "ft" for FEET unit', () => {
      expect(displayDistanceUnit('FEET')).toBe('ft');
    });
  });

  describe('displayTemperatureUnit', () => {
    test('returns "°C" for CELSIUS unit', () => {
      expect(displayTemperatureUnit('CELSIUS')).toBe('°C');
    });

    test('returns "°F" for FAHRENHEIT unit', () => {
      expect(displayTemperatureUnit('FAHRENHEIT')).toBe('°F');
    });
  });

  describe('displayMassUnit', () => {
    test('returns "kg" for KILOGRAMS unit', () => {
      expect(displayMassUnit('KILOGRAMS')).toBe('kg');
    });

    test('returns "lb" for POUNDS unit', () => {
      expect(displayMassUnit('POUNDS')).toBe('lb');
    });
  });

  describe('displayAtmosphericPressureUnit', () => {
    test('returns "hPa" for HPA unit', () => {
      expect(displayAtmosphericPressureUnit('HPA')).toBe('hPa');
    });

    test('returns "inHg" for INHG unit', () => {
      expect(displayAtmosphericPressureUnit('INHG')).toBe('inHg');
    });
  });
});
