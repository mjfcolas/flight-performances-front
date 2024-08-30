import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {BottomNavigationComponent} from "../ui/bottom-navigation/bottom-navigation.component";
import {LoginRepository} from "../domain/user/login.repository";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BottomNavigationComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public constructor(private titleService: Title) {
    this.titleService.setTitle("Flight performances");
  }
}
