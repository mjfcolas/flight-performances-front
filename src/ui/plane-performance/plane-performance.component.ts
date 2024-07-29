import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ComputationFactorsComponent} from "./computation-factors/computation-factors.component";
import {PerformanceTableComponent} from "./performance-table/performance-table.component";
import {
  PerformanceDataPointViewModel,
  PlanePerformancesViewModel,
  RunwayFactorsViewModel
} from "./view-models/plane-performances-view.model";
import {UiMode} from "../ui-mode";
import {StepCoefficient} from "../../domain/plane";


@Component({
  selector: 'plane-performance',
  standalone: true,
  templateUrl: './plane-performance.component.html',
  imports: [
    ComputationFactorsComponent,
    PerformanceTableComponent
  ],
  providers: []
})
export class PlanePerformanceComponent {

  @Input()
  mode: UiMode = 'READ_ONLY';

  @Input()
  securityFactor: number | null = null;

  @Input()
  performances: PlanePerformancesViewModel = PlanePerformancesViewModel.empty();

  @Output()
  emittedPerformances: EventEmitter<PlanePerformancesViewModel> = new EventEmitter<PlanePerformancesViewModel>();

  newTakeOffDataPoints(takeOffDataPoints: PerformanceDataPointViewModel[]) {
    this.performances = this.performances.copyWith({takeOffDataPoints: takeOffDataPoints})
    this.emittedPerformances.emit(this.performances);
  }

  newLandingDataPoints(landingDataPoints: PerformanceDataPointViewModel[]) {
    this.performances = this.performances.copyWith({landingDataPoints: landingDataPoints})
    this.emittedPerformances.emit(this.performances);
  }

  newLandingRunwayFactors(runwayFactors: RunwayFactorsViewModel) {
    this.performances = this.performances.copyWith({landingRunwayFactors: runwayFactors})
    this.emittedPerformances.emit(this.performances);
  }

  newTakeOffRunwayFactors(runwayFactors: RunwayFactorsViewModel) {
    this.performances = this.performances.copyWith({takeOffRunwayFactors: runwayFactors})
    this.emittedPerformances.emit(this.performances);
  }

  newTakeOffWindCoefficients(coefficients: StepCoefficient[]) {
    this.performances = this.performances.copyWith({takeOffCoefficientsComputationData: coefficients})
    this.emittedPerformances.emit(this.performances);
  }

  newLandingWindCoefficients(coefficients: StepCoefficient[]) {
    this.performances = this.performances.copyWith({landingCoefficientsComputationData: coefficients})
    this.emittedPerformances.emit(this.performances);
  }
}
