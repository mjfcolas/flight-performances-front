import {CreatePlane} from "../create-plane";

export class MockedCreatePlane implements CreatePlane {
  apply = jest.fn()
}
