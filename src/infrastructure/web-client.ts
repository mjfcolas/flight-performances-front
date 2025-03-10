import {LoginRepository} from "../domain/user/login.repository";

export abstract class WebClient {
  abstract fetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response>;
}

export class DefaultWebClient implements WebClient {
  constructor(public readonly loginRepository: LoginRepository) {
  }

  fetch(url: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    let headers = init?.headers;
    if (this.loginRepository.getAccessToken()) {
      headers = {
        ...headers,
        Authorization: `Bearer ${this.loginRepository.getAccessToken()}`
      }
    }
    return fetch(url, {
      ...init,
      headers
    });
  }
}
