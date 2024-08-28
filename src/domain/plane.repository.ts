import {Plane} from "./plane";
import {Observable} from "rxjs";
import {PlaneCreateOrUpdateCommand} from "./create-plane/plane-create-or-update-command";
import {OperationResult} from "./operation-result";

export abstract class PlaneRepository {
  abstract mine(): Observable<Plane[]>;
  abstract favorites(): Observable<Plane[]>;
  abstract isFavorite(id: string): Observable<boolean>;
  abstract isMine(id: string): Observable<boolean>;
  abstract get(id: string): Observable<Plane>;
  abstract toggleFavorite(id: string): Observable<OperationResult<never>>;
  abstract save(plane: PlaneCreateOrUpdateCommand): Observable<OperationResult<never>>;
}
