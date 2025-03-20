import {Temperature, TemperatureDifference} from "./temperature";

describe(`Temperature`, () => {

  test(`Given a value in Celsius,
  when instantiating a temperature,
  then temperature can be retrieved either in Celsius or Fahrenheit`, () => {
    // Given
    const value = 2;
    const unit = 'CELSIUS';
    // When
    const temperature = Temperature.forValueAndUnit(value, unit);
    // Then
    expect(temperature.valueIn('CELSIUS')).toBe(value);
    expect(temperature.valueIn('FAHRENHEIT')).toBeCloseTo(35.6);
  })

  test(`Given a value in Fahrenheit,
  when instantiating a temperature,
  then temperature can be retrieved either in Celsius or Fahrenheit`, () => {
    // Given
    const value = 35.6;
    const unit = 'FAHRENHEIT';
    // When
    const temperature = Temperature.forValueAndUnit(value, unit);
    // Then
    expect(temperature.valueIn('CELSIUS')).toBeCloseTo(2, 1);
    expect(temperature.valueIn('FAHRENHEIT')).toBe(value);
  })

  test(`Given a temperature,
  when calculating the difference with ISA temperature at 1000 feet,
  then the difference is correctly calculated`, () => {
    // Given
    const value = 2;
    const unit = 'CELSIUS';
    const temperature = Temperature.forValueAndUnit(value, unit);
    // When
    const difference = temperature.differenceWithISATemperatureAt(1000);
    // Then
    expect(difference.valueIn('CELSIUS')).toBeCloseTo(-11, 1);
  })

  test(`Given a temperature,
  when adding a temperature difference,
  then the result is correctly calculated`, () => {
    // Given
    const value = 2;
    const unit = 'CELSIUS';
    const temperature = Temperature.forValueAndUnit(value, unit);
    const difference = TemperatureDifference.forValueAndUnit(10, 'CELSIUS');
    // When
    const result = temperature.add(difference);
    // Then
    expect(result.valueIn('CELSIUS')).toBeCloseTo(12, 1);
  })

  test(`Given a temperature,
  when calculating the ISA temperature at 1000 feet,
  then the result is correctly calculated`, () => {
    const isaTemperature = Temperature.ISATemperatureAt(1000);
    expect(isaTemperature.valueIn('CELSIUS')).toBeCloseTo(13, 1);
  })

})

describe(`Temperature difference`, () => {
  test(`Given a value in Celsius,
  when instantiating a temperature difference,
  then temperature difference can be retrieved either in Celsius or Fahrenheit`, () => {
    // Given
    const value = 2;
    const unit = 'CELSIUS';
    // When
    const temperatureDifference = TemperatureDifference.forValueAndUnit(value, unit);
    // Then
    expect(temperatureDifference.valueIn('CELSIUS')).toBe(value);
    expect(temperatureDifference.valueIn('FAHRENHEIT')).toBeCloseTo(3.6);
  })

  test(`Given a value in Fahrenheit,
  when instantiating a temperature difference,
  then temperature difference can be retrieved either in Celsius or Fahrenheit`, () => {
    // Given
    const value = 3.6;
    const unit = 'FAHRENHEIT';
    // When
    const temperatureDifference = TemperatureDifference.forValueAndUnit(value, unit);
    // Then
    expect(temperatureDifference.valueIn('CELSIUS')).toBeCloseTo(2, 1);
    expect(temperatureDifference.valueIn('FAHRENHEIT')).toBeCloseTo(value);
  })
})
