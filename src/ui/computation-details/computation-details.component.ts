import {Component, Input} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ComputationData, FactorType, PerformanceComputeResponse} from "../../domain/performance-compute-response";


@Component({
  selector: 'computation-details',
  standalone: true,
  templateUrl: './computation-details.component.html',
  imports: [
    DecimalPipe,
    FaIconComponent,
  ],
  providers: [],
})
export class ComputationDetailsComponent {

  _computationData: ComputationData | null = null
  _factorKeys: FactorType[] = []
  _rawPerformanceInMeters: number | undefined
  _securedPerformanceInMeters: number | undefined

  @Input()
  set performanceComputeResponse(performanceComputeResponse: PerformanceComputeResponse){
    this._computationData = performanceComputeResponse.computationData
    this._factorKeys = Array.from(performanceComputeResponse.computationData.factorMap.keys())
    this._rawPerformanceInMeters = performanceComputeResponse.rawPerformanceInMeters
    this._securedPerformanceInMeters = performanceComputeResponse.securedPerformanceInMeters
  }


  factorLabelFromType(type: FactorType): string {
    switch (type) {
      case "DRY_GRASS":
        return "Dry grass runway"
      case
      "WET_GRASS":
        return "Wet grass runway"
      case
      "DRY_HARD":
        return "Dry hard runway"
      case
      "WET_HARD":
        return "Wet hard runway"
      case
      "SECURITY":
        return "Security coefficient"
    }
  }
}
