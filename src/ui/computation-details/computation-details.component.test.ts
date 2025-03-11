import {render, screen} from "@testing-library/angular";
import {ComputationData, PerformanceComputeResponse} from "../../domain/performance-compute-response";
import {Mass} from "../../domain/mass";
import {ComputationDetailsComponent} from "./computation-details.component";

describe(`Computation Details Component`, () => {

  test(`Given a performance computation response,
  when displaying the computation details,
  then expected details are displayed`, async () => {
    // Given
    const performanceComputeResponse: PerformanceComputeResponse = new PerformanceComputeResponse(
      100,
      130,
      false,
      new ComputationData(
        new Map([
          ["DRY_HARD", 1.2],
          ["SECURITY", 1.4],
          ["WIND", 1.5],
        ]),
        2000,
        5,
        undefined,
        Mass.forValueAndUnit(850, 'KILOGRAMS')
      )
    )

    // When
    await render(ComputationDetailsComponent, {
      componentInputs: {
        performanceComputeResponse: performanceComputeResponse
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
