import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {RunwayFactorsViewModel} from "../view-models/plane-performances-view.model";
import {StepCoefficient} from "../../../domain/plane";
import {UiMode} from "../../ui-mode";
import {FormsModule} from "@angular/forms";
import {pushAtSortPosition} from "array-push-at-sort-position";


@Component({
  selector: 'computation-factors',
  standalone: true,
  templateUrl: './computation-factors.component.html',
  imports: [
    DecimalPipe,
    FormsModule
  ],
  providers: [],
})
export class ComputationFactorsComponent {

  currentTakeOffWindSpeed: number | undefined;
  currentTakeOffWindCoef: number | undefined;
  currentLandingWindSpeed: number | undefined;
  currentLandingWindCoef: number | undefined

  @Input()
  mode: UiMode = 'READ_ONLY';

  @Input()
  securityFactor: number | null = null;

  @Input()
  takeOffRunwayFactors: RunwayFactorsViewModel = RunwayFactorsViewModel.empty();

  @Input()
  landingRunwayFactors: RunwayFactorsViewModel = RunwayFactorsViewModel.empty();

  @Input()
  landingWindCoefficients: StepCoefficient[] = []

  @Input()
  takeOffWindCoefficients: StepCoefficient[] = []

  @Output()
  emittedTakeOffRunwayFactors: EventEmitter<RunwayFactorsViewModel> = new EventEmitter<RunwayFactorsViewModel>();
  @Output()
  emittedLandingRunwayFactors: EventEmitter<RunwayFactorsViewModel> = new EventEmitter<RunwayFactorsViewModel>();
  @Output()
  emittedLandingWindCoefficients: EventEmitter<StepCoefficient[]> = new EventEmitter<StepCoefficient[]>();
  @Output()
  emittedTakeOffWindCoefficients: EventEmitter<StepCoefficient[]> = new EventEmitter<StepCoefficient[]>();

  get headWindTakeOffCoefficients(): StepCoefficient[] {
    return this.takeOffWindCoefficients.filter(coefficient => coefficient.step >= 0)
  }

  get tailWindTakeOffCoefficients(): StepCoefficient[] {
    return this.takeOffWindCoefficients.filter(coefficient => coefficient.step < 0)
  }

  get headWindLandingCoefficients(): StepCoefficient[] {
    return this.landingWindCoefficients.filter(coefficient => coefficient.step >= 0)
  }

  get tailWindLandingCoefficients(): StepCoefficient[] {
    return this.landingWindCoefficients.filter(coefficient => coefficient.step < 0)
  }

  tailwindLabelForIndex(index: number, sourceData: StepCoefficient[]): string {
    const nextTailwindValue = index === sourceData.length - 1 ? 0 : sourceData[index + 1].step;
    const currentTailWindValue = sourceData[index].step;

    if (nextTailwindValue === undefined || currentTailWindValue === undefined) {
      return '';
    }

    return `${-currentTailWindValue} kt → ${-nextTailwindValue} kt`;
  }

  headwindLabelForIndex(index: number, sourceData: StepCoefficient[]): string {
    const nextTailwindValue = index === sourceData.length - 1 ? undefined : sourceData[index + 1].step;
    if (nextTailwindValue) {
      return `${sourceData[index].step} kt → ${nextTailwindValue} kt`;
    } else {
      return `${sourceData[index].step}+ kt`;
    }
  }

  addTakeOffWindButtonDisabled() {
    return this.currentTakeOffWindSpeed === undefined || this.currentTakeOffWindCoef === undefined;
  }

  addTakeOffWind() {
    if (this.currentTakeOffWindSpeed === undefined || this.currentTakeOffWindCoef === undefined) {
      return;
    }
    pushAtSortPosition(
      this.takeOffWindCoefficients,
      {step: this.currentTakeOffWindSpeed, coefficient: this.currentTakeOffWindCoef},
      (a, b) => a.step > b.step ? 1 : a.step < b.step ? -1 : 0,
      0);
    this.currentTakeOffWindCoef = undefined;
    this.currentTakeOffWindSpeed = undefined;
    this.emittedTakeOffWindCoefficients.emit(this.takeOffWindCoefficients);
  }

  addLandingWind() {
    if (this.currentLandingWindSpeed === undefined || this.currentLandingWindCoef === undefined) {
      return;
    }
    pushAtSortPosition(
      this.landingWindCoefficients,
      {step: this.currentLandingWindSpeed, coefficient: this.currentLandingWindCoef},
      (a, b) => a.step > b.step ? 1 : a.step < b.step ? -1 : 0,
      0);
    this.currentLandingWindCoef = undefined;
    this.currentLandingWindSpeed = undefined;
    this.emittedLandingWindCoefficients.emit(this.landingWindCoefficients);
  }

  addLandingWindButtonDisabled() {
    return this.currentLandingWindSpeed === undefined || this.currentLandingWindCoef === undefined;
  }

  removeLandingWindAtIndex(index: number) {
    this.landingWindCoefficients.splice(index, 1);
  }

  removeTakeOffWindAtIndex(index: number) {
    this.takeOffWindCoefficients.splice(index, 1);
  }

  updateTakeOffRunwayFactorHardWet(value: number) {
    this.takeOffRunwayFactors.hardWet = value;
    this.emittedTakeOffRunwayFactors.emit(this.takeOffRunwayFactors);
  }

  updateTakeOffRunwayFactorHard(value: number) {
    this.takeOffRunwayFactors.hard = value;
    this.emittedTakeOffRunwayFactors.emit(this.takeOffRunwayFactors);
  }

  updateTakeOffRunwayFactorGrass(value: number) {
    this.takeOffRunwayFactors.grass = value;
    this.emittedTakeOffRunwayFactors.emit(this.takeOffRunwayFactors);
  }

  updateTakeOffRunwayFactorGrassWet(value: number) {
    this.takeOffRunwayFactors.grassWet = value;
    this.emittedTakeOffRunwayFactors.emit(this.takeOffRunwayFactors);
  }

  updateLandingRunwayFactorHardWet(value: number) {
    this.landingRunwayFactors.hardWet = value;
    this.emittedLandingRunwayFactors.emit(this.landingRunwayFactors);
  }

  updateLandingRunwayFactorHard(value: number) {
    this.landingRunwayFactors.hard = value;
    this.emittedLandingRunwayFactors.emit(this.landingRunwayFactors);
  }

  updateLandingRunwayFactorGrass(value: number) {
    this.landingRunwayFactors.grass = value;
    this.emittedLandingRunwayFactors.emit(this.landingRunwayFactors);
  }

  updateLandingRunwayFactorGrassWet(value: number) {
    this.landingRunwayFactors.grassWet = value;
    this.emittedLandingRunwayFactors.emit(this.landingRunwayFactors);
  }

}
