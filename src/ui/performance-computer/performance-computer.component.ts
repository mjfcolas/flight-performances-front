import {Component, inject} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {Plane} from "../../domain/plane";
import {ActivatedRoute} from "@angular/router";
import {PerformanceComputer, SECURITY_FACTOR} from "../../domain/performance-computer";
import {PressureAltitude} from "../../domain/physical-quantity/pressure-altitude";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faStar as faStarRegular} from '@fortawesome/free-regular-svg-icons';
import {ComputationResultsComponent} from "../computation-results/computation-results.component";
import {
  TakeOffAndLandingPerformanceComputeResponse
} from "../../domain/take-off-and-landing-performance-compute.response";
import {ComputationDetailsComponent} from "../computation-details/computation-details.component";
import {ComputationFormComponent} from "../computation-form/computation-form.component";
import {ComputationFormOutput} from "../computation-form/output/computation-form.output";
import {PlanePerformanceComponent} from "../plane-performance/plane-performance.component";
import {PlanePerformancesViewModel} from "../plane-performance/view-models/plane-performances-view.model";
import {BehaviorSubject, Observable} from "rxjs";
import {PlaneRepository} from "../../domain/plane.repository";
import {LoginRepository} from "../../domain/user/login.repository";
import {ChooseUnitFormComponent} from "../choose-unit-form/choose-unit-form.component";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";


@Component({
  selector: 'performance-computer',
  standalone: true,
  templateUrl: './performance-computer.component.html',
  imports: [
    FontAwesomeModule,
    ComputationResultsComponent,
    ComputationDetailsComponent,
    ComputationFormComponent,
    PlanePerformanceComponent,
    AsyncPipe,
    ChooseUnitFormComponent
  ]
})
export class PerformanceComputerComponent {
  public readonly plane: Plane = inject(ActivatedRoute).snapshot.data["plane"] as Plane;
  public readonly performanceViewModel: PlanePerformancesViewModel = PlanePerformancesViewModel.fromPlanePerformances(this.plane.performances);

  public readonly securityFactor: number;
  public readonly favoriteIcon: BehaviorSubject<any> = new BehaviorSubject<any>(faStarRegular);

  detailedMode: boolean = false;

  completePerformanceComputeResponse: TakeOffAndLandingPerformanceComputeResponse | null = null;
  unitPanel: boolean = false;
  chosenUnit: ChosenUnit | undefined

  constructor(
    private readonly performanceComputer: PerformanceComputer,
    private readonly planeRepository: PlaneRepository,
    private readonly loginRepository: LoginRepository,
    defaultUnitRepository: DefaultUnitRepository
  ) {
    this.securityFactor = SECURITY_FACTOR;
    defaultUnitRepository.getChosenUnit().then(chosenUnit => {
      this.chosenUnit = chosenUnit;
    })
    this.updateFavoriteIcon();
  }

  public compute(computationFormOutput: ComputationFormOutput): void {
    this.planeRepository.addToLastUsed(this.plane);
    this.completePerformanceComputeResponse = this.performanceComputer.compute({
      performances: this.plane.performances,
      pressureAltitude: PressureAltitude.fromAltitudeInFeetAndQnh(
        computationFormOutput.altitude,
        computationFormOutput.qnh),
      temperature: computationFormOutput.temperature,
      mass: computationFormOutput.mass,
      runwayStatus: computationFormOutput.runwayStatus,
      runwayType: computationFormOutput.runwayType,
      headwindInKnots: computationFormOutput.headWindInKnots
    });
  }

  public toggleInformationPanel(): void {
    this.detailedMode = !this.detailedMode;
  }

  private isFavorite(): Observable<boolean> {
    return this.planeRepository.isFavorite(this.plane.id);
  }

  updateFavoriteIcon() {
    this.isFavorite().subscribe(
      isFavorite => this.favoriteIcon.next(isFavorite ? faStar : faStarRegular)
    );
  }

  toggleFavorite() {
    this.planeRepository.toggleFavorite(this.plane.id).subscribe(() => this.updateFavoriteIcon());
  }

  mustDisplayFavoriteIcon(): boolean {
    return this.loginRepository.isLoggedIn();
  }

  toggleUnitPanel() {
    this.unitPanel = !this.unitPanel;
  }

  newChosenUnit(chosenUnit: ChosenUnit) {
    this.chosenUnit = chosenUnit;
  }
}
