import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  public constructor(private titleService: Title ) {
    this.titleService.setTitle("Flight performances");
  }
}
