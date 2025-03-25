import {Distance} from "../../domain/physical-quantity/distance";
import {
  formatDistance,
  formatMass,
  formatTemperature,
  roundAtmosphericPressure,
  roundMass,
  roundTemperature
} from "./format-physical-value";
import {Temperature, TemperatureDifference} from "../../domain/physical-quantity/temperature";
import {Mass} from "../../domain/physical-quantity/mass";
import {AtmosphericPressure} from "../../domain/physical-quantity/atmospheric-pressure";

describe('FormatPhysicalValue', () => {
  const locale = 'en-US';

  describe('formatDistance', () => {
    test('formats a distance in meters', () => {
      const distance = Distance.forValueAndUnit(1500, "METERS");
      const result = formatDistance(distance, "METERS", locale);
      expect(result).toBe('1,500 m');
    });

    test('formats a distance in feet', () => {
      const distance = Distance.forValueAndUnit(5280, "FEET");
      const result = formatDistance(distance, "FEET", locale);
      expect(result).toBe('5,280 ft');
    });

    test('rounds to integer value', () => {
      const distance = Distance.forValueAndUnit(123.75, "METERS");
      const result = formatDistance(distance, "METERS", locale);
      expect(result).toBe('124 m');
    });
  });

  describe('formatTemperature', () => {
    test('formats a temperature in Celsius', () => {
      const temperature = Temperature.forValueAndUnit(25.56, "CELSIUS");
      const result = formatTemperature(temperature, "CELSIUS", locale);
      expect(result).toBe('25.6 °C');
    });

    test('formats a temperature in Fahrenheit', () => {
      const temperature = Temperature.forValueAndUnit(32, "FAHRENHEIT");
      const result = formatTemperature(temperature, "FAHRENHEIT", locale);
      expect(result).toBe('32.0 °F');
    });

    test('formats a temperature difference in Celsius', () => {
      const tempDiff = TemperatureDifference.forValueAndUnit(15.25, "CELSIUS");
      const result = formatTemperature(tempDiff, "CELSIUS", locale);
      expect(result).toBe('15.3 °C');
    });
  });

  describe('formatMass', () => {
    test('formats mass in kilograms', () => {
      const mass = Mass.forValueAndUnit(2500, "KILOGRAMS");
      const result = formatMass(mass, "KILOGRAMS", locale);
      expect(result).toBe('2,500 kg');
    });

    test('formats mass in pounds', () => {
      const mass = Mass.forValueAndUnit(1500, "POUNDS");
      const result = formatMass(mass, "POUNDS", locale);
      expect(result).toBe('1,500 lb');
    });

    test('rounds to integer value', () => {
      const mass = Mass.forValueAndUnit(74.3, "KILOGRAMS");
      const result = formatMass(mass, "KILOGRAMS", locale);
      expect(result).toBe('74 kg');
    });
  });


  describe('roundTemperature', () => {
    test('rounds temperature to 1 decimal place in Celsius', () => {
      const temperature = Temperature.forValueAndUnit(25.56, "CELSIUS");
      const result = roundTemperature(temperature, "CELSIUS");
      expect(result).toBe(25.6);
    });

    test('rounds temperature to 1 decimal place in Fahrenheit', () => {
      const temperature = Temperature.forValueAndUnit(98.43, "FAHRENHEIT");
      const result = roundTemperature(temperature, "FAHRENHEIT");
      expect(result).toBe(98.4);
    });

    test('rounds temperature difference to 1 decimal place', () => {
      const tempDiff = TemperatureDifference.forValueAndUnit(15.25, "CELSIUS");
      const result = roundTemperature(tempDiff, "CELSIUS");
      expect(result).toBe(15.3);
    });
  });

  describe('roundMass', () => {
    test('rounds mass to integer in kilograms', () => {
      const mass = Mass.forValueAndUnit(74.3, "KILOGRAMS");
      const result = roundMass(mass, "KILOGRAMS");
      expect(result).toBe(74);
    });

    test('rounds mass to integer in pounds', () => {
      const mass = Mass.forValueAndUnit(165.7, "POUNDS");
      const result = roundMass(mass, "POUNDS");
      expect(result).toBe(166);
    });
  });

  describe('roundAtmosphericPressure', () => {
    test('rounds pressure to 2 decimal places in hPa', () => {
      const pressure = AtmosphericPressure.forValueAndUnit(1013.456, "HPA");
      const result = roundAtmosphericPressure(pressure, "HPA");
      expect(result).toBe(1013.46);
    });

    test('rounds pressure to 2 decimal places in inHg', () => {
      const pressure = AtmosphericPressure.forValueAndUnit(29.9234, "INHG");
      const result = roundAtmosphericPressure(pressure, "INHG");
      expect(result).toBe(29.92);
    });
  });
});
