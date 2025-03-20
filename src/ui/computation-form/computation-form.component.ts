import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ComputationFormOutput} from "./output/computation-form.output";
import {Mass} from "../../domain/physical-quantity/mass";
import {Temperature} from "../../domain/physical-quantity/temperature";
import {AtmosphericPressure} from "../../domain/physical-quantity/atmospheric-pressure";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {DisplayMassUnitPipe} from "../units/display-mass-unit.pipe";
import {DisplayDistanceUnitPipe} from "../units/display-distance-unit.pipe";
import {DisplayAtmosphericPressureUnitPipe} from "../units/display-atmospheric-pressure-unit.pipe";
import {DisplayTemperatureUnitPipe} from "../units/display-temperature-unit.pipe";


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

  mass: number = 800;
  temperature: number = 15;
  qnh: number = 1013;
  altitude: number = 357;
  isGrassRunway: boolean = false;
  isWetRunway: boolean = false;
  headwindInKnots: number = 0;

  constructor() {
  }

  public compute(): void {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.output.emit({
      altitude: this.altitude,
      qnh: AtmosphericPressure.forValueAndUnit(this.qnh, this.chosenUnit.atmosphericPressureUnit),
      temperature: Temperature.forValueAndUnit(this.temperature, this.chosenUnit.temperatureUnit),
      mass: Mass.forValueAndUnit(this.mass, this.chosenUnit.massUnit),
      runwayType: this.isGrassRunway ? "GRASS" : "HARD",
      runwayStatus: this.isWetRunway ? "WET" : "DRY",
      headWindInKnots: this.headwindInKnots
    })
  }
}
