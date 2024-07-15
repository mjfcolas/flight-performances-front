import {Component, inject} from '@angular/core';
import {DecimalPipe, NgForOf, NgIf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {interpolationProviderProvider, performanceComputerProvider} from "../../app/providers";
import {PerformanceComputer, SECURITY_FACTOR} from "../../domain/performance-computer";
import {PerformanceComputeResponse} from "../../domain/performance-compute-response";
import {AltitudePressure} from "../../domain/altitude-pressure";
import {Temperature} from "../../domain/temperature";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {
  faChevronLeft,
  faCircleExclamation,
  faCircleInfo,
  faPlaneArrival,
  faPlaneDeparture
} from '@fortawesome/free-solid-svg-icons';
import {PerformanceTableComponent} from "../performance-table/performance-table.component";
import {ComputationFactorsComponent} from "../computation-factors/computation-factors.component";


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
    PerformanceTableComponent,
    ComputationFactorsComponent
  ],
  providers: [
    interpolationProviderProvider,
    performanceComputerProvider
  ],
  styleUrl: './performance-computer.component.css'
})
export class PerformanceComputerComponent {
  public readonly plane: Plane = inject(ActivatedRoute).snapshot.data["plane"] as Plane;

  public readonly securityFactor: number;

  informationPanelOpen: boolean = false;

  massInKg: number = 800;
  temperatureInCelsius: number = 15;
  qnhInHpa: number = 1013;
  altitude: number = 357;
  isGrassTrack: boolean = false;
  isWetTrack: boolean = false;

  public readonly faPlaneDeparture = faPlaneDeparture
  public readonly faPlaneArrival = faPlaneArrival
  public readonly faChevronLeft = faChevronLeft
  public readonly faCircleInfo = faCircleInfo
  public readonly faCircleExclamation = faCircleExclamation

  performanceComputeResponse: PerformanceComputeResponse | null = null;

  constructor(private readonly performanceComputer: PerformanceComputer) {
    this.securityFactor = SECURITY_FACTOR;
  }

  public compute(): void {
    this.performanceComputeResponse = this.performanceComputer.compute({
      plane: this.plane,
      altitudePressure: AltitudePressure.fromAltitudeInFeetAndQnhInHpa(this.altitude, this.qnhInHpa),
      temperatureInCelsius: new Temperature(this.temperatureInCelsius),
      massInKg: this.massInKg,
      trackStatus: this.isWetTrack ? "WET" : "DRY",
      trackType: this.isGrassTrack ? "GRASS" : "HARD"
    });
  }

  public toggleInformationPanel(): void {
    this.informationPanelOpen = !this.informationPanelOpen;
  }
}
