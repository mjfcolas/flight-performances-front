import {Component} from '@angular/core';
import {PlanePerformanceComponent} from "../plane-performance/plane-performance.component";
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {PlaneCreationCommand} from "../../domain/create-plane/plane-creation-command";
import {CreatePlane} from "../../domain/create-plane/create-plane";
import {createPlaneProvider, planeProviderProvider} from "../../app/providers";
import {PlanePerformancesViewModel} from "../plane-performance/view-models/plane-performances-view.model";

@Component({
  selector: 'plane-creator',
  standalone: true,
  templateUrl: './plane-creator.component.html',
  imports: [
    PlanePerformanceComponent,
    FaIconComponent,
    RouterLink,
    FormsModule
  ],
  providers: [
    planeProviderProvider,
    createPlaneProvider,
  ]
})
export class PlaneCreatorComponent {

  protected readonly faChevronLeft = faChevronLeft;
  private performances: PlanePerformancesViewModel = PlanePerformancesViewModel.empty();

  immat: string = '';
  name: string = '';
  isSaved: boolean = false;

  constructor(private readonly createPlane: CreatePlane) {
  }

  save() {
    this.createPlane.apply(this.generateCommand()).subscribe(() => {
      this.isSaved = true
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

  private generateCommand(): PlaneCreationCommand {
    const toSave = this.performances.toPlanePerformances();
    return new PlaneCreationCommand(this.name, this.immat, toSave);
  }

  setPerformances(performancesViewModel: PlanePerformancesViewModel) {
    this.isSaved = false;
    this.performances = performancesViewModel;
  }
}
