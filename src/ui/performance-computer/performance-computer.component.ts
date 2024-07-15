import {Component, inject} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {interpolationProviderProvider, performanceComputerProvider} from "../../app/providers";
import {PerformanceComputer, SECURITY_FACTOR} from "../../domain/performance-computer";
import {PressureAltitude} from "../../domain/pressure-altitude";
import {Temperature} from "../../domain/temperature";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faChevronLeft, faCircleInfo} from '@fortawesome/free-solid-svg-icons';
import {PerformanceTableComponent} from "../performance-table/performance-table.component";
import {ComputationFactorsComponent} from "../computation-factors/computation-factors.component";
import {ComputationResultsComponent} from "../computation-results/computation-results.component";
import {
  TakeOffAndLandingPerformanceComputeResponse
} from "../../domain/take-off-and-landing-performance-compute.response";
import {ComputationDetailsComponent} from "../computation-details/computation-details.component";


@Component({
  selector: 'performance-computer',
  standalone: true,
  templateUrl: './performance-computer.component.html',
  imports: [
    NgForOf,
    FormsModule,
    FontAwesomeModule,
    RouterLink,
    PerformanceTableComponent,
    ComputationFactorsComponent,
    ComputationResultsComponent,
    ComputationDetailsComponent
  ],
  providers: [
    interpolationProviderProvider,
    performanceComputerProvider
  ]
})
export class PerformanceComputerComponent {
  public readonly plane: Plane = inject(ActivatedRoute).snapshot.data["plane"] as Plane;

  public readonly securityFactor: number;

  detailedMode: boolean = false;

  massInKg: number = 800;
  temperatureInCelsius: number = 15;
  qnhInHpa: number = 1013;
  altitude: number = 357;
  isGrassRunway: boolean = false;
  isWetRunway: boolean = false;

  public readonly faChevronLeft = faChevronLeft
  public readonly faCircleInfo = faCircleInfo

  completePerformanceComputeResponse: TakeOffAndLandingPerformanceComputeResponse | null = null;

  constructor(private readonly performanceComputer: PerformanceComputer) {
    this.securityFactor = SECURITY_FACTOR;
  }

  public compute(): void {
    this.completePerformanceComputeResponse = this.performanceComputer.compute({
      plane: this.plane,
      pressureAltitude: PressureAltitude.fromAltitudeInFeetAndQnhInHpa(this.altitude, this.qnhInHpa),
      temperatureInCelsius: new Temperature(this.temperatureInCelsius),
      massInKg: this.massInKg,
      runwayStatus: this.isWetRunway ? "WET" : "DRY",
      runwayType: this.isGrassRunway ? "GRASS" : "HARD"
    });
  }

  public toggleInformationPanel(): void {
    this.detailedMode = !this.detailedMode;
  }
}
