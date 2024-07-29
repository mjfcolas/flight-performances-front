import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {PlaneRepository} from "../../domain/plane.repository";
import {planeProviderProvider} from "../../app/providers";
import {Observable} from "rxjs";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'plane-selector',
  standalone: true,
  providers: [
    planeProviderProvider
  ],
  templateUrl: './plane-selector.component.html',
  imports: [
    NgForOf,
    AsyncPipe,
    RouterLink
  ],
  styleUrl: './plane-selector.component.css'
})
export class PlaneSelectorComponent {
  readonly planes: Observable<Plane[]>;

  constructor(planeProvider: PlaneRepository) {
    this.planes = planeProvider.list();
  }
}
