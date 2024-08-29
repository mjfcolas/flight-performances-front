export abstract class LoginRepository {
  abstract login(): void;
  abstract isLoggedIn(): boolean;
  abstract logout(): void;
  abstract getAccessToken(): string | null;
}
