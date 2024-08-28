import {Plane} from "./plane";
import {Observable} from "rxjs";
import {PlaneCreationCommand} from "./create-plane/plane-creation-command";

export abstract class PlaneRepository {
  abstract mine(): Observable<Plane[]>;
  abstract favorites(): Observable<Plane[]>;
  abstract isFavorite(id: string): Observable<boolean>;
  abstract isMine(id: string): Observable<boolean>;
  abstract get(id: string): Observable<Plane>;
  abstract toggleFavorite(id: string): Observable<any>;
  abstract save(plane: PlaneCreationCommand): Observable<any>;
}
