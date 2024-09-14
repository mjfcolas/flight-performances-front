import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {Plane} from "../../domain/plane";
import {RouterLink} from "@angular/router";
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {PlaneRepository} from "../../domain/plane.repository";
import {BehaviorSubject, Observable, of} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {faStar as faStarRegular} from "@fortawesome/free-regular-svg-icons";
import {LoginRepository} from "../../domain/user/login.repository";

@Component({
  selector: 'plane-card',
  standalone: true,
  templateUrl: './plane-card.component.html',
  imports: [
    RouterLink,
    FaIconComponent,
    AsyncPipe
  ]
})
export class PlaneCardComponent {

  @ViewChild('deleteModal') deleteModal: ElementRef<HTMLDialogElement> | undefined;

  protected _plane: Plane | undefined;

  @Output() favoriteChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() planeDeleted: EventEmitter<any> = new EventEmitter<any>();

  @Input() showFavorite: boolean = true;

  constructor(
    private readonly planeRepository: PlaneRepository,
    private readonly loginRepository: LoginRepository) {
    this.updateFavoriteIcon();
  }

  public readonly favoriteIcon: BehaviorSubject<any> = new BehaviorSubject<any>(faStarRegular);


  @Input()
  set plane(plane: Plane) {
    this._plane = plane;
    this.updateFavoriteIcon();
  }

  get plane(): Plane | undefined {
    return this._plane;
  }

  belongsToMe(): Observable<boolean> {
    if (!this.isLoggedIn() || this.plane === undefined) {
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
    if (!this.isLoggedIn() || this.plane === undefined) {
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

  isLoggedIn(): boolean {
    return this.loginRepository.isLoggedIn();
  }

  mustDisplayFavoriteIcon(): boolean {
    return this.showFavorite && this.isLoggedIn();
  }

  clickOnDelete() {
    if (this.deleteModal !== undefined) {
      this.deleteModal.nativeElement.showModal();
    }
  }

  confirmDelete(id: string) {
    this.planeRepository.delete(id).subscribe(() => {
      if (this.deleteModal !== undefined) {
        this.planeDeleted.emit();
        this.deleteModal.nativeElement.close();
      }
    });
  }
}
