import { LocalStorageDefaultUnitRepository } from './local-storage-default-unit.repository';

describe('LocalStorageDefaultUnitRepository', () => {
  let repository: LocalStorageDefaultUnitRepository;
  let localStorageMock: Storage;

  beforeEach(() => {
    // Create a mock for localStorage
    localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });

    repository = new LocalStorageDefaultUnitRepository();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Mass unit', () => {
    test('Given a mass unit exists in local storage, when retrieving the default mass unit, then it should return that stored value', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue('KILOGRAMS');

      const result = repository.getMassUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('massUnit');
      expect(result).toBe('KILOGRAMS');
    });

    test('Given no mass unit in local storage, when retrieving the default mass unit, then it should return "KILOGRAMS"', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue(null);

      const result = repository.getMassUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('massUnit');
      expect(result).toBe('KILOGRAMS');
    });
  });

  describe('Horizontal distance unit', () => {
    test('Given a horizontal distance unit exists in local storage, when retrieving the default unit, then it should return that stored value', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue('FEET');

      const result = repository.getHorizontalDistanceUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('horizontalDistanceUnit');
      expect(result).toBe('FEET');
    });

    test('Given no horizontal distance unit in local storage, when retrieving the default unit, then it should return "METERS"', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue(null);

      const result = repository.getHorizontalDistanceUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('horizontalDistanceUnit');
      expect(result).toBe('METERS');
    });
  });

  describe('Atmospheric pressure unit', () => {
    test('Given an atmospheric pressure unit exists in local storage, when retrieving the default unit, then it should return that stored value', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue('INHG');

      const result = repository.getAtmosphericPressureUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('atmosphericPressureUnit');
      expect(result).toBe('INHG');
    });

    test('Given no atmospheric pressure unit in local storage, when retrieving the default unit, then it should return "HPA"', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue(null);

      const result = repository.getAtmosphericPressureUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('atmosphericPressureUnit');
      expect(result).toBe('HPA');
    });
  });

  describe('Temperature unit', () => {
    test('Given a temperature unit exists in local storage, when retrieving the default unit, then it should return that stored value', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue('FAHRENHEIT');

      const result = repository.getTemperatureUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('temperatureUnit');
      expect(result).toBe('FAHRENHEIT');
    });

    test('Given no temperature unit in local storage, when retrieving the default unit, then it should return "CELSIUS"', () => {
      localStorageMock.getItem = jest.fn().mockReturnValue(null);

      const result = repository.getTemperatureUnit();

      expect(localStorageMock.getItem).toHaveBeenCalledWith('temperatureUnit');
      expect(result).toBe('CELSIUS');
    });
  });
});
