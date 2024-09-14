import {Component} from '@angular/core';
import {
  faHouse,
  faPlus,
  faRightFromBracket,
  faRightToBracket,
  faUser,
  IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {PlaneCreatorComponent} from "../plane-creator/plane-creator.component";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {SearchPlaneComponent} from "../search-plane/search-plane.component";
import {LoginRepository} from "../../domain/user/login.repository";
import {UserProfileComponent} from "../user-profile/user-profile.component";

export type Page = "HOME" | "ADD" | "PROFILE" | "SEARCH";

@Component({
  selector: 'app-bottom-navigation',
  standalone: true,
  templateUrl: './bottom-navigation.component.html',
  imports: [
    FaIconComponent,
    RouterLink
  ],
  providers: [],
})
export class BottomNavigationComponent {

  protected readonly faHouse = faHouse;
  protected readonly faPlus = faPlus;
  protected readonly faUser = faUser;


  private activatedPage: Page | null = null;

  constructor(
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly loginRepository: LoginRepository
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const activatedComponent = this.getActivatedComponent(this.activatedRoute);
        console.log(activatedComponent);
        if (activatedComponent === HomeComponent) {
          this.activatedPage = "HOME";
        } else if (activatedComponent === PlaneCreatorComponent) {
          this.activatedPage = "ADD";
        } else if (activatedComponent === SearchPlaneComponent) {
          this.activatedPage = "SEARCH";
        } else if (activatedComponent === UserProfileComponent) {
          this.activatedPage = "PROFILE";
        } else {
          this.activatedPage = null;
        }
      }
    })
  }


  private getActivatedComponent(route: ActivatedRoute): any {
    if (route.firstChild) {
      return this.getActivatedComponent(route.firstChild);
    } else {
      return route.component;
    }
  }

  isActivated(page: Page): boolean {
    return this.activatedPage === page;
  }

  protected readonly faMagnifyingGlass = faMagnifyingGlass;

  private login() {
    this.loginRepository.login();
  }

  private logout() {
    this.loginRepository.logout();
  }

  loginOrLogoutIcon(): IconDefinition {
    return this.isLoggedIn() ? faRightFromBracket : faRightToBracket;
  }

  isLoggedIn(): boolean {
    return this.loginRepository.isLoggedIn();
  }

  loginOrLogout() {
    if (this.isLoggedIn()) {
      this.logout();
    } else {
      this.login();
    }
  }
}
