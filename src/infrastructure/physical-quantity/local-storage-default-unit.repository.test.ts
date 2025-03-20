import {LocalStorageDefaultUnitRepository} from './local-storage-default-unit.repository';
import {MockedLoginRepository} from "../../domain/user/__mock__/mocked-login.repository";
import {MockedUserRepository} from "../../domain/user/__mock__/mocked-user.repository";
import {User} from "../../domain/user/user";
import {of} from "rxjs";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";

class DummyStorage implements Storage {

  constructor(private readonly storageMap: Map<string, string>) {
  }

  get length() {
    return this.storageMap.size;
  }

  clear(): void {
    this.storageMap.clear();
  }

  getItem(key: string): string | null {
    const result = this.storageMap.get(key);
    if (result) {
      return result;
    } else {
      return null
    }
  }

  key(): string | null {
    return null;
  }

  removeItem(key: string): void {
    this.storageMap.delete(key);
  }

  setItem(key: string, value: string): void {
    this.storageMap.set(key, value);
  }
}

describe('LocalStorageDefaultUnitRepository', () => {
  let repository: LocalStorageDefaultUnitRepository;

  const aUserNicknameThatHasChosenUnit = 'testUser';
  const aUserNicknameThatHasNoChosenUnit = 'testUser2';

  const chosenUnitForUnloggedInUser = {
    massUnit: 'POUNDS',
    horizontalDistanceUnit: 'METERS',
    atmosphericPressureUnit: 'HPA',
    temperatureUnit: 'CELSIUS'
  }

  const chosenUnitForLoggedInUser = {
    massUnit: 'POUNDS',
    horizontalDistanceUnit: 'METERS',
    atmosphericPressureUnit: 'HPA',
    temperatureUnit: 'FAHRENHEIT'
  }

  const storedData = new Map<string, string>();
  storedData.set("local_chosenUnit", JSON.stringify(chosenUnitForUnloggedInUser))
  storedData.set("user_testUser_chosenUnit", JSON.stringify(chosenUnitForLoggedInUser))

  const mockLoginRepository = new MockedLoginRepository()
  const mockedUserRepository = new MockedUserRepository()

  beforeEach(() => {

    Object.defineProperty(window, 'localStorage', {
      value: new DummyStorage(storedData),
      writable: true
    });

    repository = new LocalStorageDefaultUnitRepository(mockLoginRepository, mockedUserRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get Chosen Unit', () => {
    test(`Given chosen units that exists in local storage for a user that is logged in,
     when retrieving the default chosen unit,
      then it returns that stored value`, async () => {
      mockLoginRepository.isLoggedIn.mockReturnValue(true)
      mockedUserRepository.getUser.mockReturnValue(of(new User(aUserNicknameThatHasChosenUnit)));
      const result = await repository.getChosenUnit();

      expect(result).toStrictEqual(chosenUnitForLoggedInUser);
    });

    test(`Given chosen units that does not exists in local storage for a user that is logged in,
     when retrieving the default chosen unit,
      then it returns the default value`, async () => {
      mockLoginRepository.isLoggedIn.mockReturnValue(true)
      mockedUserRepository.getUser.mockReturnValue(of(new User(aUserNicknameThatHasNoChosenUnit)));
      const result = await repository.getChosenUnit();

      expect(result).toStrictEqual({
        massUnit: 'KILOGRAMS',
        horizontalDistanceUnit: 'METERS',
        atmosphericPressureUnit: 'HPA',
        temperatureUnit: 'CELSIUS'
      });
    });

    test(`Given chosen units that exists in local storage for a user that is not logged in,
     when retrieving the default chosen unit,
      then it returns that stored value`, async () => {
      mockLoginRepository.isLoggedIn.mockReturnValue(false)
      const result = await repository.getChosenUnit();

      expect(result).toStrictEqual(chosenUnitForUnloggedInUser);
    });
  });

  describe(`Persist Chosen Unit`, () => {
    test(`Given a logged in user,
    when persisting a chosen unit,
    then the chosen unit is stored for this user`, async () => {
      const anotherUserNickname = 'anotherUser';
      const aChosenUnit: ChosenUnit = {
        massUnit: 'POUNDS',
        horizontalDistanceUnit: 'METERS',
        atmosphericPressureUnit: 'INHG',
        temperatureUnit: 'FAHRENHEIT'
      }
      mockLoginRepository.isLoggedIn.mockReturnValue(true)
      mockedUserRepository.getUser.mockReturnValue(of(new User(anotherUserNickname)));

      repository.persistChosenUnit(aChosenUnit);

      const storedValue = repository.getChosenUnit();
      expect(storedValue).resolves.toStrictEqual(aChosenUnit);
    })

    test(`Given a user that is not logged in,
    when persisting a chosen unit,
    then the chosen unit is stored for this user`, async () => {
      const aChosenUnit: ChosenUnit = {
        massUnit: 'POUNDS',
        horizontalDistanceUnit: 'METERS',
        atmosphericPressureUnit: 'INHG',
        temperatureUnit: 'FAHRENHEIT'
      }
      mockLoginRepository.isLoggedIn.mockReturnValue(false);

      repository.persistChosenUnit(aChosenUnit);

      const storedValue = repository.getChosenUnit();
      expect(storedValue).resolves.toStrictEqual(aChosenUnit);
    })
  })
});
