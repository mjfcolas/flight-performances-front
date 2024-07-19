import {Component, Input} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {RunwayFactors, StepCoefficient, WindCoefficientComputationData} from "../../domain/plane";


@Component({
  selector: 'computation-factors',
  standalone: true,
  templateUrl: './computation-factors.component.html',
  imports: [
    DecimalPipe
  ],
  providers: [],
})
export class ComputationFactorsComponent {

  _headWindTakeOffCoefficients: StepCoefficient[] = [];
  _headWindLandingCoefficients: StepCoefficient[] = [];
  _tailWindTakeOffCoefficients: StepCoefficient[] = [];
  _tailWindLandingCoefficients: StepCoefficient[] = [];

  @Input()
  securityFactor: number | null = null;

  @Input()
  takeOffRunwayFactors: RunwayFactors | null = null;

  @Input()
  landingRunwayFactors: RunwayFactors | null = null;

  @Input()
  set landingWindCoefficientComputationData(landingWindCoefficientComputationData: WindCoefficientComputationData) {
    const allCoefficients = landingWindCoefficientComputationData.get();
    this._tailWindLandingCoefficients = allCoefficients?.filter(coefficient => coefficient.step < 0)
    this._headWindLandingCoefficients = allCoefficients?.filter(coefficient => coefficient.step >= 0)
  };

  @Input()
  set takeOffWindCoefficientComputationData(takeOffWindCoefficientComputationData: WindCoefficientComputationData) {
    const allCoefficients = takeOffWindCoefficientComputationData.get();
    this._tailWindTakeOffCoefficients = allCoefficients?.filter(coefficient => coefficient.step < 0)
    this._headWindTakeOffCoefficients = allCoefficients?.filter(coefficient => coefficient.step >= 0)
  };

  tailwindLabelForIndex(index: number, sourceData: StepCoefficient[]): string {
    const nextTailwindValue = index === sourceData.length - 1 ? 0 : sourceData[index + 1].step;
    return `${-sourceData[index].step} kt → ${-nextTailwindValue} kt`;
  }
  headwindLabelForIndex(index: number, sourceData: StepCoefficient[]): string {
    const nextTailwindValue = index === sourceData.length - 1 ? undefined : sourceData[index + 1].step;
    if(nextTailwindValue){
      return `${sourceData[index].step} kt → ${nextTailwindValue} kt`;
    }else{
      return `${sourceData[index].step}+ kt`;
    }
  }
}
