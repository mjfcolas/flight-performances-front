import {Plane} from "./plane";
import {Observable} from "rxjs";

export abstract class PlaneProvider {
  abstract list(): Observable<Plane[]>;
  abstract get(id: string): Observable<Plane>;
}
