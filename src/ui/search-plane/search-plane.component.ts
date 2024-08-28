import {Component} from '@angular/core';
import {PlanePerformanceComponent} from "../plane-performance/plane-performance.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {planeRepositoryProvider} from "../../app/providers";
import {AsyncPipe} from "@angular/common";
import {PlaneCardComponent} from "../plane-card/plane-card.component";
import {Plane} from "../../domain/plane";
import {BehaviorSubject} from "rxjs";
import {PlaneRepository} from "../../domain/plane.repository";

@Component({
  selector: 'search-plane',
  standalone: true,
  templateUrl: './search-plane.component.html',
  imports: [
    PlanePerformanceComponent,
    FaIconComponent,
    RouterLink,
    FormsModule,
    AsyncPipe,
    PlaneCardComponent
  ],
  providers: [
    planeRepositoryProvider
  ]
})
export class SearchPlaneComponent {
  registration: string = '';
  name: string = '';
  ownerName: string = '';
  searchResults: BehaviorSubject<Plane[]> = new BehaviorSubject<Plane[]>([]);

  constructor(private readonly planeRepository: PlaneRepository) {
  }

  search() {
    this.planeRepository.search(this.registration, this.name, this.ownerName)
      .subscribe(planes => this.searchResults.next(planes));
  }
}
