import {ActivatedRouteSnapshot, ResolveFn, Routes} from '@angular/router';
import {PerformanceComputerComponent} from "../ui/performance-computer/performance-computer.component";
import {PlaneCreatorComponent} from "../ui/plane-creator/plane-creator.component";
import {SearchPlaneComponent} from "../ui/search-plane/search-plane.component";
import {Plane} from "../domain/plane";
import {inject} from "@angular/core";
import {PlaneRepository} from "../domain/plane.repository";
import {HomeComponent} from "../ui/home/home.component";

const planeResolver: ResolveFn<Plane> = (route: ActivatedRouteSnapshot) => {
  const planeId = route.paramMap.get('planeId');

  return inject(PlaneRepository).get(planeId || "");
}

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,

  },
  {
    path: 'compute/:planeId',
    component: PerformanceComputerComponent,
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
    resolve: {
      plane: planeResolver
    }
  },
  {
    path: 'search',
    component: SearchPlaneComponent
  }
];
