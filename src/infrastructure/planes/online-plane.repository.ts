import {PlaneRepository} from "../../domain/plane.repository";
import {
  Plane,
  PlanePerformances,
  RunwayFactors,
  StepCoefficient,
  TemperatureMode,
  WindCoefficientComputationData
} from "../../domain/plane";
import {PlaneCreateOrUpdateCommand} from "../../domain/create-plane/plane-create-or-update-command";
import {from, map, mergeMap, Observable, of, ReplaySubject, take} from "rxjs";
import {OperationResult} from "../../domain/operation-result";
import {Environment} from "../../app/environment";
import {LoginRepository} from "../../domain/user/login.repository";
import {User} from "../../domain/user/user";
import {WebClient} from "../web-client";
import {PerformanceDataPoint} from "../../domain/performance-data-point";
import {Distance} from "../../domain/physical-quantity/distance";
import {Mass} from "../../domain/physical-quantity/mass";
import {Temperature, TemperatureDifference} from "../../domain/physical-quantity/temperature";

const LOCALLY_LAST_USED_PLANES_KEY = 'flight-perfs-last-used-planes-unauthenticated';
const LAST_USED_PLANES_MAX_SIZE = 5;

interface PlaneCreateOrUpdateCommandDto {
  readonly id: string | undefined;
  readonly name: string;
  readonly registration: string;
  readonly performances: string;
}

interface PerformanceDataPointDto {
  readonly pressureAltitudeInFeet: number,
  readonly massInKg: number,
  readonly distanceInMeters: number,
  readonly diffWithIsaTemperatureInCelsius?: number,
  readonly absoluteTemperatureInCelsius?: number
}

interface WindCoefficientComputationDataDto {
  byStepsCoefficients: {
    stepCoefficients: readonly StepCoefficient[]
  }
}

interface PerformanceDto {
  readonly temperatureMode: TemperatureMode;
  readonly takeOffDataPoints: PerformanceDataPointDto[];
  readonly landingDataPoints: PerformanceDataPointDto[];
  readonly takeOffRunwayFactors: RunwayFactors;
  readonly landingRunwayFactors: RunwayFactors;
  readonly takeOffCoefficientsComputationData: WindCoefficientComputationDataDto;
  readonly landingCoefficientsComputationData: WindCoefficientComputationDataDto;
}

export class OnlinePlaneRepository implements PlaneRepository {

  private myPlanes: ReplaySubject<Plane[]> | undefined = undefined;
  private favoritePlanes: ReplaySubject<Plane[]> | undefined = undefined;

  constructor(
    public readonly environment: Environment,
    public readonly loginRepository: LoginRepository,
    public readonly webClient: WebClient) {
  }

  favorites(): Observable<Plane[]> {
    if (!this.loginRepository.isLoggedIn()) {
      return of([]);
    }
    return from(this.webClient.fetch(`${this.environment.backendUrl}/users/current/favorite-planes`)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => {
        const favoritePlanes = this.dtoPlaneCollectionToPlanes(planes);
        if (!this.favoritePlanes) {
          this.favoritePlanes = new ReplaySubject(1);
        }
        this.favoritePlanes.next(favoritePlanes);
        return favoritePlanes;
      })
    )
  }

  get(id: string): Observable<Plane> {
    return from(this.webClient.fetch(`${this.environment.backendUrl}/planes/${id}`)).pipe(
      mergeMap(response => from(response.json())),
      map(plane => this.dtoPlaneToPlaneOrThrow(plane))
    )
  }

  delete(id: string): Observable<OperationResult<never>> {
    return from(this.webClient.fetch(`${this.environment.backendUrl}/planes/${id}`, {
      method: 'DELETE'
    })).pipe(mergeMap((response): Observable<OperationResult<never>> => {
      return of({
        status: response.ok ? "SUCCESS" : "ERROR"
      })
    }));
  }

  isFavorite(id: string): Observable<boolean> {
    if (!this.loginRepository.isLoggedIn()) {
      return of(false);
    }
    return this.initializedFavoritePlanes()
      .pipe(
        take(1),
        map(planes => !!planes.find(plane => plane.id === id)
        )
      );
  }

  isMine(id: string): Observable<boolean> {
    if (!this.loginRepository.isLoggedIn()) {
      return of(false);
    }
    return this.initializedMyPlanes()
      .pipe(take(1),
        map(planes => !!planes.find(plane => plane.id === id))
      );
  }

  mine(): Observable<Plane[]> {
    if (!this.loginRepository.isLoggedIn()) {
      return of([]);
    }
    return from(this.webClient.fetch(`${this.environment.backendUrl}/users/current/created-planes`)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => {
        const myPlanes = this.dtoPlaneCollectionToPlanes(planes);
        if (!this.myPlanes) {
          this.myPlanes = new ReplaySubject(1);
        }
        this.myPlanes.next(myPlanes);
        return myPlanes;
      })
    );
  }


  save(command: PlaneCreateOrUpdateCommand): Observable<OperationResult<Plane>> {
    const id = command.id ? `/${command.id}` : '';

    const temperatureMode = command.performances.temperatureMode;

    const dataPointDtoBuilder = (dataPoint: PerformanceDataPoint) => ({
      pressureAltitudeInFeet: dataPoint.pressureAltitudeInFeet,
      massInKg: dataPoint.mass.valueIn('KILOGRAMS'),
      distanceInMeters: dataPoint.distance.valueIn('METERS'),
      absoluteTemperatureInCelsius: temperatureMode === 'ABSOLUTE' ? dataPoint.absoluteTemperature.valueIn('CELSIUS') : undefined,
      diffWithIsaTemperatureInCelsius: temperatureMode === 'ISA' ? dataPoint.diffWithIsaTemperature.valueIn('CELSIUS') : undefined
    });

    const planePerformanceDto: PerformanceDto = {
      temperatureMode: temperatureMode,
      takeOffDataPoints: command.performances.takeOffDataPoints.map(dataPointDtoBuilder),
      landingDataPoints: command.performances.landingDataPoints.map(dataPointDtoBuilder),
      takeOffRunwayFactors: command.performances.takeOffRunwayFactors,
      landingRunwayFactors: command.performances.landingRunwayFactors,
      takeOffCoefficientsComputationData: {
        byStepsCoefficients: {
          stepCoefficients: command.performances.takeOffCoefficientsComputationData.get()
        }
      },
      landingCoefficientsComputationData: {
        byStepsCoefficients: {
          stepCoefficients: command.performances.landingCoefficientsComputationData.get()
        }
      },
    }

    const dtoCommand: PlaneCreateOrUpdateCommandDto = {
      id: command.id,
      name: command.name,
      registration: command.registration,
      performances: JSON.stringify(planePerformanceDto)
    }

    return from(this.webClient.fetch(`${this.environment.backendUrl}/planes${id}`, {
      method: 'PUT',
      body: JSON.stringify(dtoCommand),
      headers: {
        'Content-Type': 'application/json'
      }
    })).pipe(mergeMap((response): Observable<OperationResult<Plane>> => {
      if (response.ok) {
        return from(response.json()).pipe(map((plane) => ({
          status: "SUCCESS",
          result: this.dtoPlaneToPlaneOrThrow(plane)
        })));
      } else {
        return of({
          status: "ERROR"
        })
      }
    }));
  }

  toggleFavorite(id: string): Observable<OperationResult<never>> {
    return this.isFavorite(id).pipe(mergeMap(isFavorite => {
        let method;
        if (isFavorite) {
          method = 'DELETE';
        } else {
          method = 'PUT';
        }
        return from(this.webClient.fetch(`${this.environment.backendUrl}/users/current/favorite-planes/${id}`, {
          method: method,
        }));
      }),
      mergeMap((response): Observable<OperationResult<never>> => {
        if (!response.ok) {
          return of({status: "ERROR"});
        }
        return this.favorites().pipe(map(() => ({status: "SUCCESS"})));
      }))
  }

  search(registration: string, name: string, ownerName: string): Observable<Plane[]> {
    const queryUrl = `${this.environment.backendUrl}/planes?registration=${registration}&name=${name}&ownerName=${ownerName}`;
    return from(this.webClient.fetch(queryUrl)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => this.dtoPlaneCollectionToPlanes(planes))
    )
  }


  addToLastUsed(plane: Plane): Observable<OperationResult<never>> {
    if (this.loginRepository.isLoggedIn()) {
      return of({
        status: "SUCCESS"
      })
    }
    const lastUsedPlanes = JSON.parse(localStorage.getItem(LOCALLY_LAST_USED_PLANES_KEY) || '[]');
    //Add the plane to last used planes, avoid duplicates, and remove the oldest one if the list is too long
    const newLastUsedPlanes = [plane, ...lastUsedPlanes
      .filter((p: Plane) => p.id !== plane.id)]
      .slice(0, LAST_USED_PLANES_MAX_SIZE);
    localStorage.setItem(LOCALLY_LAST_USED_PLANES_KEY, JSON.stringify(newLastUsedPlanes));

    return of({
      status: "SUCCESS"
    })
  }

  lastUsed(): Observable<Plane[]> {
    if (this.loginRepository.isLoggedIn()) {
      return of([]);
    }
    const lastUsedPlanes = this.dtoPlaneCollectionToPlanes(JSON.parse(localStorage.getItem(LOCALLY_LAST_USED_PLANES_KEY) || '[]'));
    return of(lastUsedPlanes);
  }

  private initializedFavoritePlanes(): Observable<Plane[]> {
    if (!this.favoritePlanes) {
      this.favoritePlanes = new ReplaySubject(1)
      this.favorites().subscribe((planes) => this.favoritePlanes?.next(planes));
    }
    return this.favoritePlanes;
  }

  private initializedMyPlanes(): Observable<Plane[]> {
    if (!this.myPlanes) {
      this.myPlanes = new ReplaySubject(1)
      this.mine().subscribe((planes) => this.myPlanes?.next(planes))
    }
    return this.myPlanes;
  }


  private dtoPlaneCollectionToPlanes(planes: any[]): Plane[] {
    return planes.map(plane => this.dtoPlaneToPlaneOrUndefined(plane))
      .filter(plane => plane !== undefined) as Plane[];
  }

  private dtoPlaneToPlaneOrThrow(dtoPlane: any): Plane {
    const plane = this.dtoPlaneToPlaneOrUndefined(dtoPlane);
    if (!plane) {
      throw new Error('Plane parsing error');
    }
    return plane
  }


  private dtoPlaneToPlaneOrUndefined(plane: any): Plane | undefined {

    try {
      const backwardCompatiblePerformanceDatapointDtoBuilder: (performanceDataPointDto: any) => PerformanceDataPointDto = (performanceDataPointDto: any) => {
        return {
          pressureAltitudeInFeet: performanceDataPointDto.pressureAltitudeInFeet,
          massInKg: performanceDataPointDto.massInKg,
          distanceInMeters: performanceDataPointDto.distanceInMeters,
          diffWithIsaTemperatureInCelsius: performanceDataPointDto.diffWithIsaTemperatureInCelsius !== undefined ? performanceDataPointDto.diffWithIsaTemperatureInCelsius : performanceDataPointDto.temperatureInCelsius,
          absoluteTemperatureInCelsius: performanceDataPointDto.absoluteTemperatureInCelsius
        }
      }

      const backwardCompatiblePlanePerformanceDtoBuilder: (planePerformanceDto: any) => PerformanceDto = (planePerformancesDto: any) => {
        const temperatureMode = planePerformancesDto.temperatureMode ?? 'ISA';
        return {
          temperatureMode: temperatureMode,
          takeOffDataPoints: planePerformancesDto.takeOffDataPoints.map(backwardCompatiblePerformanceDatapointDtoBuilder),
          landingDataPoints: planePerformancesDto.landingDataPoints.map(backwardCompatiblePerformanceDatapointDtoBuilder),
          takeOffRunwayFactors: planePerformancesDto.takeOffRunwayFactors,
          landingRunwayFactors: planePerformancesDto.landingRunwayFactors,
          takeOffCoefficientsComputationData: planePerformancesDto.takeOffCoefficientsComputationData,
          landingCoefficientsComputationData: planePerformancesDto.landingCoefficientsComputationData
        }
      }

      const planePerformancesDto: PerformanceDto = backwardCompatiblePlanePerformanceDtoBuilder(JSON.parse(plane.performances));

      const temperatureMode = planePerformancesDto.temperatureMode ?? 'ISA';

      const performanceDataPointDtoToPerformanceDataPoint = (performanceDataPointDto: PerformanceDataPointDto) => {
        if (performanceDataPointDto.absoluteTemperatureInCelsius !== null && performanceDataPointDto.absoluteTemperatureInCelsius !== undefined) {
          return PerformanceDataPoint.fromAbsoluteTemperature({
            pressureAltitudeInFeet: performanceDataPointDto.pressureAltitudeInFeet,
            absoluteTemperature: Temperature.forValueAndUnit(performanceDataPointDto.absoluteTemperatureInCelsius, 'CELSIUS'),
            mass: Mass.forValueAndUnit(performanceDataPointDto.massInKg, 'KILOGRAMS'),
            distance: Distance.forValueAndUnit(performanceDataPointDto.distanceInMeters, "METERS")
          });
        } else {
          return PerformanceDataPoint.fromDiffWithIsaTemperature({
            pressureAltitudeInFeet: performanceDataPointDto.pressureAltitudeInFeet,
            diffWithIsaTemperature: TemperatureDifference.forValueAndUnit(performanceDataPointDto.diffWithIsaTemperatureInCelsius as number, 'CELSIUS'),
            mass: Mass.forValueAndUnit(performanceDataPointDto.massInKg, 'KILOGRAMS'),
            distance: Distance.forValueAndUnit(performanceDataPointDto.distanceInMeters, "METERS")
          })
        }
      }

      return new Plane(
        plane.id,
        plane.name,
        plane.registration,
        new PlanePerformances(
          temperatureMode,
          planePerformancesDto.takeOffDataPoints.map(performanceDataPointDtoToPerformanceDataPoint),
          planePerformancesDto.landingDataPoints.map(performanceDataPointDtoToPerformanceDataPoint),
          new RunwayFactors(
            planePerformancesDto.takeOffRunwayFactors.grass,
            planePerformancesDto.takeOffRunwayFactors.grassWet,
            planePerformancesDto.takeOffRunwayFactors.hard,
            planePerformancesDto.takeOffRunwayFactors.hardWet
          ),
          new RunwayFactors(
            planePerformancesDto.landingRunwayFactors.grass,
            planePerformancesDto.landingRunwayFactors.grassWet,
            planePerformancesDto.landingRunwayFactors.hard,
            planePerformancesDto.landingRunwayFactors.hardWet
          ),
          WindCoefficientComputationData.fromStepCoefficients(planePerformancesDto.takeOffCoefficientsComputationData.byStepsCoefficients.stepCoefficients),
          WindCoefficientComputationData.fromStepCoefficients(planePerformancesDto.landingCoefficientsComputationData.byStepsCoefficients.stepCoefficients),
        ),
        new User(plane.owner.nickname)
      );
    } catch (e) {
      console.warn('Error while parsing plane', plane, e);
      return undefined
    }
  }
}
