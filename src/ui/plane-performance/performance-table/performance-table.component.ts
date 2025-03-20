import {Component, EventEmitter, Inject, Input, LOCALE_ID, Output} from '@angular/core';
import {UiMode} from "../../ui-mode";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {pushAtSortPosition} from "array-push-at-sort-position";
import {PerformanceDataPointViewModel} from "../view-models/plane-performances-view.model";
import {Temperature, TemperatureDifference} from "../../../domain/physical-quantity/temperature";
import {TemperatureMode} from "../../../domain/plane";
import {Distance} from "../../../domain/physical-quantity/distance";
import {Mass} from "../../../domain/physical-quantity/mass";
import {ChosenUnit} from "../../units/chosen-unit";
import {DisplayTemperatureUnitPipe} from "../../units/display-temperature-unit.pipe";
import {DisplayMassUnitPipe} from "../../units/display-mass-unit.pipe";
import {DisplayMassPipe} from "../../units/display-mass.pipe";
import {DisplayDistanceUnitPipe} from "../../units/display-distance-unit.pipe";
import {formatTemperature} from "../../units/format-physical-value";

@Component({
  selector: 'performance-table',
  standalone: true,
  templateUrl: './performance-table.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DisplayTemperatureUnitPipe,
    DisplayMassUnitPipe,
    DisplayMassPipe,
    DisplayDistanceUnitPipe
  ],
  providers: []
})
export class PerformanceTableComponent {

  private _massesInKg: number[] = [];
  private _temperaturesInCelsius: number[] = [];
  private _altitudes: number[] = [];

  private _dataMap: Map<number, Map<number, Map<number, (Distance | null | undefined)>>> = new Map();

  currentAltitude?: number | null;
  currentTemperature?: number | null;
  currentMass?: number | null;

  @Output()
  emittedDataPoints: EventEmitter<PerformanceDataPointViewModel[]> = new EventEmitter<PerformanceDataPointViewModel[]>()

  @Input()
  mode: UiMode = 'READ_ONLY';

  @Input()
  temperatureMode: TemperatureMode = 'ISA';

  @Input()
  chosenUnit: ChosenUnit | undefined;

  @Input()
  set dataPoints(dataPoints: PerformanceDataPointViewModel[]) {

    this._massesInKg = [...new Set([
      ...this._massesInKg,
      ...dataPoints.map(dataPoint => dataPoint.mass.valueIn("KILOGRAMS"))]
      .sort((a, b) => a - b))
    ];
    this._altitudes = [...new Set([
      ...this._altitudes,
      ...dataPoints.map(dataPoint => dataPoint.pressureAltitudeInFeet)]
      .sort((a, b) => a - b))
    ];
    if (this._altitudes.length == 0) {
      this._altitudes = [0];
    }
    this._temperaturesInCelsius = [...new Set([
      ...this._temperaturesInCelsius,
      ...dataPoints.map(dataPoint => dataPoint.temperatureInCelsius)]
      .sort((a, b) => a - b))
    ];
    if (this._temperaturesInCelsius.length == 0) {
      this._temperaturesInCelsius = [0];
    }
    dataPoints.forEach(dataPoint => {
      this.addPerformanceDataPointToMap(dataPoint);
    })
  }

  get massesInKg(): number[] {
    return this._massesInKg;
  }

  get altitudes(): number[] {
    return this._altitudes;
  }

  get temperaturesInCelsius(): number[] {
    return this._temperaturesInCelsius;
  }

  constructor(@Inject(LOCALE_ID) private locale: string) {
  }

  valueAt(massInKg: number, temperature: number, altitude: number): string | undefined {
    if (this.chosenUnit === undefined) {
      return undefined;
    }
    return this._dataMap.get(massInKg)?.get(temperature)?.get(altitude)?.valueIn(this.chosenUnit.horizontalDistanceUnit)?.toFixed(0) || undefined;
  }

  setValueAt(massInKg: number, temperatureInCelsius: number, altitude: number, value: number) {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.addPerformanceDataPointToMap(new PerformanceDataPointViewModel({
      mass: Mass.forValueAndUnit(massInKg, 'KILOGRAMS'),
      temperatureInCelsius: temperatureInCelsius,
      pressureAltitudeInFeet: altitude,
      distance: Distance.forValueAndUnit(value, this.chosenUnit.horizontalDistanceUnit)
    }))
    this.emitDataPoints();
  }

  addAltitude() {
    if (this.currentAltitude != undefined) {
      this.updateAltitudes(this.currentAltitude);
    }
  }

  addTemp() {
    if (this.currentTemperature != undefined) {
      this.updateTemperatures(this.currentTemperature);
    }
  }

  addMass() {
    if (this.currentMass != undefined) {
      this.updateMasses(this.currentMass);
    }
  }

  temperatureLabelAt(altitudeInFeet: number, temperatureInCelsius: number): string {

    if (this.chosenUnit === undefined) {
      return '';
    }

    let absoluteTemperature;
    if (this.temperatureMode == 'ISA') {
      absoluteTemperature = Temperature.ISATemperatureAt(altitudeInFeet).add(TemperatureDifference.forValueAndUnit(temperatureInCelsius, 'CELSIUS'));
    } else {
      absoluteTemperature = Temperature.forValueAndUnit(temperatureInCelsius, 'CELSIUS')
    }
    return formatTemperature(absoluteTemperature, this.chosenUnit.temperatureUnit, this.locale);

  }

  private addPerformanceDataPointToMap(dataPoint: PerformanceDataPointViewModel) {
    if (!this._dataMap.has(dataPoint.mass.valueIn("KILOGRAMS"))) {
      this._dataMap.set(dataPoint.mass.valueIn("KILOGRAMS"), new Map());
    }
    if (!this._dataMap.get(dataPoint.mass.valueIn("KILOGRAMS"))?.has(dataPoint.temperatureInCelsius)) {
      this._dataMap.get(dataPoint.mass.valueIn("KILOGRAMS"))?.set(dataPoint.temperatureInCelsius, new Map());
    }
    this._dataMap.get(dataPoint.mass.valueIn("KILOGRAMS"))
      ?.get(dataPoint.temperatureInCelsius)
      ?.set(dataPoint.pressureAltitudeInFeet, dataPoint.distance);
  }

  private updateAltitudes(newAltitude: number) {
    const altitudesToUpdate = this._altitudes;
    pushAtSortPosition(altitudesToUpdate, newAltitude, (a, b) => a > b ? 1 : a < b ? -1 : 0, 0);
    this._altitudes = [...new Set(altitudesToUpdate)];
  }

  private updateTemperatures(newTemperature: number) {
    if (this.chosenUnit === undefined) {
      return;
    }
    const temperaturesToUpdate = this._temperaturesInCelsius;
    const newTemperatureInCelsius = Temperature.forValueAndUnit(newTemperature, this.chosenUnit.temperatureUnit).valueIn("CELSIUS");
    pushAtSortPosition(temperaturesToUpdate, newTemperatureInCelsius, (a, b) => a > b ? 1 : a < b ? -1 : 0, 0);
    this._temperaturesInCelsius = [...new Set(temperaturesToUpdate)];
  }

  private updateMasses(newMass: number) {
    if (this.chosenUnit === undefined) {
      return;
    }
    const massesToUpdate = this._massesInKg;
    const newMassInKg = Mass.forValueAndUnit(newMass, this.chosenUnit.massUnit).valueIn("KILOGRAMS");
    pushAtSortPosition(massesToUpdate, newMassInKg, (a, b) => a > b ? 1 : a < b ? -1 : 0, 0);
    this._massesInKg = [...new Set(massesToUpdate)];
  }

  private emitDataPoints() {
    const dataPoints: PerformanceDataPointViewModel[] = [];
    this._dataMap.forEach((temperaturesMap, massInKg) => {
      temperaturesMap.forEach((altitudesMap, temperature) => {
        altitudesMap.forEach((value, altitude) => {
          if (value == undefined) {
            return;
          }
          dataPoints.push(new PerformanceDataPointViewModel({
            mass: Mass.forValueAndUnit(massInKg, "KILOGRAMS"),
            temperatureInCelsius: temperature,
            pressureAltitudeInFeet: altitude,
            distance: value
          }))
        })
      })
    })
    this.emittedDataPoints.emit(dataPoints);
  }

  protected readonly Mass = Mass;
}
