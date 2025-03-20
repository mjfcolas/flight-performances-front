import {render, screen} from "@testing-library/angular";
import {ChooseUnitFormComponent} from "./choose-unit-form.component";
import {
  LocalStorageDefaultUnitRepository
} from "../../infrastructure/physical-quantity/local-storage-default-unit.repository";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";

describe(`ChooseUnitFormComponent`, () => {
  test(`When displaying the form for chosing units,
   then the form is displayed and a first set of unit is emitted`, async () => {
    const outputSpy = jest.fn()

    await render(ChooseUnitFormComponent, {
      componentProviders: [
        {
          provide: DefaultUnitRepository,
          useValue: new LocalStorageDefaultUnitRepository()
        }
      ],
      on: {
        output: outputSpy
      }
    })
    expect(screen.getByLabelText('Mass unit')).toBeInTheDocument()
    expect(screen.getByText('Horizontal distance unit')).toBeInTheDocument()
    expect(screen.getByText('Atmospheric pressure unit')).toBeInTheDocument()
    expect(screen.getByText('Temperature unit')).toBeInTheDocument()

    expect(outputSpy).toHaveBeenCalledTimes(1)
    expect(outputSpy).toHaveBeenCalledWith({
      massUnit: 'KILOGRAMS',
      horizontalDistanceUnit: 'METERS',
      atmosphericPressureUnit: 'HPA',
      temperatureUnit: 'CELSIUS'
    })
  })

  test(`Given a displayed form,
  when changing the mass unit,
  then the set of chosen units is emitted`, async () => {
    const outputSpy = jest.fn()
    await render(ChooseUnitFormComponent, {
      componentProviders: [
        {
          provide: DefaultUnitRepository,
          useValue: new LocalStorageDefaultUnitRepository()
        }
      ],
      on: {
        output: outputSpy
      }
    })

    const massUnitToggle = screen.getByLabelText('Mass unit')
    massUnitToggle.click();

    expect(outputSpy).toHaveBeenCalledTimes(2)
    expect(outputSpy).toHaveBeenCalledWith({
      massUnit: 'POUNDS',
      horizontalDistanceUnit: 'METERS',
      atmosphericPressureUnit: 'HPA',
      temperatureUnit: 'CELSIUS'
    })
  })
})
