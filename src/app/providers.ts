import {inject, Provider} from "@angular/core";
import {PlaneProvider} from "../domain/plane.provider";
import {ActivatedRouteSnapshot, ResolveFn} from "@angular/router";
import {Plane} from "../domain/plane";
import {LocalPlaneProvider} from "../infrastructure/planes/local-plane.provider";
import {InterpolationProvider} from "../domain/interpolation.provider";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {PerformanceComputer} from "../domain/performance-computer";

export const planeResolver: ResolveFn<Plane> = (route: ActivatedRouteSnapshot) => {
  const planeId = route.paramMap.get('planeId');

  return inject(PlaneProvider).get(planeId || "");
}

export const planeProviderProvider: Provider = {
  provide: PlaneProvider,
  useClass: LocalPlaneProvider
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
