import {LoginRepository} from "../login.repository";

export class MockedLoginRepository implements LoginRepository {
  getAccessToken = jest.fn();
  isLoggedIn = jest.fn();
  login = jest.fn();
  logout = jest.fn();
  ready = jest.fn();
}
