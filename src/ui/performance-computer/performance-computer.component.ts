import {Component, inject} from '@angular/core';
import {NgForOf} from "@angular/common";
import {Plane} from "../../domain/plane";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {interpolationProviderProvider, performanceComputerProvider} from "../../app/providers";
import {PerformanceComputer, SECURITY_FACTOR} from "../../domain/performance-computer";
import {PressureAltitude} from "../../domain/pressure-altitude";
import {Temperature} from "../../domain/temperature";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';
import {PerformanceTableComponent} from "../performance-table/performance-table.component";
import {ComputationFactorsComponent} from "../computation-factors/computation-factors.component";
import {ComputationResultsComponent} from "../computation-results/computation-results.component";
import {
  TakeOffAndLandingPerformanceComputeResponse
} from "../../domain/take-off-and-landing-performance-compute.response";
import {ComputationDetailsComponent} from "../computation-details/computation-details.component";
import {ComputationFormComponent} from "../computation-form/computation-form.component";
import {ComputationFormOutput} from "../computation-form/output/computation-form.output";


@Component({
  selector: 'performance-computer',
  standalone: true,
  templateUrl: './performance-computer.component.html',
  imports: [
    NgForOf,
    FontAwesomeModule,
    RouterLink,
    PerformanceTableComponent,
    ComputationFactorsComponent,
    ComputationResultsComponent,
    ComputationDetailsComponent,
    ComputationFormComponent
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
  public readonly faChevronLeft = faChevronLeft

  completePerformanceComputeResponse: TakeOffAndLandingPerformanceComputeResponse | null = null;

  constructor(private readonly performanceComputer: PerformanceComputer) {
    this.securityFactor = SECURITY_FACTOR;
  }

  public compute(computationFormOutput: ComputationFormOutput): void {
    this.completePerformanceComputeResponse = this.performanceComputer.compute({
      plane: this.plane,
      pressureAltitude: PressureAltitude.fromAltitudeInFeetAndQnhInHpa(
        computationFormOutput.altitude,
        computationFormOutput.qnhInHpa),
      temperatureInCelsius: new Temperature(computationFormOutput.temperatureInCelsius),
      massInKg: computationFormOutput.massInKg,
      runwayStatus: computationFormOutput.runwayStatus,
      runwayType: computationFormOutput.runwayType,
      headwindInKnots: computationFormOutput.headWindInKnots
    });
  }

  public toggleInformationPanel(): void {
    this.detailedMode = !this.detailedMode;
  }
}
