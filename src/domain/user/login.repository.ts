import {Observable} from "rxjs";

export abstract class LoginRepository {
  abstract ready(): Observable<any>;

  abstract login(): void;

  abstract isLoggedIn(): boolean;

  abstract logout(): void;

  abstract getAccessToken(): string | null;
}
