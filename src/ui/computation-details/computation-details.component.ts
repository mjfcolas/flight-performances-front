import {Component, Input} from '@angular/core';
import {ComputationData, FactorType, PerformanceComputeResponse} from "../../domain/performance-compute-response";
import {ChosenUnit} from "../units/chosen-unit";
import {DisplayMassPipe} from "../units/display-mass.pipe";
import {DisplayTemperaturePipe} from "../units/display-temperature.pipe";
import {Distance} from "../../domain/physical-quantity/distance";
import {DisplayDistancePipe} from "../units/display-distance.pipe";


@Component({
    selector: 'computation-details',
    standalone: true,
    templateUrl: './computation-details.component.html',
    imports: [
        DisplayMassPipe,
        DisplayTemperaturePipe,
        DisplayDistancePipe
    ],
    providers: [],
})
export class ComputationDetailsComponent {

    _computationData: ComputationData | null = null
    _factorKeys: FactorType[] = []
    _rawPerformance: Distance | undefined
    _securedPerformance: Distance | undefined

    @Input()
    set performanceComputeResponse(performanceComputeResponse: PerformanceComputeResponse) {
        this._computationData = performanceComputeResponse.computationData
        this._factorKeys = Array.from(performanceComputeResponse.computationData.factorMap.keys())
        this._rawPerformance = performanceComputeResponse.rawPerformance
        this._securedPerformance = performanceComputeResponse.securedPerformance
    }

    @Input()
    chosenUnit: ChosenUnit | undefined

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
            case
            "WIND":
                return "Wind coefficient"
        }
    }
}
