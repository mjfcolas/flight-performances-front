import {render, screen} from "@testing-library/angular";
import {PerformanceComputerComponent} from "./performance-computer.component";
import {LoginRepository} from "../../domain/user/login.repository";
import {MockedLoginRepository} from "../../domain/user/__mock__/mocked-login.repository";
import {PlaneRepository} from "../../domain/plane.repository";
import {MockedPlaneRepository} from "../../domain/__mock__/mocked-plane-repository";
import {PerformanceComputer} from "../../domain/performance-computer";
import {fgnna} from "../../infrastructure/planes/local-plane.repository";
import {ActivatedRoute} from "@angular/router";
import {of} from "rxjs";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {MockedDefaultUnitRepository} from "../../domain/physical-quantity/__mock__/mocked-default-unit.repository";
import userEvent from '@testing-library/user-event'
import {testPerformanceComputeResponse} from "../../domain/__test__/test-performance-compute-response";
import {
  TakeOffAndLandingPerformanceComputeResponse
} from "../../domain/take-off-and-landing-performance-compute.response";


const performanceComputerMock = {
  compute: jest.fn()
}

describe(`Performance computer component`, () => {

  beforeEach(async () => {
    jest.clearAllMocks()

    const planeRepositoryMock = new MockedPlaneRepository()
    planeRepositoryMock.isFavorite.mockReturnValue(of(true))

    await render(PerformanceComputerComponent,
      {
        providers:
          [
            {
              provide: PerformanceComputer,
              useValue: performanceComputerMock
            },
            {
              provide: PlaneRepository,
              useValue: planeRepositoryMock
            },
            {
              provide: LoginRepository,
              useValue: new MockedLoginRepository()
            },
            {
              provide: DefaultUnitRepository,
              useValue: new MockedDefaultUnitRepository()
            },
            {
              provide: ActivatedRoute,
              useValue: {
                snapshot: {
                  data: {
                    plane: fgnna
                  }
                }
              }
            }
          ]
      })
  })

  test(`Given needed repositories and performance computer,
  when rendering performance computer component,
  then component is rendered`, async () => {
    expect(screen.getByText("F-GNNA")).toBeInTheDocument()
  })

  test(`Given a rendered component,
  when clicking on the button to configure units,
  then the unit panel is displayed`, async () => {
    await userEvent.click(screen.getByText("kg ⇄ lb"))
    expect(screen.getByText("Mass unit")).toBeInTheDocument()
  })

  test(`Given a rendered component,
  when clicking on the calculate button,
  then computation results are displayed`, async () => {
    performanceComputerMock.compute.mockReturnValue(new TakeOffAndLandingPerformanceComputeResponse(
      testPerformanceComputeResponse,
      testPerformanceComputeResponse
    ))

    await userEvent.click(screen.getByText('Calculate'))

    expect(screen.getByText("Landing")).toBeInTheDocument()
  })

  test(`Given a rendered component,
  when clicking on the detailed button,
  then details are displayed`, async () => {
    performanceComputerMock.compute.mockReturnValue(new TakeOffAndLandingPerformanceComputeResponse(
      testPerformanceComputeResponse,
      testPerformanceComputeResponse
    ))
    await userEvent.click(screen.getByText('Detailed'))

    expect(screen.getByText("Performances")).toBeInTheDocument()
  })
})
