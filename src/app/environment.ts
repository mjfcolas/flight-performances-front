import {from, map, mergeMap, Observable} from "rxjs";

export class Environment {
  private _backendUrl: string = ""
  private _oAuth2Issuer: string = ""
  private _oAuth2ClientId: string = ""
  private _oAuth2LogoutUrl: string = ""
  private _contactAddress: string = ""

  constructor() {
  }

  public load(): Observable<any> {
    return from(fetch('./config.json'))
      .pipe(
        mergeMap(response => from(response.json())),
        map(config => {
          this._backendUrl = config.backendUrl
          this._oAuth2Issuer = config.oAuth2Issuer
          this._oAuth2ClientId = config.oAuth2ClientId
          this._oAuth2LogoutUrl = config.oAuth2LogoutUrl
          this._contactAddress = config.contactAddress
        }));
  }

  public get backendUrl(): string {
    return this._backendUrl
  }

  public get oAuth2Issuer(): string {
    return this._oAuth2Issuer
  }

  public get oAuth2ClientId(): string {
    return this._oAuth2ClientId
  }

  public get oAuth2LogoutUrl(): string {
    return this._oAuth2LogoutUrl
  }

  public get contactAddress(): string {
    return this._contactAddress
  }
}
