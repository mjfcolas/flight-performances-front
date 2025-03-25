import {render, screen} from "@testing-library/angular";
import {ComputationFormComponent} from "./computation-form.component";
import {testChosenUnit} from "../units/__test__/test-chose-unit";
import userEvent from '@testing-library/user-event'
import {Mass} from "../../domain/physical-quantity/mass";
import {Temperature} from "../../domain/physical-quantity/temperature";
import {AtmosphericPressure} from "../../domain/physical-quantity/atmospheric-pressure";

describe(`Computation Form`, () => {

  test(`Given chosen units,
  When rendering the form,
  then the form is displayed`, async () => {
    await render(ComputationFormComponent, {
      componentInputs: {
        chosenUnit: testChosenUnit
      },
    })

    expect(screen.getByLabelText('Mass')).toBeInTheDocument()
    expect(screen.getByLabelText('Temperature')).toBeInTheDocument()
    expect(screen.getByLabelText('QNH')).toBeInTheDocument()
    expect(screen.getByLabelText('Terrain altitude')).toBeInTheDocument()
    expect(screen.getByLabelText('Headwind')).toBeInTheDocument()
    expect(screen.getByLabelText('Grass runway ?')).toBeInTheDocument()
    expect(screen.getByLabelText('Wet runway ?')).toBeInTheDocument()

    expect(screen.getByText('kg')).toBeInTheDocument()
    expect(screen.getByText('°C')).toBeInTheDocument()
    expect(screen.getByText('hPa')).toBeInTheDocument()
    expect(screen.getByText('ft')).toBeInTheDocument()
    expect(screen.getByText('kt')).toBeInTheDocument()

  })

  test(`Given a rendered form,
  when changing chosen units,
  then the form is displayed with the new units`, async () => {
    const {fixture} = await render(ComputationFormComponent, {
      componentInputs: {
        chosenUnit: testChosenUnit
      },
    })

    fixture.componentInstance.chosenUnit = {
      massUnit: 'POUNDS',
      horizontalDistanceUnit: 'FEET',
      atmosphericPressureUnit: 'INHG',
      temperatureUnit: 'FAHRENHEIT'
    }
    fixture.detectChanges()

    expect(screen.getByText('lb')).toBeInTheDocument()
    expect(screen.getByText('°F')).toBeInTheDocument()
    expect(screen.getByText('inHg')).toBeInTheDocument()
    expect(screen.getByText('ft')).toBeInTheDocument()
    expect(screen.getByText('kt')).toBeInTheDocument()

  })

  test(`Given a rendered form,
  when changing chosen units,
  then the form is displayed with the values in the new units`, async () => {
    const {fixture} = await render(ComputationFormComponent, {
      componentInputs: {
        chosenUnit: testChosenUnit
      },
    })

    fixture.componentInstance.chosenUnit = {
      massUnit: 'POUNDS',
      horizontalDistanceUnit: 'FEET',
      atmosphericPressureUnit: 'INHG',
      temperatureUnit: 'FAHRENHEIT'
    }
    fixture.detectChanges()

    expect(await screen.findByDisplayValue('1764')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('59')).toBeInTheDocument()
    expect(await screen.findByDisplayValue('29.91')).toBeInTheDocument()

  })

  test(`Given a rendered form,
  when editing a value and then calculating,
  then the output is emitted`, async () => {
    const outputSpy = jest.fn()

    await render(ComputationFormComponent, {
      componentInputs: {
        chosenUnit: testChosenUnit
      },
      on: {
        output: outputSpy
      }
    })

    await clearAndType('Mass', '1000')
    await clearAndType('Temperature', '20')
    await clearAndType('QNH', '1020')
    await clearAndType('Terrain altitude', '500')
    await clearAndType('Headwind', '10')
    await userEvent.click(screen.getByLabelText('Grass runway ?'))
    await userEvent.click(screen.getByLabelText('Wet runway ?'))

    await userEvent.click(screen.getByRole('button', {name: 'Calculate'}))

    expect(outputSpy).toHaveBeenCalledTimes(1)
    expect(outputSpy).toHaveBeenCalledWith({
      mass: Mass.forValueAndUnit(1000, 'KILOGRAMS'),
      temperature: Temperature.forValueAndUnit(20, 'CELSIUS'),
      qnh: AtmosphericPressure.forValueAndUnit(1020, 'HPA'),
      altitude: 500,
      headWindInKnots: 10,
      runwayType: "GRASS",
      runwayStatus: "WET"
    })
  })

  async function clearAndType(labelText: string, value: string) {
    const input = screen.getByLabelText(labelText)
    await userEvent.clear(input)
    await userEvent.type(input, value)
  }
})
