import {PlanePerformances} from "../plane";

export class PlaneCreationCommand {
  constructor(
    public readonly name: string,
    public readonly immat: string,
    public readonly performances: PlanePerformances) {

    if (name === null || name === undefined || name.trim().length === 0) {
      throw new Error('PLANE_CREATION_COMMAND_EMPTY_NAME');
    }
    if (immat === null || immat === undefined || immat.trim().length === 0) {
      throw new Error('PLANE_CREATION_COMMAND_EMPTY_IMMAT');
    }
  }
}
