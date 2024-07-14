import {Component, inject} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {interpolationProviderProvider, performanceComputerProvider} from "../../app/providers";
import {PerformanceComputer} from "../../domain/performance-computer";
import {PerformanceComputeResponse} from "../../domain/performance-compute-response";
import {AltitudePressure} from "../../domain/altitude-pressure";
import {Temperature} from "../../domain/temperature";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {
  faChevronLeft,
  faCircleInfo,
  faPlaneArrival,
  faPlaneDeparture,
  faCircleExclamation
} from '@fortawesome/free-solid-svg-icons';
import {PerformanceTableComponent} from "../performance-table/performance-table.component";


@Component({
  selector: 'performance-computer',
  standalone: true,
  templateUrl: './performance-computer.component.html',
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    DecimalPipe,
    FontAwesomeModule,
    RouterLink,
    PerformanceTableComponent
  ],
  providers: [
    interpolationProviderProvider,
    performanceComputerProvider
  ],
  styleUrl: './performance-computer.component.css'
})
export class PerformanceComputerComponent {
  public readonly plane: Plane = inject(ActivatedRoute).snapshot.data["plane"] as Plane;

  informationPanelOpen: boolean = false;

  massInKg: number = 800;
  temperatureInCelsius: number = 15;
  qnhInHpa: number = 1013;
  altitude: number = 357;

  public readonly faPlaneDeparture = faPlaneDeparture
  public readonly faPlaneArrival = faPlaneArrival
  public readonly faChevronLeft = faChevronLeft
  public readonly faCircleInfo = faCircleInfo
  public readonly faCircleExclamation = faCircleExclamation

  performanceComputeResponse: PerformanceComputeResponse | null = null;
  outOfBoundComputationError: boolean = false;

  constructor(private readonly performanceComputer: PerformanceComputer) {
  }

  public compute(): void {
    try {
      this.performanceComputeResponse = this.performanceComputer.compute({
        plane: this.plane,
        altitudePressure: AltitudePressure.fromAltitudeInFeetAndQnhInHpa(this.altitude, this.qnhInHpa),
        temperatureInCelsius: new Temperature(this.temperatureInCelsius),
        massInKg: this.massInKg
      });
      this.outOfBoundComputationError = false;
    } catch (e) {
      if (e instanceof Error && e.message === 'OUT_OF_BOUND_ERROR') {
        this.performanceComputeResponse = null;
        this.outOfBoundComputationError = true;
      }
    }
  }

  public toggleInformationPanel(): void {
    this.informationPanelOpen = !this.informationPanelOpen;
  }

}
