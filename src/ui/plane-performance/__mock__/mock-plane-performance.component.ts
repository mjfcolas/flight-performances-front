import {Component, EventEmitter, Input, Output} from "@angular/core";
import {UiMode} from "../../ui-mode";
import {PlanePerformancesViewModel} from "../view-models/plane-performances-view.model";
@Component({
  selector: 'plane-performance',
  standalone: true,
  template: '<p>MockPlanePerformanceComponent</p>'
})
export class MockPlanePerformanceComponent {

  public static emitter: EventEmitter<PlanePerformancesViewModel> = new EventEmitter<PlanePerformancesViewModel>();

  @Input()
  mode: UiMode = 'READ_ONLY';
  @Input()
  securityFactor: number | null = null;
  @Input()
  performances: PlanePerformancesViewModel = PlanePerformancesViewModel.empty();
  @Output()
  emittedPerformances: EventEmitter<PlanePerformancesViewModel> = MockPlanePerformanceComponent.emitter;

}
