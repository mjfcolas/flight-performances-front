import {PerformanceDataPoint} from "./performance-data-point";
import {Distance} from "./distance";
import {Mass} from "./mass";

describe(`Performance data point`, () => {

  const aPressureAltitude = 0;
  const aMass = Mass.forValueAndUnit(900, "KILOGRAMS");
  const aDistance = Distance.forValueAndUnit(1000, 'METERS');

  test(`Given a pressure altitude, a mass, a distance and an absolute temperature,
  when creating a performance data point,
  then the performance data point is created and temperature can be retrieved either as absolute value or as a difference with ISA temperature`, () => {
    const anAbsoluteTemperature = 15

    const dataPoint = PerformanceDataPoint.fromAbsoluteTemperatureInCelsius({
      pressureAltitudeInFeet: aPressureAltitude,
      mass: aMass,
      distance: aDistance,
      absoluteTemperatureInCelsius: anAbsoluteTemperature
    })

    expect(dataPoint.diffWithIsaTemperatureInCelsius).toBe(0)
    expect(dataPoint.absoluteTemperatureInCelsius).toBe(anAbsoluteTemperature)
  })

  test(`Given a pressure altitude, a mass, a distance and a temperature difference with ISA temperature,
  when creating a performance data point,
  then the performance data point is created and temperature can be retrieved either as absolute value or as a difference with ISA temperature`, () => {
    const aTemperatureDifference = 10

    const dataPoint = PerformanceDataPoint.fromDiffWithIsaTemperatureInCelsius({
      pressureAltitudeInFeet: aPressureAltitude,
      mass: aMass,
      distance: aDistance,
      diffWithIsaTemperatureInCelsius: aTemperatureDifference
    })

    expect(dataPoint.diffWithIsaTemperatureInCelsius).toBe(aTemperatureDifference)
    expect(dataPoint.absoluteTemperatureInCelsius).toBe(25)
  });
})
