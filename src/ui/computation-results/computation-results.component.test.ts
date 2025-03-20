import {render, screen} from "@testing-library/angular";
import {testPerformanceComputeResponse} from "../../domain/__test__/test-performance-compute-response";
import {testChosenUnit} from "../units/__test__/test-chose-unit";
import {ComputationResultsComponent} from "./computation-results.component";
import {ComputationData, PerformanceComputeResponse} from "../../domain/performance-compute-response";
import {TemperatureDifference} from "../../domain/physical-quantity/temperature";
import {Mass} from "../../domain/physical-quantity/mass";

describe(`Computation results component`, () => {

  test(`Given feet as horizontal distance unit and a performance compute response,
  When rendering the component,
  then the component displayed the correct values`, async () => {

    await render(ComputationResultsComponent, {
      componentInputs: {
        type: "TAKE_OFF",
        chosenUnit: {
          ...testChosenUnit,
          horizontalDistanceUnit: 'FEET'
        },
        performanceComputeResponse: testPerformanceComputeResponse
      },
    })

    expect(screen.getByText('Take-off')).toBeInTheDocument()
    expect(screen.getByText('427 ft')).toBeInTheDocument()
    expect(screen.getByText('328 ft')).toBeInTheDocument()
  })

  test(`Given meters as horizontal distance unit and a performance compute response,)
  When rendering the component,
  then the component displayed the correct values`, async () => {

    await render(ComputationResultsComponent, {
      componentInputs: {
        type: "LANDING",
        chosenUnit: {
          ...testChosenUnit,
          horizontalDistanceUnit: 'METERS'
        },
        performanceComputeResponse: testPerformanceComputeResponse
      },
    })

    expect(screen.getByText('Landing')).toBeInTheDocument()
    expect(screen.getByText('130 m')).toBeInTheDocument()
    expect(screen.getByText('100 m')).toBeInTheDocument()
  })

  test(`Given out of bound in computation response,
  When rendering the component,
  then the component displays the out of bound error`, async () => {
    await render(ComputationResultsComponent, {
      componentInputs: {
        type: "LANDING",
        chosenUnit: {
          ...testChosenUnit,
          horizontalDistanceUnit: 'METERS'
        },
        performanceComputeResponse: new PerformanceComputeResponse(
          undefined,
          undefined,
          true,
          new ComputationData(
            new Map([
              ["DRY_HARD", 1.2],
              ["SECURITY", 1.4],
              ["WIND", 1.5],
            ]),
            2000,
            TemperatureDifference.forValueAndUnit(5, 'CELSIUS'),
            undefined,
            Mass.forValueAndUnit(850, 'KILOGRAMS')
          )
        )
      },
    })

    expect(screen.getByText('Landing')).toBeInTheDocument()
    expect(screen.getByText('Out of bound')).toBeInTheDocument()
  })
})
