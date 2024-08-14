import {Plane, PlanePerformances, RunwayFactors, StepCoefficient, WindCoefficientComputationData} from "../plane";

const validTakeOffPerformances = [
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 340},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 530},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 375},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 590},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 415},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 655},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 445},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 710},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 500},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 800},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 550},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 890}
]

const validLandingPerformances = [
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 435},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 510},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 460},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 545},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 485},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 575},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 475},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 565},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 505},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 600},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 535},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 635}
]

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

export const validPlanePerformances: PlanePerformances = new PlanePerformances(
  validTakeOffPerformances,
  validLandingPerformances,
  validRunwayFactors,
  validRunwayFactors,
  WindCoefficientComputationData.fromStepCoefficients(validTakeOffWindCoefficients),
  WindCoefficientComputationData.fromStepCoefficients(validLandingWindCoefficients)
);
