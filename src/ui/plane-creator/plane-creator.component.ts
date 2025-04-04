import {Component, inject} from '@angular/core';
import {PlanePerformanceComponent} from "../plane-performance/plane-performance.component";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {PlaneCreateOrUpdateCommand} from "../../domain/create-plane/plane-create-or-update-command";
import {PlanePerformancesViewModel} from "../plane-performance/view-models/plane-performances-view.model";
import {PlaneRepository} from "../../domain/plane.repository";
import {Plane} from "../../domain/plane";
import {LoginRepository} from "../../domain/user/login.repository";
import {NotLoggedInComponent} from "../not-logged-in/not-logged-in.component";
import {UserRepository} from "../../domain/user/user.repository";
import {map, Observable} from "rxjs";
import {AsyncPipe} from "@angular/common";
import {ChooseUnitFormComponent} from "../choose-unit-form/choose-unit-form.component";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";

@Component({
  selector: 'plane-creator',
  standalone: true,
  templateUrl: './plane-creator.component.html',
  imports: [
    PlanePerformanceComponent,
    RouterLink,
    FormsModule,
    NotLoggedInComponent,
    AsyncPipe,
    ChooseUnitFormComponent
  ]
})
export class PlaneCreatorComponent {

  public plane: Plane | undefined = inject(ActivatedRoute).snapshot.data["plane"] as Plane | undefined;
  public isNicknameDefined: Observable<boolean>;

  protected performances: PlanePerformancesViewModel = this.plane ? PlanePerformancesViewModel.fromPlanePerformances(this.plane.performances) : PlanePerformancesViewModel.empty();

  registration: string = this.plane?.registration ?? "";
  name: string = this.plane?.name ?? "";
  isSaved: boolean = false;
  inError: boolean = false;

  unitPanel: boolean = false;
  chosenUnit: ChosenUnit | undefined

  currentErrorCode?: string = undefined

  constructor(
    private readonly planeRepository: PlaneRepository,
    private readonly loginRepository: LoginRepository,
    private readonly userRepository: UserRepository,
    defaultUnitRepository: DefaultUnitRepository) {
    this.isNicknameDefined = this.userRepository.getUser().pipe(map(user => !!user.nickname));
    defaultUnitRepository.getChosenUnit().then(chosenUnit => {
      this.chosenUnit = chosenUnit;
    })
  }

  save() {
    this.planeRepository.save(this.generateCommand()).subscribe((operationResult) => {
      this.isSaved = operationResult.status === "SUCCESS";
      this.inError = operationResult.status === "ERROR";
      if (operationResult.status === "SUCCESS") {
        this.plane = operationResult.result;
      }
    });
  }

  private generateCommand(): PlaneCreateOrUpdateCommand {
    try {
      const toSave = this.performances.toPlanePerformances();
      this.currentErrorCode = undefined;
      return new PlaneCreateOrUpdateCommand(this.plane?.id, this.name, this.registration, toSave);
    } catch (e) {
      if (e instanceof Error) {
        this.currentErrorCode = e.message;
      }
      throw e;
    }
  }

  setPerformances(performancesViewModel: PlanePerformancesViewModel) {
    this.onFormChange()
    this.performances = performancesViewModel;
  }

  isLoggedIn() {
    return this.loginRepository.isLoggedIn();
  }

  toggleUnitPanel() {
    this.unitPanel = !this.unitPanel;
  }

  newChosenUnit(chosenUnit: ChosenUnit) {
    this.chosenUnit = chosenUnit;
  }

  onFormChange() {
    this.isSaved = false
  }
}
