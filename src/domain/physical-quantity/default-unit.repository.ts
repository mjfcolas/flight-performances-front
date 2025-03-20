import {ChosenUnit} from "./chosen-unit";

export abstract class DefaultUnitRepository {
  abstract getChosenUnit(): Promise<ChosenUnit>;

  abstract persistChosenUnit(chosenUnit: ChosenUnit): void;
}
