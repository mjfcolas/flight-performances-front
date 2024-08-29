import {APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {OAuthService, provideOAuthClient} from "angular-oauth2-oidc";
import {firstValueFrom} from "rxjs";
import {Environment} from "./environment";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {PerformanceComputer} from "../domain/performance-computer";
import {InterpolationProvider} from "../domain/interpolation.provider";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {LoginRepository} from "../domain/user/login.repository";
import {SpaLoginRepository} from "../infrastructure/user/spa-login.repository";
import {PlaneRepository} from "../domain/plane.repository";
import {OnlinePlaneRepository} from "../infrastructure/planes/online-plane.repository";

const environment = new Environment();

const loadEnvironment = () => {
  return (): Promise<any> => {
    return firstValueFrom(environment.load());
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: loadEnvironment,
      multi: true
    },
    {
      provide: Environment,
      useValue: environment
    },
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideOAuthClient(),
    {
      provide: InterpolationProvider,
      useClass: TrilinearInterpolationProvider
    },
    {
      provide: PerformanceComputer,
      useFactory: () => new PerformanceComputer(inject(InterpolationProvider))
    },
    {
      provide: LoginRepository,
      useFactory: () => new SpaLoginRepository(inject(Environment), inject(OAuthService))
    },
    {
      provide: PlaneRepository,
      useFactory: () => new OnlinePlaneRepository(inject(Environment), inject(LoginRepository))
    }
  ]
};
