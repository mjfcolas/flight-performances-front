import {PlaneRepository} from "../plane.repository";
import {Observable} from "rxjs";
import {Plane} from "../plane";

export class MockedPlaneRepository implements PlaneRepository {
  favorites = jest.fn()
  get = jest.fn()
  isFavorite = jest.fn()
  isMine = jest.fn()
  mine = jest.fn()
  save = jest.fn()
  toggleFavorite = jest.fn()
  search  = jest.fn()
}
