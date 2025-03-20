import {render, screen} from "@testing-library/angular";
import {ComputationDetailsComponent} from "./computation-details.component";
import {testChosenUnit} from "../units/__test__/test-chose-unit";
import {testPerformanceComputeResponse} from "../../domain/__test__/test-performance-compute-response";

describe(`Computation Details Component`, () => {

  test(`Given a performance computation response,
  when displaying the computation details,
  then expected details are displayed`, async () => {
    // Given
    // When
    await render(ComputationDetailsComponent, {
      componentInputs: {
        performanceComputeResponse: testPerformanceComputeResponse,
        chosenUnit: testChosenUnit
      }
    })

    // Then
    expect(screen.getByText('850 kg')).toBeInTheDocument()
    expect(screen.getByText('2000 ft')).toBeInTheDocument()
    expect(screen.getByText('5.0 °C')).toBeInTheDocument()
    expect(screen.getByText('100 m')).toBeInTheDocument()
    expect(screen.getByText('1.2')).toBeInTheDocument()
    expect(screen.getByText('1.4')).toBeInTheDocument()
    expect(screen.getByText('1.5')).toBeInTheDocument()
    expect(screen.getByText('130 m')).toBeInTheDocument()
  })
})
