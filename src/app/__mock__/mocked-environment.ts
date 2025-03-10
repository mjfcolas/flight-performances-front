import {Environment} from "../environment";

export class MockedEnvironment implements Environment {
  backendUrl = "http://backend"
  oAuth2Issuer = "http://issuer"
  oAuth2ClientId = "clientId"
  oAuth2LogoutUrl = "http://issuer/logout"
  contactAddress = "contact@backend"
}
