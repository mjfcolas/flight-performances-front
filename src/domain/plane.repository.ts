import {Plane} from "./plane";
import {Observable} from "rxjs";
import {PlaneCreationCommand} from "./create-plane/plane-creation-command";

export abstract class PlaneRepository {
  abstract list(): Observable<Plane[]>;
  abstract get(id: string): Observable<Plane>;
  abstract save(plane: PlaneCreationCommand): Observable<any>;
}
