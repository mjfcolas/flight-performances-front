import {LoginRepository} from "../../domain/user/login.repository";
import {Environment} from "../../app/environment";
import {AuthConfig, OAuthService} from "angular-oauth2-oidc";

export class SpaLoginRepository implements LoginRepository {

  private readonly authConfig: AuthConfig;

  constructor(
    private readonly environment: Environment,
    private readonly oauthService: OAuthService
  ) {
    this.authConfig = {
      issuer: this.environment.oAuth2Issuer,
      clientId: this.environment.oAuth2ClientId,
      redirectUri: `${window.location.origin}/profile`,
      scope: 'openid profile email offline_access',
      responseType: 'code',
      logoutUrl: this.environment.oAuth2LogoutUrl,
      showDebugInformation: true,
      customQueryParams: {
        audience: environment.backendUrl
      },
    }
    this.oauthService.configure(this.authConfig);
    this.oauthService.setupAutomaticSilentRefresh();
    this.oauthService.loadDiscoveryDocumentAndTryLogin().then();
  }

  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken()
  }

  login(): void {
    this.oauthService.initLoginFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  getAccessToken() {
    return this.oauthService.getAccessToken();
  }
}
