import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {MassUnit} from "../../domain/physical-quantity/mass";
import {DistanceUnit} from "../../domain/physical-quantity/distance";
import {AtmosphericPressureUnit} from "../../domain/physical-quantity/atmospheric-pressure";
import {TemperatureUnit} from "../../domain/physical-quantity/temperature";

export class LocalStorageDefaultUnitRepository implements DefaultUnitRepository {

  private readonly localStorage: Storage = window.localStorage;

  getMassUnit(): MassUnit {
    return this.localStorage.getItem('massUnit') as MassUnit || 'KILOGRAMS';
  }

  getHorizontalDistanceUnit(): DistanceUnit {
    return this.localStorage.getItem('horizontalDistanceUnit') as DistanceUnit || 'METERS';
  }

  getAtmosphericPressureUnit(): AtmosphericPressureUnit {
    return this.localStorage.getItem('atmosphericPressureUnit') as AtmosphericPressureUnit || 'HPA';
  }

  getTemperatureUnit(): TemperatureUnit {
    return this.localStorage.getItem('temperatureUnit') as TemperatureUnit || 'CELSIUS';
  }
}
