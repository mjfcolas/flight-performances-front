import {WebClient} from "../web-client";

export class MockedWebClient implements WebClient {
  fetch = jest.fn();
}
