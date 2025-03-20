import {APP_INITIALIZER, ApplicationConfig, inject, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {OAuthService, provideOAuthClient} from "angular-oauth2-oidc";
import {firstValueFrom} from "rxjs";
import {ConfigJsonEnvironment, Environment} from "./environment";
import {provideHttpClient, withFetch} from "@angular/common/http";
import {PerformanceComputer} from "../domain/performance-computer";
import {InterpolationProvider} from "../domain/interpolation.provider";
import {TrilinearInterpolationProvider} from "../infrastructure/interpolation/trilinear-interpolation.provider";
import {LoginRepository} from "../domain/user/login.repository";
import {SpaLoginRepository} from "../infrastructure/login/spa-login.repository";
import {PlaneRepository} from "../domain/plane.repository";
import {OnlinePlaneRepository} from "../infrastructure/planes/online-plane.repository";
import {DefaultWebClient, WebClient} from "../infrastructure/web-client";
import {UserRepository} from "../domain/user/user.repository";
import {OnlineUserRepository} from "../infrastructure/user/online-user.repository";
import {DefaultUnitRepository} from "../domain/physical-quantity/default-unit.repository";
import {
  LocalStorageDefaultUnitRepository
} from "../infrastructure/physical-quantity/local-storage-default-unit.repository";

const environment = new ConfigJsonEnvironment();

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
      provide: LoginRepository,
      useFactory: () => new SpaLoginRepository(inject(Environment), inject(OAuthService))
    },
    {
      provide: WebClient,
      useFactory: () => new DefaultWebClient(inject(LoginRepository))
    },
    {
      provide: InterpolationProvider,
      useClass: TrilinearInterpolationProvider
    },
    {
      provide: PerformanceComputer,
      useFactory: () => new PerformanceComputer(inject(InterpolationProvider))
    },
    {
      provide: PlaneRepository,
      useFactory: () => new OnlinePlaneRepository(inject(Environment), inject(LoginRepository), inject(WebClient))
    },
    {
      provide: UserRepository,
      useFactory: () => new OnlineUserRepository(inject(WebClient), inject(Environment))
    },
    {
      provide: DefaultUnitRepository,
      useFactory: () => new LocalStorageDefaultUnitRepository()
    }
  ]
};
