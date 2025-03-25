import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ComputationFormOutput} from "./output/computation-form.output";
import {Mass} from "../../domain/physical-quantity/mass";
import {Temperature} from "../../domain/physical-quantity/temperature";
import {AtmosphericPressure} from "../../domain/physical-quantity/atmospheric-pressure";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {DisplayMassUnitPipe} from "../units/display-mass-unit.pipe";
import {DisplayAtmosphericPressureUnitPipe} from "../units/display-atmospheric-pressure-unit.pipe";
import {DisplayTemperatureUnitPipe} from "../units/display-temperature-unit.pipe";
import {roundAtmosphericPressure, roundMass, roundTemperature} from "../units/format-physical-value";


@Component({
  selector: 'computation-form',
  standalone: true,
  templateUrl: './computation-form.component.html',
  imports: [
    FormsModule,
    DisplayMassUnitPipe,
    DisplayAtmosphericPressureUnitPipe,
    DisplayTemperatureUnitPipe,
  ],
  providers: []
})
export class ComputationFormComponent {

  @Output()
  readonly output: EventEmitter<ComputationFormOutput> = new EventEmitter<ComputationFormOutput>();

  @Input()
  chosenUnit: ChosenUnit | undefined;

  mass: Mass = Mass.forValueAndUnit(800, 'KILOGRAMS');
  temperature: Temperature = Temperature.forValueAndUnit(15, 'CELSIUS');
  qnh: AtmosphericPressure = AtmosphericPressure.forValueAndUnit(1013, 'HPA');
  altitude: number = 357;
  isGrassRunway: boolean = false;
  isWetRunway: boolean = false;
  headwindInKnots: number = 0;

  constructor() {
  }

  setNewMass(mass: number): void {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.mass = Mass.forValueAndUnit(mass, this.chosenUnit.massUnit);
  }

  setNewTemperature(temperature: number): void {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.temperature = Temperature.forValueAndUnit(temperature, this.chosenUnit.temperatureUnit);
  }

  setNewQnh(qnh: number): void {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.qnh = AtmosphericPressure.forValueAndUnit(qnh, this.chosenUnit.atmosphericPressureUnit);
  }

  public compute(): void {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.output.emit({
      altitude: this.altitude,
      qnh: this.qnh,
      temperature: this.temperature,
      mass: this.mass,
      runwayType: this.isGrassRunway ? "GRASS" : "HARD",
      runwayStatus: this.isWetRunway ? "WET" : "DRY",
      headWindInKnots: this.headwindInKnots
    })
  }

  protected readonly roundMass = roundMass;
  protected readonly roundTemperature = roundTemperature;
  protected readonly roundAtmosphericPressure = roundAtmosphericPressure;
}
