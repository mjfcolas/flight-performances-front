import {Component, Input} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {RunwayFactors} from "../../domain/plane";


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

  @Input()
  securityFactor: number | null = null;

  @Input()
  takeOffRunwayFactors: RunwayFactors | null = null;

  @Input()
  landingRunwayFactors: RunwayFactors | null = null;
}
