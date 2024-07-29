import {ComputationFactorsComponent} from "./computation-factors.component";
import {fireEvent, render, screen} from "@testing-library/angular";
import {RunwayFactorsViewModel} from "../view-models/plane-performances-view.model";
import {StepCoefficient} from "../../../domain/plane";

describe('ComputationFactorsComponent', () => {

  describe('Read only mode', () => {

    const securityCoefficient = 1.2;
    const takeOffRunwayFactors: RunwayFactorsViewModel = new RunwayFactorsViewModel({
      grass: 1.1,
      grassWet: 1.2,
      hard: 1.3,
      hardWet: 1.4,
    })

    const landingRunwayFactors: RunwayFactorsViewModel = new RunwayFactorsViewModel({
      grass: 2.1,
      grassWet: 2.2,
      hard: 2.3,
      hardWet: 2.4,
    })

    const takeOffWindCoefficients: StepCoefficient[] = [
      {step: -2, coefficient: 1.1},
      {step: 0, coefficient: 1},
      {step: 5, coefficient: 0.9},
      {step: 10, coefficient: 0.8},
      {step: 15, coefficient: 0.7},
    ]

    const landingWindCoefficients: StepCoefficient[] = [
      {step: -3, coefficient: 2.1},
      {step: 0, coefficient: 2},
      {step: 4, coefficient: 1.9},
      {step: 8, coefficient: 1.8},
      {step: 12, coefficient: 1.7},
    ]

    test(`Given a security coefficient,
    when rendering the computation factors in read only mode,
    then the security coefficient is displayed`, async () => {
      await render(ComputationFactorsComponent, {
        componentInputs: {
          securityFactor: securityCoefficient,
          mode: 'READ_ONLY'
        }
      })

      expect(screen.getByText(`Security coefficient`)).toBeInTheDocument();
      expect(screen.getByText(`${securityCoefficient}`)).toBeInTheDocument();
    });

    test(`Given runway factors,
    when rendering the computation factors in read only mode,
    then factors are displayed`, async () => {
      await render(ComputationFactorsComponent, {
        componentInputs: {
          takeOffRunwayFactors: takeOffRunwayFactors,
          landingRunwayFactors: landingRunwayFactors,
          mode: 'READ_ONLY'
        }
      })

      expect(screen.getByText(`${takeOffRunwayFactors.hardWet}`)).toBeInTheDocument();
      expect(screen.getByText(`${landingRunwayFactors.hardWet}`)).toBeInTheDocument();
    });

    test(`Given wind coefficients,
    when rendering the computation factors in read only mode,
    then wind coefficients are displayed`, async () => {
      await render(ComputationFactorsComponent, {
        componentInputs: {
          takeOffWindCoefficients: takeOffWindCoefficients,
          landingWindCoefficients: landingWindCoefficients,
          mode: 'READ_ONLY'
        }
      })

      expect(screen.getByText(`2 kt → 0 kt`)).toBeInTheDocument();
      expect(screen.getByText(`12+ kt`)).toBeInTheDocument
      expect(screen.getByText(`${takeOffWindCoefficients[0].coefficient}`)).toBeInTheDocument();
      expect(screen.getByText(`${landingWindCoefficients[0].coefficient}`)).toBeInTheDocument();
    })
  });

  describe('Editable mode', () => {

    test(`Given a rendered computation factors component in editable mode,
    when a landing runway coefficient is entered,
    then the landing runway coefficients are emitted`, async () => {
      const emittedLandingRunwayFactors = jest.fn();
      await render(ComputationFactorsComponent, {
        componentInputs: {
          mode: 'EDIT',
        },
        on: {
          emittedLandingRunwayFactors: emittedLandingRunwayFactors
        }
      })

      const landingCoefficientInput = screen.getByLabelText('Hard wet landing coefficient input');
      fireEvent.input(landingCoefficientInput, {
        target: {
          value: 1.2
        }
      });
      expect(emittedLandingRunwayFactors).toHaveBeenCalledWith(new RunwayFactorsViewModel({
        hardWet: 1.2,
        grassWet: null,
        hard: null,
        grass: null
      }));

    });

    test(`Given a rendered computation factors component in editable mode,
    when a take off runway coefficient is entered,
    then the take off runway coefficients are emitted`, async () => {
      const emittedTakeOffRunwayFactors = jest.fn();
      await render(ComputationFactorsComponent, {
        componentInputs: {
          mode: 'EDIT',
        }, on: {
          emittedTakeOffRunwayFactors: emittedTakeOffRunwayFactors
        }
      })

      const takeOffCoefficientInput = screen.getByLabelText('Hard wet take off coefficient input');
      fireEvent.input(takeOffCoefficientInput, {
        target: {
          value: 1.2
        }
      });
      expect(emittedTakeOffRunwayFactors).toHaveBeenCalledWith(new RunwayFactorsViewModel({
        hardWet: 1.2,
        hard: null,
        grass: null,
        grassWet: null
      }));
    });
  });

});
