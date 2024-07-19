import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ComputationFormOutput} from "./output/computation-form.output";


@Component({
  selector: 'computation-form',
  standalone: true,
  templateUrl: './computation-form.component.html',
  imports: [
    FormsModule,
  ],
  providers: []
})
export class ComputationFormComponent {

  @Output()
  readonly output: EventEmitter<ComputationFormOutput> = new EventEmitter<ComputationFormOutput>();

  massInKg: number = 800;
  temperatureInCelsius: number = 15;
  qnhInHpa: number = 1013;
  altitude: number = 357;
  isGrassRunway: boolean = false;
  isWetRunway: boolean = false;
  headwindInKnots: number = 0;

  constructor() {
  }

  public compute(): void {
    this.output.emit({
      altitude: this.altitude,
      qnhInHpa: this.qnhInHpa,
      temperatureInCelsius: this.temperatureInCelsius,
      massInKg: this.massInKg,
      runwayType: this.isGrassRunway ? "GRASS" : "HARD",
      runwayStatus: this.isWetRunway ? "WET" : "DRY",
      headWindInKnots: this.headwindInKnots
    })
  }
}
