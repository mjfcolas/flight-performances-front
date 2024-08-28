import {Component} from '@angular/core';
import {faHouse, faPlus} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {ActivationStart, Router, RouterLink} from "@angular/router";
import {PlaneSelectorComponent} from "../plane-selector/plane-selector.component";
import {PlaneCreatorComponent} from "../plane-creator/plane-creator.component";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";

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

  constructor(private readonly router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof ActivationStart) {
        if (event.snapshot.component?.name === PlaneSelectorComponent.name) {
          this.activatedPage = "HOME";
        } else if (event.snapshot.component?.name === PlaneCreatorComponent.name) {
          this.activatedPage = "ADD";
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
}
