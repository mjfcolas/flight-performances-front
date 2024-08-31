import {UserRepository} from "../user.repository";

export class MockedUserRepository implements UserRepository {
  getUser = jest.fn();

  saveUser = jest.fn();

}
