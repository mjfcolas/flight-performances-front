import {DefaultUnitRepository} from "../default-unit.repository";
import {ChosenUnit} from "../chosen-unit";

export class MockedDefaultUnitRepository implements DefaultUnitRepository {

  private chosenUnit: ChosenUnit = {
    massUnit: 'POUNDS',
    horizontalDistanceUnit: 'METERS',
    atmosphericPressureUnit: 'HPA',
    temperatureUnit: 'CELSIUS'
  }

  getChosenUnit(): Promise<ChosenUnit> {
    return Promise.resolve(this.chosenUnit);
  }

  persistChosenUnit(chosenUnit: ChosenUnit): void {
    this.chosenUnit = chosenUnit;
  }
}
