import {Component} from '@angular/core';
import {AsyncPipe, NgForOf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {PlaneRepository} from "../../domain/plane.repository";
import {RouterLink} from "@angular/router";
import {PlaneCardComponent} from "../plane-card/plane-card.component";
import {LoginRepository} from "../../domain/user/login.repository";

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    NgForOf,
    AsyncPipe,
    RouterLink,
    PlaneCardComponent
  ]
})
export class HomeComponent {
  protected myPlanes: Plane[] | undefined = undefined;
  protected favoritePlanes: Plane[] | undefined = undefined;
  protected lastUsedPlanes: Plane[] | undefined = undefined;

  constructor(private readonly planeProvider: PlaneRepository, private readonly loginRepository: LoginRepository) {
    this.loginRepository.ready().subscribe(() => {
      planeProvider.mine().subscribe(value => this.myPlanes = value);
      planeProvider.favorites().subscribe(value => this.favoritePlanes = value);
      planeProvider.lastUsed().subscribe(value => this.lastUsedPlanes = value);
    });
  }

  mustDisplayMyPlanes() {
    return this.myPlanes !== undefined && this.myPlanes.length > 0;
  }

  mustDisplayFavoritePlanes() {
    return this.favoritePlanes !== undefined && this.favoritePlanes.length > 0;
  }

  mustDisplayLastUsedPlanes() {
    return this.lastUsedPlanes !== undefined && this.lastUsedPlanes.length > 0;
  }

  mustDisplayWelcomeMessages() {
    return (this.myPlanes !== undefined && this.myPlanes.length === 0)
      && (this.favoritePlanes !== undefined && this.favoritePlanes.length === 0)
      && (this.lastUsedPlanes !== undefined && this.lastUsedPlanes.length === 0);
  }

  isLoggedIn() {
    return this.loginRepository.isLoggedIn();
  }

  login() {
    this.loginRepository.login();
  }

  updatePlanes() {
    this.planeProvider.favorites().subscribe(value => this.favoritePlanes = value);
    this.planeProvider.mine().subscribe(value => this.myPlanes = value);
  }
}
