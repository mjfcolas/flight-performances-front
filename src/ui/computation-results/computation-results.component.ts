import {Component, Input} from '@angular/core';
import {faCircleExclamation, faPlaneArrival, faPlaneDeparture, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PerformanceComputeResponse} from "../../domain/performance-compute-response";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {DisplayDistancePipe} from "../units/display-distance.pipe";


@Component({
  selector: 'computation-results',
  standalone: true,
  templateUrl: './computation-results.component.html',
  imports: [
    DisplayDistancePipe,
    FaIconComponent,
  ],
  providers: [],
})
export class ComputationResultsComponent {

  @Input()
  set type(type: "TAKE_OFF" | "LANDING") {
    if (type === "TAKE_OFF") {
      this._title = "Take-off"
      this._icon = faPlaneDeparture
    } else {
      this._title = "Landing"
      this._icon = faPlaneArrival
    }
  }

  @Input()
  chosenUnit: ChosenUnit | undefined;

  @Input()
  performanceComputeResponse: PerformanceComputeResponse | null = null;

  protected _title: string | undefined
  protected _icon: IconDefinition | undefined

  protected readonly faCircleExclamation = faCircleExclamation;
}
