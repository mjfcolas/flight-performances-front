import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {PlaneRepository} from "../../domain/plane.repository";
import {planeRepositoryProvider} from "../../app/providers";
import {from, Observable, tap} from "rxjs";
import {RouterLink} from "@angular/router";
import {PlaneCardComponent} from "../plane-card/plane-card.component";

@Component({
  selector: 'plane-selector',
  standalone: true,
  providers: [
    planeRepositoryProvider
  ],
  templateUrl: './plane-selector.component.html',
  imports: [
    NgForOf,
    AsyncPipe,
    RouterLink,
    PlaneCardComponent
  ],
  styleUrl: './plane-selector.component.css'
})
export class PlaneSelectorComponent {
  readonly myPlanes: Observable<Plane[]>;
  favoritePlanes: Observable<Plane[]>;

  constructor(private readonly planeProvider: PlaneRepository) {
    this.myPlanes = planeProvider.mine();
    this.favoritePlanes = planeProvider.favorites();
  }

  updateFavorites() {
    this.favoritePlanes = this.planeProvider.favorites();
  }
}
