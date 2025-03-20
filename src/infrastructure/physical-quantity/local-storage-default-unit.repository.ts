import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {UserRepository} from "../../domain/user/user.repository";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {firstValueFrom} from "rxjs";
import {LoginRepository} from "../../domain/user/login.repository";

const defaultChosenUnit: ChosenUnit = {
  massUnit: 'KILOGRAMS',
  horizontalDistanceUnit: 'METERS',
  atmosphericPressureUnit: 'HPA',
  temperatureUnit: 'CELSIUS'
}

export class LocalStorageDefaultUnitRepository implements DefaultUnitRepository {

  private readonly localStorage: Storage = window.localStorage;

  constructor(
    private readonly loginRepository: LoginRepository,
    private readonly userRepository: UserRepository) {
  }

  async getChosenUnit(): Promise<ChosenUnit> {
    const key: string = await this.getLocalStorageKey();
    const storedValue = this.localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue) as ChosenUnit;
    }
    return defaultChosenUnit;
  }

  persistChosenUnit(chosenUnit: ChosenUnit): void {
    const serializedChosenUnit = JSON.stringify(chosenUnit);

    this.getLocalStorageKey().then(key => {
      this.localStorage.setItem(key, serializedChosenUnit);

    })
  }

  private async getLocalStorageKey(): Promise<string> {
    if (!this.loginRepository.isLoggedIn()) {
      return "local_chosenUnit"
    }

    const user = await firstValueFrom(this.userRepository.getUser());
    return `user_${user.nickname}_chosenUnit`
  }
}
