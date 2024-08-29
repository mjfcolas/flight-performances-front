import {Component, inject} from '@angular/core';
import {PlanePerformanceComponent} from "../plane-performance/plane-performance.component";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {PlaneCreateOrUpdateCommand} from "../../domain/create-plane/plane-create-or-update-command";
import {PlanePerformancesViewModel} from "../plane-performance/view-models/plane-performances-view.model";
import {PlaneRepository} from "../../domain/plane.repository";
import {Plane} from "../../domain/plane";

@Component({
  selector: 'plane-creator',
  standalone: true,
  templateUrl: './plane-creator.component.html',
  imports: [
    PlanePerformanceComponent,
    FaIconComponent,
    RouterLink,
    FormsModule
  ]
})
export class PlaneCreatorComponent {

  public readonly plane: Plane | undefined = inject(ActivatedRoute).snapshot.data["plane"] as Plane | undefined;

  protected readonly faChevronLeft = faChevronLeft;
  protected performances: PlanePerformancesViewModel = this.plane ? PlanePerformancesViewModel.fromPlanePerformances(this.plane.performances) : PlanePerformancesViewModel.empty();

  registration: string = this.plane?.registration ?? "";
  name: string = this.plane?.name ?? "";
  isSaved: boolean = false;
  inError: boolean = false;

  constructor(private readonly planeRepository: PlaneRepository) {
  }

  save() {
    this.planeRepository.save(this.generateCommand()).subscribe((operationResult) => {
      this.isSaved = operationResult.status === "SUCCESS";
      this.inError = operationResult.status === "ERROR";
    });
  }

  saveButtonDisabled() {
    try {
      this.generateCommand();
      return false;
    } catch (e) {
      return true;
    }
  }

  private generateCommand(): PlaneCreateOrUpdateCommand {
    const toSave = this.performances.toPlanePerformances();
    return new PlaneCreateOrUpdateCommand(this.plane?.id, this.name, this.registration, toSave);
  }

  setPerformances(performancesViewModel: PlanePerformancesViewModel) {
    this.isSaved = false;
    this.performances = performancesViewModel;
  }
}
