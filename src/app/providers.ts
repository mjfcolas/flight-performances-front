import {inject, Provider} from "@angular/core";
import {PlaneRepository} from "../domain/plane.repository";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Plane} from "../domain/plane";
import {LocalPlaneRepository} from "../infrastructure/planes/local-plane.repository";
import {InterpolationProvider} from "../domain/interpolation.provider";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {PerformanceComputer} from "../domain/performance-computer";
import {CreatePlane, DefaultCreatePlane} from "../domain/create-plane/create-plane";
import {PlanePerformanceComponent} from "../ui/plane-performance/plane-performance.component";

export const planeResolver: ResolveFn<Plane> = (route: ActivatedRouteSnapshot) => {
  const planeId = route.paramMap.get('planeId');

  return inject(PlaneRepository).get(planeId || "");
}

export const planeProviderProvider: Provider = {
  provide: PlaneRepository,
  useClass: LocalPlaneRepository
}

export const interpolationProviderProvider: Provider = {
  provide: InterpolationProvider,
  useClass: TrilinearInterpolationProvider
}

export const performanceComputerProvider: Provider = {
  provide: PerformanceComputer,
  useFactory: (interpolationProvider: InterpolationProvider) => new PerformanceComputer(interpolationProvider),
  deps: [InterpolationProvider]
}

export const createPlaneProvider: Provider = {
  provide: CreatePlane,
  useFactory: () => new DefaultCreatePlane(inject(PlaneRepository)),
}
