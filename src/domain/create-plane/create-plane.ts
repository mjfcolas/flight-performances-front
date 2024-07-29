import {PlaneCreationCommand} from "./plane-creation-command";
import {PlaneRepository} from "../plane.repository";
import {Observable} from "rxjs";

export abstract class CreatePlane {
  abstract apply(planeCreationCommand: PlaneCreationCommand): Observable<any>;
}

export class DefaultCreatePlane implements CreatePlane {

  constructor(private readonly planeRepository: PlaneRepository) {
  }

  apply(planeCreationCommand: PlaneCreationCommand): Observable<any> {
    return this.planeRepository.save(planeCreationCommand);
  }
}
