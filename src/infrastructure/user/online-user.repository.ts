import {UserRepository} from "../../domain/user/user.repository";
import {User} from "../../domain/user/user";
import {WebClient} from "../web-client";
import {from, map, mergeMap, Observable} from "rxjs";
import {Environment} from "../../app/environment";
import {OperationResult} from "../../domain/operation-result";

export class OnlineUserRepository implements UserRepository {

  constructor(public readonly webClient: WebClient, public readonly environment: Environment) {
  }

  getUser(): Observable<User> {
    return from(this.webClient.fetch(`${this.environment.backendUrl}/users/current`)).pipe(
      mergeMap(response => from(response.json())),
      map(user => new User(user.nickname))
    )
  }

  saveUser(user: User): Observable<OperationResult<User>> {
    return from(this.webClient.fetch(`${this.environment.backendUrl}/users/current`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    })).pipe(mergeMap((response): Observable<OperationResult<User>> => {
      if (response.ok) {
        return from(response.json()).pipe(map((user) => ({
          status: "SUCCESS",
          result: new User(user.nickname)
        })));
      } else
        return from(response.json()).pipe(map((errorResponse) => ({
          status: "ERROR",
          errorCode: errorResponse.errorCode
        })))
    }));
  }
}
