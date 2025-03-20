import {render, screen} from "@testing-library/angular";
import {UnitToggleComponent} from "./unit-toggle.component";

describe('UnitToggleComponent', () => {

  const aFirstLabel = 'First Label';
  const aSecondLabel = 'Second Label';
  const aFirstUnitValue = 'V1';
  const aSecondUnitValue = 'V2';
  const aChosenUnit = 'V2';

  test(`Given units with their labels and a chosen unit,
  when displaying the unit toggle,
  then labels are visible`, async () => {

    await render(UnitToggleComponent, {
      componentInputs: {
        firstUnitLabel: aFirstLabel,
        secondUnitLabel: aSecondLabel,
        firstUnitValue: aFirstUnitValue,
        secondUnitValue: aSecondUnitValue,
        chosenUnit: aChosenUnit
      }
    })
    expect(screen.getByText(aFirstLabel)).toBeInTheDocument()
    expect(screen.getByText(aSecondLabel)).toBeInTheDocument()
  })

  test(`Given units with their labels and a chosen unit,
  when toggling,
  then the unit that was not chosen is emitted`, async () => {
    const outputSpy = jest.fn();

    await render(UnitToggleComponent, {
      componentInputs: {
        firstUnitLabel: aFirstLabel,
        secondUnitLabel: aSecondLabel,
        firstUnitValue: aFirstUnitValue,
        secondUnitValue: aSecondUnitValue,
        chosenUnit: aChosenUnit,
      },
      on: {
        output: outputSpy
      }
    })

    screen.getByRole('checkbox').click();
    expect(outputSpy).toHaveBeenCalledTimes(1);
    expect(outputSpy).toHaveBeenCalledWith(aFirstUnitValue);

  });
})
