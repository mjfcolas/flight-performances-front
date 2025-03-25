import {from, map, mergeMap, Observable} from "rxjs";

export interface MatomoConfiguration {
  siteId: string
  url: string
}

export abstract class Environment {
  public abstract get backendUrl(): string

  public abstract get oAuth2Issuer(): string

  public abstract get oAuth2ClientId(): string

  public abstract get oAuth2LogoutUrl(): string

  public abstract get contactAddress(): string

  public abstract get enableAnalytics(): boolean

  public abstract get matomoConfiguration(): MatomoConfiguration | undefined
}

export class ConfigJsonEnvironment implements Environment {
  private _backendUrl: string = ""
  private _oAuth2Issuer: string = ""
  private _oAuth2ClientId: string = ""
  private _oAuth2LogoutUrl: string = ""
  private _contactAddress: string = ""
  private _enableAnalytics: boolean = false
  private _matomoConfiguration: MatomoConfiguration = {
    siteId: "",
    url: "",
  }

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
          this._enableAnalytics = config.enableAnalytics
          this._matomoConfiguration = config.matomoConfiguration
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

  public get enableAnalytics(): boolean {
    return this._enableAnalytics
  }

  public get matomoConfiguration(): MatomoConfiguration {
    return this._matomoConfiguration
  }
}
