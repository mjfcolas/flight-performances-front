import {Routes} from '@angular/router';
import {PlaneSelectorComponent} from "../ui/plane-selector/plane-selector.component";
import {PerformanceComputerComponent} from "../ui/performance-computer/performance-computer.component";
import {planeProviderProvider, planeResolver} from "./providers";

export const routes: Routes = [
  { path: '',   redirectTo: '/planes', pathMatch: 'full' },
  {path: 'planes', component: PlaneSelectorComponent},
  {
    path: 'compute/:planeId',
    component: PerformanceComputerComponent,
    providers: [planeProviderProvider],
    resolve: {
      plane: planeResolver
    }
  }
];
