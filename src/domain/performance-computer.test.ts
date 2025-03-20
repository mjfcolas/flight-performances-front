import {PerformanceComputer} from "./performance-computer";
import {PressureAltitude} from "./physical-quantity/pressure-altitude";
import {PerformanceComputeRequest} from "./performance-compute.request";
import {Temperature} from "./physical-quantity/temperature";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {validAbsoluteTemperaturePlanePerformances, validDiffWithISAPlanePerformances} from "./__test__/test-plane";
import {Mass} from "./physical-quantity/mass";
import {AtmosphericPressure} from "./physical-quantity/atmospheric-pressure";

describe(`PerformanceComputer`, () => {

  const performanceComputer = new PerformanceComputer(
    new TrilinearInterpolationProvider()
  );

  const A_NOMINAL_ATMOSPHERIC_PRESSURE = AtmosphericPressure.forValueAndUnit(1013, 'HPA');
  const A_NOMINAL_ELEVATION = PressureAltitude.fromAltitudeInFeetAndQnh(357, A_NOMINAL_ATMOSPHERIC_PRESSURE);
  const A_NOMINAL_TEMPERATURE = Temperature.forValueAndUnit(15, 'CELSIUS');
  const A_NOMINAL_MASS = Mass.forValueAndUnit(900, 'KILOGRAMS')

  const nominalTestCase = [
    "Normally loaded plane at nominal temperature and pressure on a dry hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      A_NOMINAL_MASS,
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
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      A_NOMINAL_MASS,
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
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      A_NOMINAL_MASS,
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

  const underloadedPlaneTestCase = [
    "Under loaded plane at nominal temperature and pressure on a dry hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      Mass.forValueAndUnit(750, 'KILOGRAMS'),
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
      validDiffWithISAPlanePerformances,
      PressureAltitude.fromAltitudeInFeetAndQnh(0, AtmosphericPressure.forValueAndUnit(1020, 'HPA')),
      A_NOMINAL_TEMPERATURE,
      A_NOMINAL_MASS,
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

  const absoluteTemperatureTestCase = [
    "Performances based on absolute temperature at sea level and standard pressure for a plane loaded under minimal data",
    new PerformanceComputeRequest(
      validAbsoluteTemperaturePlanePerformances,
      PressureAltitude.fromAltitudeInFeetAndQnh(0, A_NOMINAL_ATMOSPHERIC_PRESSURE),
      Temperature.forValueAndUnit(10, 'CELSIUS'),
      Mass.forValueAndUnit(500, 'KILOGRAMS'),
      "DRY",
      "HARD",
      0
    ), {
      rawTakeOffPerformance: 395,
      securedTakeOffPerformance: 474,
      rawLandingPerformance: 472.5,
      securedLandingPerformance: 567
    }
  ]

  const wetGrassTestCase = [
    "Performances with nominal meteorological conditions on a wet grass runway",
    new PerformanceComputeRequest(
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      A_NOMINAL_MASS,
      "WET",
      "GRASS",
      0
    ),
    {
      rawTakeOffPerformance: 443,
      securedTakeOffPerformance: 612,
      rawLandingPerformance: 486,
      securedLandingPerformance: 671
    }
  ]


  const overloadedPlaneTestCase = [
    "Over loaded plane at nominal temperature and pressure on a dry hard runway at nominal elevation without wind",
    new PerformanceComputeRequest(
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      Mass.forValueAndUnit(1200, 'KILOGRAMS'),
      "DRY",
      "HARD",
      0
    )
  ]


  const tooMuchTailWindTestCase = [
    "Out of bound tail wind with nominal other parameters",
    new PerformanceComputeRequest(
      validDiffWithISAPlanePerformances,
      A_NOMINAL_ELEVATION,
      A_NOMINAL_TEMPERATURE,
      A_NOMINAL_MASS,
      "DRY",
      "HARD",
      -50
    )
  ]

  const completedCases: any[] = [
    nominalTestCase,
    nominalOnGrassRunwayTestCase,
    nominalOnWetRunwayTestCase,
    underloadedPlaneTestCase,
    seaLevelWithHighAtmosphericPressureTestCase,
    absoluteTemperatureTestCase,
    wetGrassTestCase
  ]

  const inErrorCases: any[] = [
    overloadedPlaneTestCase,
    tooMuchTailWindTestCase
  ]

  test.each(completedCases)(`%p`, (description, request, expectedResult) => {
    const result = performanceComputer.compute(request);
    expect(result.takeOffPerformanceComputeResponse.rawPerformance?.valueIn('METERS')).toBeCloseTo(expectedResult.rawTakeOffPerformance, 0);
    expect(result.takeOffPerformanceComputeResponse.securedPerformance?.valueIn('METERS')).toBeCloseTo(expectedResult.securedTakeOffPerformance, 0);
    expect(result.landingPerformanceComputeResponse.rawPerformance?.valueIn('METERS')).toBeCloseTo(expectedResult.rawLandingPerformance, 0);
    expect(result.landingPerformanceComputeResponse.securedPerformance?.valueIn('METERS')).toBeCloseTo(expectedResult.securedLandingPerformance, 0);
  })

  test.each(inErrorCases)(`%p`, (description, request) => {
    const result = performanceComputer.compute(request);
    expect(result.takeOffPerformanceComputeResponse.outOfBoundComputationError).toBeTruthy();
    expect(result.landingPerformanceComputeResponse.outOfBoundComputationError).toBeTruthy();
  })
});
