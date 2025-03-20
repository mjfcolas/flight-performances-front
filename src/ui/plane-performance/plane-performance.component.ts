import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ComputationFactorsComponent} from "./computation-factors/computation-factors.component";
import {PerformanceTableComponent} from "./performance-table/performance-table.component";
import {
  PerformanceDataPointViewModel,
  PlanePerformancesViewModel,
  RunwayFactorsViewModel
} from "./view-models/plane-performances-view.model";
import {UiMode} from "../ui-mode";
import {StepCoefficient, TemperatureMode} from "../../domain/plane";
import {FormsModule} from "@angular/forms";
import {ChosenUnit} from "../units/chosen-unit";

@Component({
  selector: 'plane-performance',
  standalone: true,
  templateUrl: './plane-performance.component.html',
  imports: [
    ComputationFactorsComponent,
    PerformanceTableComponent,
    FormsModule
  ],
  providers: []
})
export class PlanePerformanceComponent {

  @Input()
  mode: UiMode = 'READ_ONLY';

  @Input()
  securityFactor: number | null = null;
  private _performances: PlanePerformancesViewModel = PlanePerformancesViewModel.empty();

  @Input()
  set performances(data: PlanePerformancesViewModel) {
    this._performances = data;
  };

  get performances() {
    return this._performances;
  }

  @Input()
  chosenUnit: ChosenUnit | undefined

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

  changeTemperatureMode(temperatureMode: TemperatureMode) {
    this.performances = this.performances.changeTemperatureMode(temperatureMode);
    this.emittedPerformances.emit(this.performances);
  }
}
