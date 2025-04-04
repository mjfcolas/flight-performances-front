import {PlanePerformances, RunwayFactors, StepCoefficient, WindCoefficientComputationData} from "../plane";
import {PerformanceDataPoint} from "../performance-data-point";
import {Distance} from "../physical-quantity/distance";
import {Mass} from "../physical-quantity/mass";
import {Temperature, TemperatureDifference} from "../physical-quantity/temperature";

const validDiffWithISATakeOffPerformances = [
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 340},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 530},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 375},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 590},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 415},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 655},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 445},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 710},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 500},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 800},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 550},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 890}
].map((dto) => PerformanceDataPoint.fromDiffWithIsaTemperature({
  ...dto,
  distance: Distance.forValueAndUnit(dto.distanceInMeters, 'METERS'),
  mass: Mass.forValueAndUnit(dto.massInKg, 'KILOGRAMS'),
  diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(dto.diffWithIsaTemperatureInCelsius, 'CELSIUS')
}));

const validDiffWithISALandingPerformances = [
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 435},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 510},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 460},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 545},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 485},
  {pressureAltitudeInFeet: 0, diffWithIsaTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 575},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 475},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 565},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 505},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 600},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 535},
  {pressureAltitudeInFeet: 4000, diffWithIsaTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 635}
].map((dto) => PerformanceDataPoint.fromDiffWithIsaTemperature({
  ...dto,
  distance: Distance.forValueAndUnit(dto.distanceInMeters, 'METERS'),
  mass: Mass.forValueAndUnit(dto.massInKg, 'KILOGRAMS'),
  diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(dto.diffWithIsaTemperatureInCelsius, 'CELSIUS')
}));

const validAbsoluteTemperatureTakeOffPerformances = [
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 340},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 530},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 375},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 590},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 415},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 655},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 445},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 710},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 500},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 800},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 550},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 890}
].map((dto) => PerformanceDataPoint.fromAbsoluteTemperature({
  ...dto,
  distance: Distance.forValueAndUnit(dto.distanceInMeters, 'METERS'),
  mass: Mass.forValueAndUnit(dto.massInKg, 'KILOGRAMS'),
  absoluteTemperature: Temperature.forValueAndUnit(dto.absoluteTemperatureInCelsius, 'CELSIUS')
}));

const validAbsoluteTemperatureLandingPerformances = [
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 435},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 510},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 460},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 545},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 485},
  {pressureAltitudeInFeet: 0, absoluteTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 575},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: -20, massInKg: 850, distanceInMeters: 475},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 565},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 0, massInKg: 850, distanceInMeters: 505},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 600},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 20, massInKg: 850, distanceInMeters: 535},
  {pressureAltitudeInFeet: 4000, absoluteTemperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 635}
].map((dto) => PerformanceDataPoint.fromAbsoluteTemperature({
  ...dto,
  distance: Distance.forValueAndUnit(dto.distanceInMeters, 'METERS'),
  mass: Mass.forValueAndUnit(dto.massInKg, 'KILOGRAMS'),
  absoluteTemperature: Temperature.forValueAndUnit(dto.absoluteTemperatureInCelsius, 'CELSIUS')
}));


const validRunwayFactors: RunwayFactors = new RunwayFactors(1.15, 1.15, 1, 1);

const validTakeOffWindCoefficients: StepCoefficient[] = [
  {step: -10, coefficient: 1.5},
  {step: -8, coefficient: 1.4},
  {step: -6, coefficient: 1.3},
  {step: -4, coefficient: 1.2},
  {step: -2, coefficient: 1.1},
  {step: 0, coefficient: 1},
  {step: 10, coefficient: 0.85},
  {step: 20, coefficient: 0.65},
  {step: 30, coefficient: 0.55},
]

const validLandingWindCoefficients: StepCoefficient[] = [
  {step: -10, coefficient: 1.5},
  {step: -8, coefficient: 1.4},
  {step: -6, coefficient: 1.3},
  {step: -4, coefficient: 1.2},
  {step: -2, coefficient: 1.1},
  {step: 0, coefficient: 1},
  {step: 10, coefficient: 0.85},
  {step: 20, coefficient: 0.65},
  {step: 30, coefficient: 0.55},
]

export const validDiffWithISAPlanePerformances: PlanePerformances = new PlanePerformances(
  'ISA',
  validDiffWithISATakeOffPerformances,
  validDiffWithISALandingPerformances,
  validRunwayFactors,
  validRunwayFactors,
  WindCoefficientComputationData.fromStepCoefficients(validTakeOffWindCoefficients),
  WindCoefficientComputationData.fromStepCoefficients(validLandingWindCoefficients)
);

export const validAbsoluteTemperaturePlanePerformances: PlanePerformances = new PlanePerformances(
  'ABSOLUTE',
  validAbsoluteTemperatureTakeOffPerformances,
  validAbsoluteTemperatureLandingPerformances,
  validRunwayFactors,
  validRunwayFactors,
  WindCoefficientComputationData.fromStepCoefficients(validTakeOffWindCoefficients),
  WindCoefficientComputationData.fromStepCoefficients(validLandingWindCoefficients)
);

export const simpleValidPlanePerformance: PlanePerformances = new PlanePerformances(
  'ISA',
  [PerformanceDataPoint.fromDiffWithIsaTemperature({
    pressureAltitudeInFeet: 0,
    diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(-20, 'CELSIUS'),
    mass: Mass.forValueAndUnit(850, "KILOGRAMS"),
    distance: Distance.forValueAndUnit(340, "METERS")
  })],
  [PerformanceDataPoint.fromDiffWithIsaTemperature({
    pressureAltitudeInFeet: 0,
    diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(-20, 'CELSIUS'),
    mass: Mass.forValueAndUnit(850, "KILOGRAMS"),
    distance: Distance.forValueAndUnit(435, "METERS")
  })],
  validRunwayFactors,
  validRunwayFactors,
  WindCoefficientComputationData.fromStepCoefficients([{step: -10, coefficient: 1.5}]),
  WindCoefficientComputationData.fromStepCoefficients([{step: -10, coefficient: 1.5}])
);
