import {DefaultUnitRepository} from "../default-unit.repository";
import {AtmosphericPressureUnit} from "../atmospheric-pressure";
import {DistanceUnit} from "../distance";
import {TemperatureUnit} from "../temperature";
import {MassUnit} from "../mass";

export class MockedDefaultUnitRepository implements DefaultUnitRepository {
  getAtmosphericPressureUnit(): AtmosphericPressureUnit {
    return 'HPA';
  }

  getHorizontalDistanceUnit(): DistanceUnit {
    return 'METERS';
  }

  getMassUnit(): MassUnit {
    return 'KILOGRAMS';
  }

  getTemperatureUnit(): TemperatureUnit {
    return 'CELSIUS';
  }
}
