import {render, screen} from "@testing-library/angular";
import {ChooseUnitFormComponent} from "./choose-unit-form.component";
import {
  LocalStorageDefaultUnitRepository
} from "../../infrastructure/physical-quantity/local-storage-default-unit.repository";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {MockedLoginRepository} from "../../domain/user/__mock__/mocked-login.repository";
import {MockedUserRepository} from "../../domain/user/__mock__/mocked-user.repository";

const mockedLoginRepository = new MockedLoginRepository()
const mockedUserRepository = new MockedUserRepository()

describe(`ChooseUnitFormComponent`, () => {
  test(`When displaying the form for choosing units,
   then the form is displayed`, async () => {
    await render(ChooseUnitFormComponent, {
      componentProviders: [
        {
          provide: DefaultUnitRepository,
          useValue: new LocalStorageDefaultUnitRepository(mockedLoginRepository, mockedUserRepository)
        }
      ],
    })
    expect(await screen.findByLabelText('Mass unit')).toBeInTheDocument()
    expect(screen.getByText('Horizontal distance unit')).toBeInTheDocument()
    expect(screen.getByText('Atmospheric pressure unit')).toBeInTheDocument()
    expect(screen.getByText('Temperature unit')).toBeInTheDocument()
  })

  test(`Given a displayed form,
  when changing the mass unit,
  then the set of chosen units is emitted`, async () => {
    const outputSpy = jest.fn()
    await render(ChooseUnitFormComponent, {
      componentProviders: [
        {
          provide: DefaultUnitRepository,
          useValue: new LocalStorageDefaultUnitRepository(mockedLoginRepository, mockedUserRepository)
        }
      ],
      on: {
        output: outputSpy
      }
    })

    const massUnitToggle = await screen.findByLabelText('Mass unit')
    massUnitToggle.click();

    expect(outputSpy).toHaveBeenCalledTimes(1)
    expect(outputSpy).toHaveBeenCalledWith({
      massUnit: 'POUNDS',
      horizontalDistanceUnit: 'METERS',
      atmosphericPressureUnit: 'HPA',
      temperatureUnit: 'CELSIUS'
    })
  })
})
