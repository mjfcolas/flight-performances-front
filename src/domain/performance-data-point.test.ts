import {PerformanceDataPoint} from "./performance-data-point";
import {Distance} from "./physical-quantity/distance";
import {Mass} from "./physical-quantity/mass";
import {Temperature, TemperatureDifference} from "./physical-quantity/temperature";

describe(`Performance data point`, () => {

  const aPressureAltitude = 0;
  const aMass = Mass.forValueAndUnit(900, "KILOGRAMS");
  const aDistance = Distance.forValueAndUnit(1000, 'METERS');

  test(`Given a pressure altitude, a mass, a distance and an absolute temperature,
  when creating a performance data point,
  then the performance data point is created and temperature can be retrieved either as absolute value or as a difference with ISA temperature`, () => {
    const anAbsoluteTemperature = Temperature.forValueAndUnit(15, 'CELSIUS')

    const dataPoint = PerformanceDataPoint.fromAbsoluteTemperature({
      pressureAltitudeInFeet: aPressureAltitude,
      mass: aMass,
      distance: aDistance,
      absoluteTemperature: anAbsoluteTemperature
    })

    expect(dataPoint.diffWithIsaTemperature.valueIn('CELSIUS')).toBe(0)
    expect(dataPoint.absoluteTemperature).toBe(anAbsoluteTemperature)
  })

  test(`Given a pressure altitude, a mass, a distance and a temperature difference with ISA temperature,
  when creating a performance data point,
  then the performance data point is created and temperature can be retrieved either as absolute value or as a difference with ISA temperature`, () => {
    const aTemperatureDifference = TemperatureDifference.forValueAndUnit(10, 'CELSIUS')

    const dataPoint = PerformanceDataPoint.fromDiffWithIsaTemperature({
      pressureAltitudeInFeet: aPressureAltitude,
      mass: aMass,
      distance: aDistance,
      diffWithIsaTemperature: aTemperatureDifference
    })

    expect(dataPoint.diffWithIsaTemperature).toBe(aTemperatureDifference)
    expect(dataPoint.absoluteTemperature.valueIn('CELSIUS')).toBe(25)
  });
})
