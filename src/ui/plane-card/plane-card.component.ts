import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Plane} from "../../domain/plane";
import {RouterLink} from "@angular/router";
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PlaneRepository} from "../../domain/plane.repository";
import {BehaviorSubject, Observable, of} from "rxjs";
import {planeRepositoryProvider} from "../../app/providers";
import {AsyncPipe} from "@angular/common";
import {faStar as faStarRegular} from "@fortawesome/free-regular-svg-icons";

@Component({
  selector: 'plane-card',
  standalone: true,
  templateUrl: './plane-card.component.html',
  imports: [
    RouterLink,
    FaIconComponent,
    AsyncPipe
  ],
  providers: [
    planeRepositoryProvider
  ]
})
export class PlaneCardComponent {

  protected _plane: Plane | undefined;

  @Output() favoriteChanged: EventEmitter<any> = new EventEmitter<any>();

  constructor(private readonly planeRepository: PlaneRepository) {
    this.updateFavoriteIcon();
  }

  public readonly favoriteIcon: BehaviorSubject<any> = new BehaviorSubject<any>(faStarRegular);


  @Input()
  set plane(plane: Plane) {
    this._plane = plane;
    this.updateFavoriteIcon();
  }

  get plane(): Plane| undefined {
    return this._plane;
  }

  belongsToMe(): Observable<boolean> {
    if (this.plane === undefined) {
      return of(false);
    }
    return this.planeRepository.isMine(this.plane.id);
  }

  updateFavoriteIcon() {
    this.isFavorite().subscribe(
      isFavorite => {
        this.favoriteIcon.next(isFavorite ? faStar : faStarRegular)
      }
    );
  }


  private isFavorite(): Observable<boolean> {
    if (this.plane === undefined) {
      return of(false);
    }
    return this.planeRepository.isFavorite(this.plane.id);
  }

  toggleFavorite() {
    if (this.plane === undefined) {
      return;
    }
    this.planeRepository.toggleFavorite(this.plane.id).subscribe(() => {
      this.favoriteChanged.emit()
      this.updateFavoriteIcon();
    });
  }
}
