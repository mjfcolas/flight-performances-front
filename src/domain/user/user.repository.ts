import {User} from "./user";
import {Observable} from "rxjs";
import {OperationResult} from "../operation-result";

export abstract class UserRepository {

  abstract getUser(): Observable<User>;

  abstract saveUser(user: User): Observable<OperationResult<User>>;
}
