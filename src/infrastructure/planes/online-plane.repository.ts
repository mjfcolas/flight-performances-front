import {PlaneRepository} from "../../domain/plane.repository";
import {Plane, PlanePerformances, RunwayFactors, WindCoefficientComputationData} from "../../domain/plane";
import {PlaneCreateOrUpdateCommand} from "../../domain/create-plane/plane-create-or-update-command";
import {from, map, mergeMap, Observable, of, ReplaySubject, take} from "rxjs";
import {OperationResult} from "../../domain/operation-result";
import {Environment} from "../../app/environment";
import {LoginRepository} from "../../domain/user/login.repository";
import {User} from "../../domain/user/user";

const LOCALLY_LAST_USED_PLANES_KEY = 'flight-perfs-last-used-planes-unauthenticated';
const LAST_USED_PLANES_MAX_SIZE = 5;

export class OnlinePlaneRepository implements PlaneRepository {

  private myPlanes: ReplaySubject<Plane[]> | undefined = undefined;
  private favoritePlanes: ReplaySubject<Plane[]> | undefined = undefined;

  constructor(
    public readonly environment: Environment,
    public readonly loginRepository: LoginRepository) {
  }

  favorites(): Observable<Plane[]> {
    if (!this.loginRepository.isLoggedIn()) {
      return of([]);
    }
    return from(this.authenticatedFetch(`${this.environment.backendUrl}/users/current/favorite-planes`)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => {
        const favoritePlanes = planes.map((plane: any) => this.dtoPlaneToPlane(plane));
        if (!this.favoritePlanes) {
          this.favoritePlanes = new ReplaySubject(1);
        }
        this.favoritePlanes.next(favoritePlanes);
        return favoritePlanes;
      })
    )
  }

  get(id: string): Observable<Plane> {
    return from(this.authenticatedFetch(`${this.environment.backendUrl}/planes/${id}`)).pipe(
      mergeMap(response => from(response.json())),
      map(plane => this.dtoPlaneToPlane(plane))
    )
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
    return from(this.authenticatedFetch(`${this.environment.backendUrl}/users/current/created-planes`)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => {
        const myPlanes = planes.map((plane: any) => this.dtoPlaneToPlane(plane));
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

    return from(this.authenticatedFetch(`${this.environment.backendUrl}/planes${id}`, {
      method: 'PUT',
      body: JSON.stringify(command),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.loginRepository.getAccessToken()}`
      }
    })).pipe(mergeMap((response): Observable<OperationResult<Plane>> => {
      if (response.ok) {
        return from(response.json()).pipe(map((plane) => ({
          status: "SUCCESS",
          result: this.dtoPlaneToPlane(plane)
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
        return from(this.authenticatedFetch(`${this.environment.backendUrl}/users/current/favorite-planes/${id}`, {
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
    return from(this.authenticatedFetch(queryUrl)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => planes.map((plane: any) => this.dtoPlaneToPlane(plane)))
    )
  }

  authenticatedFetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let headers = init?.headers;
    if (this.loginRepository.getAccessToken()) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.loginRepository.getAccessToken()}`
      }
    }
    return fetch(url, {
      ...init,
      headers
    });
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
    return of(JSON.parse(localStorage.getItem(LOCALLY_LAST_USED_PLANES_KEY) || '[]'));
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


  private dtoPlaneToPlane(plane: any): Plane {
    return new Plane(
      plane.id,
      plane.name,
      plane.registration,
      new PlanePerformances(
        plane.performances.takeOffDataPoints,
        plane.performances.landingDataPoints,
        new RunwayFactors(
          plane.performances.takeOffRunwayFactors.grass,
          plane.performances.takeOffRunwayFactors.grassWet,
          plane.performances.takeOffRunwayFactors.hard,
          plane.performances.takeOffRunwayFactors.hardWet
        ),
        new RunwayFactors(
          plane.performances.landingRunwayFactors.grass,
          plane.performances.landingRunwayFactors.grassWet,
          plane.performances.landingRunwayFactors.hard,
          plane.performances.landingRunwayFactors.hardWet
        ),
        WindCoefficientComputationData.fromStepCoefficients(plane.performances.takeOffCoefficientsComputationData.byStepsCoefficients.stepCoefficients),
        WindCoefficientComputationData.fromStepCoefficients(plane.performances.landingCoefficientsComputationData.byStepsCoefficients.stepCoefficients),
      ),
      new User(plane.owner.nickname)
    );
  }
}
