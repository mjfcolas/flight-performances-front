import {PlanePerformances, RunwayFactors, StepCoefficient, WindCoefficientComputationData} from "../plane";

const validPerformances = [
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 365},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 435},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 385},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 460},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 400},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 485},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 395},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 475},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 420},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 505},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 440},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 535}
]

const validRunwayFactors: RunwayFactors = new RunwayFactors(1.15, 1.15, 1, 1);

const validWindCoefficients: StepCoefficient[] = [
  {step: -10, coefficient: 1.5},
  {step: -8, coefficient: 1.4},
  {step: -6, coefficient: 1.3},
  {step: -4, coefficient: 1.2},
  {step: -2, coefficient: 1.1},
  {step: 0, coefficient: 1},
  {step: 10, coefficient: 0.78},
  {step: 20, coefficient: 0.63},
  {step: 30, coefficient: 0.52},
]

export const validPlanePerformances: PlanePerformances = new PlanePerformances(
  validPerformances,
  validPerformances,
  validRunwayFactors,
  validRunwayFactors,
  WindCoefficientComputationData.fromStepCoefficients(validWindCoefficients),
  WindCoefficientComputationData.fromStepCoefficients(validWindCoefficients)
);
