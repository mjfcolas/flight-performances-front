import {PlaneRepository} from "../../domain/plane.repository";
import {Plane, PlanePerformances, RunwayFactors, WindCoefficientComputationData} from "../../domain/plane";
import {PlaneCreateOrUpdateCommand} from "../../domain/create-plane/plane-create-or-update-command";
import {from, map, mergeMap, Observable, of} from "rxjs";
import {OperationResult} from "../../domain/operation-result";

const baseUrl = "http://localhost:8080";

export class OnlinePlaneRepository implements PlaneRepository {

  private myPlanes: Plane[] | undefined = undefined;
  private favoritePlanes: Plane[] | undefined = undefined;

  favorites(): Observable<Plane[]> {
    return from(fetch(`${baseUrl}/users/current/favorite-planes`)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => {
        const favoritePlanes = planes.map((plane: any) => this.dtoPlaneToPlane(plane));
        this.favoritePlanes = favoritePlanes;
        return favoritePlanes;
      })
    )
  }

  get(id: string): Observable<Plane> {
    return from(fetch(`${baseUrl}/planes/${id}`)).pipe(
      mergeMap(response => from(response.json())),
      map(plane => this.dtoPlaneToPlane(plane))
    )
  }

  isFavorite(id: string): Observable<boolean> {
    return this.initializedFavoritePlanes()
      .pipe(map(planes => !!planes.find(plane => plane.id === id)));
  }

  isMine(id: string): Observable<boolean> {
    return this.initializedMyPlanes()
      .pipe(map(planes => !!planes.find(plane => plane.id === id)));
  }

  mine(): Observable<Plane[]> {
    return from(fetch(`${baseUrl}/users/current/created-planes`)).pipe(
      mergeMap(response => from(response.json())),
      map(planes => {
        const myPlanes = planes.map((plane: any) => this.dtoPlaneToPlane(plane));
        this.myPlanes = myPlanes;
        return myPlanes;
      })
    );
  }

  save(command: PlaneCreateOrUpdateCommand): Observable<OperationResult<never>> {
    const id = command.id ? `/${command.id}` : '';

    return from(fetch(`${baseUrl}/planes${id}`, {
      method: 'PUT',
      body: JSON.stringify(command),
      headers: {
        'Content-Type': 'application/json'
      }
    })).pipe(map((response) => ({
      status: response.ok ? "SUCCESS" : "ERROR"
    })));
  }

  toggleFavorite(id: string): Observable<OperationResult<never>> {
    return this.isFavorite(id).pipe(mergeMap(isFavorite => {
        let method;
        if (isFavorite) {
          method = 'DELETE';
        } else {
          method = 'PUT';
        }
        return from(fetch(`${baseUrl}/users/current/favorite-planes/${id}`, {
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

  private initializedFavoritePlanes(): Observable<Plane[]> {
    let sourceList: Observable<Plane[]>;
    if (this.favoritePlanes) {
      sourceList = of(this.favoritePlanes);
    } else {
      sourceList = this.favorites();
    }
    return sourceList;
  }

  private initializedMyPlanes(): Observable<Plane[]> {
    let sourceList: Observable<Plane[]>;
    if (this.myPlanes) {
      sourceList = of(this.myPlanes);
    } else {
      sourceList = this.mine();
    }
    return sourceList;
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
      ));
  }

}
