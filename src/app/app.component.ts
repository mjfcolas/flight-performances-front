import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Title} from "@angular/platform-browser";
import {BottomNavigationComponent} from "../ui/bottom-navigation/bottom-navigation.component";
import {Environment} from "./environment";
import {AnalyticsService} from "../ui/analytics/analytics.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    BottomNavigationComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  public constructor(
    private titleService: Title,
    public readonly environment: Environment,
    private readonly analyticsService: AnalyticsService
  ) {
    this.titleService.setTitle("Flight performances");
  }

  ngOnInit() {
    this.analyticsService.load();
  }
}
