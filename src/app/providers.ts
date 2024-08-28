import {inject, Provider} from "@angular/core";
import {PlaneRepository} from "../domain/plane.repository";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Plane} from "../domain/plane";
import {InterpolationProvider} from "../domain/interpolation.provider";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {PerformanceComputer} from "../domain/performance-computer";
import {OnlinePlaneRepository} from "../infrastructure/planes/online-plane.repository";

const onlinePlaneRepository: OnlinePlaneRepository = new OnlinePlaneRepository();
const trilinearInterpolationProvider: TrilinearInterpolationProvider = new TrilinearInterpolationProvider();

export const planeResolver: ResolveFn<Plane> = (route: ActivatedRouteSnapshot) => {
  const planeId = route.paramMap.get('planeId');

  return inject(PlaneRepository).get(planeId || "");
}

export const planeRepositoryProvider: Provider = {
  provide: PlaneRepository,
  useValue: onlinePlaneRepository
}

export const interpolationProviderProvider: Provider = {
  provide: InterpolationProvider,
  useValue: trilinearInterpolationProvider
}

export const performanceComputerProvider: Provider = {
  provide: PerformanceComputer,
  useFactory: (interpolationProvider: InterpolationProvider) => new PerformanceComputer(interpolationProvider),
  deps: [InterpolationProvider]
}
