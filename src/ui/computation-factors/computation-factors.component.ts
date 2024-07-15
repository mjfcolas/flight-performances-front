import {Component, Input} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {TrackFactors} from "../../domain/plane";


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
  takeOffTrackFactors: TrackFactors | null = null;

  @Input()
  landingTrackFactors: TrackFactors | null = null;
}
