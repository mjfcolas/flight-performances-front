import {PerformanceComputer} from "./performance-computer";
import {PressureAltitude} from "./pressure-altitude";
import {PerformanceComputeRequest} from "./performance-compute.request";
import {Temperature} from "./temperature";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {validPlanePerformances} from "./__test__/test-plane";

describe(`PerformanceComputer`, () => {

  const performanceComputer = new PerformanceComputer(
    new TrilinearInterpolationProvider()
  );

  const A_NOMINAL_ELEVATION = PressureAltitude.fromAltitudeInFeetAndQnhInHpa(357, 1013);
  const A_NOMINAL_TEMPERATURE = 15;

  const nominalTestCase = [
    "Normally loaded plane at nominal temperature and pressure on a dry hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validPlanePerformances,
      A_NOMINAL_ELEVATION,
      new Temperature(A_NOMINAL_TEMPERATURE),
      900,
      "DRY",
      "HARD",
      0
    ),
    {
      rawTakeOffPerformance: 443,
      securedTakeOffPerformance: 532,
      rawLandingPerformance: 486,
      securedLandingPerformance: 584
    }
  ]

  const nominalOnGrassRunwayTestCase = [
    "Normally loaded plane at nominal temperature and pressure on a dry grass runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validPlanePerformances,
      A_NOMINAL_ELEVATION,
      new Temperature(A_NOMINAL_TEMPERATURE),
      900,
      "DRY",
      "GRASS",
      0
    ), {
      rawTakeOffPerformance: 443,
      securedTakeOffPerformance: 612,
      rawLandingPerformance: 486,
      securedLandingPerformance: 671
    }
  ]

  const nominalOnWetRunwayTestCase = [
    "Normally loaded plane at nominal temperature and pressure on a wet hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validPlanePerformances,
      A_NOMINAL_ELEVATION,
      new Temperature(A_NOMINAL_TEMPERATURE),
      900,
      "WET",
      "HARD",
      0
    ), {
      rawTakeOffPerformance: 443,
      securedTakeOffPerformance: 532,
      rawLandingPerformance: 486,
      securedLandingPerformance: 584
    }
  ]

  const overloadedPlaneTestCase = [
    "Over loaded plane at nominal temperature and pressure on a dry hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validPlanePerformances,
      A_NOMINAL_ELEVATION,
      new Temperature(A_NOMINAL_TEMPERATURE),
      1200,
      "DRY",
      "HARD",
      0
    ), {
      rawTakeOffPerformance: 443,
      securedTakeOffPerformance: 532,
      rawLandingPerformance: 486,
      securedLandingPerformance: 583
    }
  ]

  const underloadedPlaneTestCase = [
    "Under loaded plane at nominal temperature and pressure on a dry hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validPlanePerformances,
      A_NOMINAL_ELEVATION,
      new Temperature(A_NOMINAL_TEMPERATURE),
      750,
      "DRY",
      "HARD",
      0
    ), {
      rawTakeOffPerformance: 388,
      securedTakeOffPerformance: 465,
      rawLandingPerformance: 465,
      securedLandingPerformance: 558
    }
  ]

  const seaLevelWithHighAtmosphericPressureTestCase = [
    "Normally loaded plane at nominal temperature and high atmospheric pressure on a dry hard runway at seat level elevation without wind",
    new PerformanceComputeRequest(
      validPlanePerformances,
      PressureAltitude.fromAltitudeInFeetAndQnhInHpa(0, 1020),
      new Temperature(A_NOMINAL_TEMPERATURE),
      900,
      "DRY",
      "HARD",
      0
    ), {
      rawTakeOffPerformance: 428,
      securedTakeOffPerformance: 514,
      rawLandingPerformance: 481,
      securedLandingPerformance: 577
    }
  ]

  const completedCases: any[] = [
    nominalTestCase,
    nominalOnGrassRunwayTestCase,
    nominalOnWetRunwayTestCase,
    underloadedPlaneTestCase,
    seaLevelWithHighAtmosphericPressureTestCase
  ]

  const inErrorCases: any[] = [
    overloadedPlaneTestCase,
  ]

  test.each(completedCases)(`%p`, (description, request, expectedResult) => {
    const result = performanceComputer.compute(request);
    expect(result.takeOffPerformanceComputeResponse.rawPerformanceInMeters).toBeCloseTo(expectedResult.rawTakeOffPerformance, 0);
    expect(result.takeOffPerformanceComputeResponse.securedPerformanceInMeters).toBeCloseTo(expectedResult.securedTakeOffPerformance, 0);
    expect(result.landingPerformanceComputeResponse.rawPerformanceInMeters).toBeCloseTo(expectedResult.rawLandingPerformance, 0);
    expect(result.landingPerformanceComputeResponse.securedPerformanceInMeters).toBeCloseTo(expectedResult.securedLandingPerformance, 0);
  })

  test.each(inErrorCases)(`%p`, (description, request, expectedResult) => {
    const result = performanceComputer.compute(request);
    expect(result.takeOffPerformanceComputeResponse.outOfBoundComputationError).toBeTruthy();
    expect(result.landingPerformanceComputeResponse.outOfBoundComputationError).toBeTruthy();
  })
});
