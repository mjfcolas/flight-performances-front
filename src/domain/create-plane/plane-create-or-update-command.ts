import {PlanePerformances} from "../plane";

export class PlaneCreateOrUpdateCommand {
  constructor(
    public readonly id: string | undefined,
    public readonly name: string,
    public readonly registration: string,
    public readonly performances: PlanePerformances) {

    if (name === null || name === undefined || name.trim().length === 0) {
      throw new Error('PLANE_CREATION_COMMAND_EMPTY_NAME');
    }
    if (registration === null || registration === undefined || registration.trim().length === 0) {
      throw new Error('PLANE_CREATION_COMMAND_EMPTY_REGISTRATION');
    }
  }
}
