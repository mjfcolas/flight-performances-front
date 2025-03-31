import {PlanePerformances, RunwayFactors, WindCoefficientComputationData} from "./plane";

describe(`Plane`, () => {
  const runwayFactors = new RunwayFactors(1, 1, 1, 1);
  const emptyCoefficients = WindCoefficientComputationData.fromStepCoefficients([]);
  const validCoefficients = WindCoefficientComputationData.fromStepCoefficients([
    {
      step: 0,
      coefficient: 1
    }
  ])

  test(`Given an empty array of take off wind coefficients,
  when creating plane performances,
  then an error is thrown`, () => {
    expect(() => {
      new PlanePerformances(
        'ISA',
        [],
        [],
        runwayFactors,
        runwayFactors,
        emptyCoefficients,
        validCoefficients
      );
    }).toThrowError(new Error("TAKE_OFF_WIND_COEFFICIENTS_EMPTY"));
  })

  test(`Given an empty array of landing wind coefficients,
  when creating plane performances,
  then an error is thrown`, () => {
    expect(() => {
      new PlanePerformances(
        'ISA',
        [],
        [],
        runwayFactors,
        runwayFactors,
        validCoefficients,
        emptyCoefficients
      );
    }).toThrowError(new Error("LANDING_WIND_COEFFICIENTS_EMPTY"));
  })

  test(`Given valid data,
  when creating plane performances,
  then the object is created successfully`, () => {
    const performances = new PlanePerformances(
      'ISA',
      [],
      [],
      runwayFactors,
      runwayFactors,
      validCoefficients,
      validCoefficients
    );

    expect(performances).toBeInstanceOf(PlanePerformances);
  })

})
