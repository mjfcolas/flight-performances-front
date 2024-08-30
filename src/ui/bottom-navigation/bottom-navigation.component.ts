import {Component} from '@angular/core';
import {faHouse, faPlus, faRightFromBracket, faRightToBracket, IconDefinition} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivationStart, Router, RouterLink} from "@angular/router";
import {HomeComponent} from "../home/home.component";
import {PlaneCreatorComponent} from "../plane-creator/plane-creator.component";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import {SearchPlaneComponent} from "../search-plane/search-plane.component";
import {LoginRepository} from "../../domain/user/login.repository";

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


  private activatedPage: Page | null = null;

  constructor(private readonly router: Router, private readonly loginRepository: LoginRepository) {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        if (event.snapshot.component?.name === HomeComponent.name) {
          this.activatedPage = "HOME";
        } else if (event.snapshot.component?.name === PlaneCreatorComponent.name) {
          this.activatedPage = "ADD";
        } else if (event.snapshot.component?.name === SearchPlaneComponent.name) {
          this.activatedPage = "SEARCH";
        } else {
          this.activatedPage = null;
        }
      }
    })
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
