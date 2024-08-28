import {Routes} from '@angular/router';
import {PlaneSelectorComponent} from "../ui/plane-selector/plane-selector.component";
import {PerformanceComputerComponent} from "../ui/performance-computer/performance-computer.component";
import {planeRepositoryProvider, planeResolver} from "./providers";
import {PlaneCreatorComponent} from "../ui/plane-creator/plane-creator.component";
import {SearchPlaneComponent} from "../ui/search-plane/search-plane.component";

export const routes: Routes = [
  {path: '', redirectTo: '/planes', pathMatch: 'full'},
  {
    path: 'planes',
    component: PlaneSelectorComponent,

  },
  {
    path: 'compute/:planeId',
    component: PerformanceComputerComponent,
    providers: [planeRepositoryProvider],
    resolve: {
      plane: planeResolver
    }
  },
  {
    path: 'create',
    component: PlaneCreatorComponent
  },
  {
    path: 'edit/:planeId',
    component: PlaneCreatorComponent,
    providers: [planeRepositoryProvider],
    resolve: {
      plane: planeResolver
    }
  },
  {
    path: 'search',
    component: SearchPlaneComponent
  },
];
