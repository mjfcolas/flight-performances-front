import {ChosenUnit} from "./chosen-unit";
import {testChosenUnit} from "./__test__/test-chose-unit";
import {Mass} from "../../domain/physical-quantity/mass";
import {Distance} from "../../domain/physical-quantity/distance";
import {Temperature} from "../../domain/physical-quantity/temperature";
import {Component} from "@angular/core";
import {render, screen} from "@testing-library/angular";
import {DisplayMassPipe} from "./display-mass.pipe";
import {DisplayDistancePipe} from "./display-distance.pipe";
import {DisplayTemperaturePipe} from "./display-temperature.pipe";
import {DisplayMassUnitPipe} from "./display-mass-unit.pipe";
import {DisplayAtmosphericPressureUnitPipe} from "./display-atmospheric-pressure-unit.pipe";
import {DisplayDistanceUnitPipe} from "./display-distance-unit.pipe";
import {DisplayTemperatureUnitPipe} from "./display-temperature-unit.pipe";

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <div>{{ mass | displayMass: chosenUnit.massUnit }}</div>
    <div>{{ distance | displayDistance: chosenUnit.horizontalDistanceUnit }}</div>
    <div>{{ temperature | displayTemperature: chosenUnit.temperatureUnit }}</div>

    <div>{{ chosenUnit.massUnit | displayMassUnit }}</div>
    <div>{{ chosenUnit.atmosphericPressureUnit | displayAtmosphericPressureUnit }}</div>
    <div>{{ chosenUnit.horizontalDistanceUnit | displayDistanceUnit }}</div>
    <div>{{ chosenUnit.temperatureUnit | displayTemperatureUnit }}</div>
  `,
  imports: [
    DisplayMassPipe,
    DisplayDistancePipe,
    DisplayTemperaturePipe,
    DisplayMassUnitPipe,
    DisplayAtmosphericPressureUnitPipe,
    DisplayDistanceUnitPipe,
    DisplayTemperatureUnitPipe
  ]
})
export class TestComponent {
  mass: Mass = Mass.forValueAndUnit(1500, "KILOGRAMS");
  distance: Distance = Distance.forValueAndUnit(1500, "METERS");
  temperature: Temperature = Temperature.forValueAndUnit(25.56, "CELSIUS");


  chosenUnit: ChosenUnit = testChosenUnit
}

describe(`Display quantities pipes`, () => {

  test(`Expected values are displayed`, async () => {
    await render(TestComponent);

    expect(screen.getByText('1,500 kg')).toBeInTheDocument();
    expect(screen.getByText('1,500 m')).toBeInTheDocument();
    expect(screen.getByText('25.6 °C')).toBeInTheDocument();
    expect(screen.getByText('kg')).toBeInTheDocument();
    expect(screen.getByText('hPa')).toBeInTheDocument();
    expect(screen.getByText('m')).toBeInTheDocument();
    expect(screen.getByText('°C')).toBeInTheDocument();
  })
})
