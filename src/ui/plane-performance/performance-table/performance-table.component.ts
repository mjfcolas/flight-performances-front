import {Component, EventEmitter, Input, Output} from '@angular/core';
import {UiMode} from "../../ui-mode";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {pushAtSortPosition} from "array-push-at-sort-position";
import {PerformanceDataPointViewModel} from "../view-models/plane-performances-view.model";
import {Temperature} from "../../../domain/temperature";
import {TemperatureMode} from "../../../domain/plane";
import {Distance, DistanceUnit} from "../../../domain/distance";
import {Mass, MassUnit} from "../../../domain/mass";

@Component({
  selector: 'performance-table',
  standalone: true,
  templateUrl: './performance-table.component.html',
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  providers: []
})
export class PerformanceTableComponent {

  private _massesInKg: number[] = [];
  private _temperatures: number[] = [];
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

  private _horizontalDistanceUnit: DistanceUnit = 'METERS';

  @Input()
  set horizontalDistanceUnit(distanceUnit: DistanceUnit) {
    this._horizontalDistanceUnit = distanceUnit;
    if (distanceUnit == 'METERS') {
      this.horizontalDistanceUnitLabel = 'm';
    } else {
      this.horizontalDistanceUnitLabel = 'ft';
    }
  };

  get horizontalDistanceUnit() {
    return this._horizontalDistanceUnit;
  }

  private _massUnit: MassUnit = 'KILOGRAMS';

  @Input()
  set massUnit(massUnit: MassUnit) {
    this._massUnit = massUnit;
    if (massUnit == 'KILOGRAMS') {
      this.massUnitLabel = 'kg';
    } else {
      this.massUnitLabel = 'lb';
    }
  };

  get massUnit() {
    return this._massUnit;
  }

  horizontalDistanceUnitLabel: string = 'm';
  massUnitLabel: string = 'kg';

  @Input()
  set dataPoints(dataPoints: PerformanceDataPointViewModel[]) {

    this._massesInKg = [...new Set([...this._massesInKg, ...dataPoints.map(dataPoint => dataPoint.mass.valueIn("KILOGRAMS"))].sort((a, b) => a - b))];
    this._altitudes = [...new Set([...this._altitudes, ...dataPoints.map(dataPoint => dataPoint.pressureAltitudeInFeet)].sort((a, b) => a - b))];
    if (this._altitudes.length == 0) {
      this._altitudes = [0];
    }
    this._temperatures = [...new Set([...this._temperatures, ...dataPoints.map(dataPoint => dataPoint.temperatureInCelsius)].sort((a, b) => a - b))];
    if (this._temperatures.length == 0) {
      this._temperatures = [0];
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

  get temperatures(): number[] {
    return this._temperatures;
  }

  valueAt(massInKg: number, temperature: number, altitude: number): string | undefined {
    return this._dataMap.get(massInKg)?.get(temperature)?.get(altitude)?.valueIn(this._horizontalDistanceUnit)?.toFixed(0) || undefined;
  }

  setValueAt(massInKg: number, temperature: number, altitude: number, value: number) {
    this.addPerformanceDataPointToMap(new PerformanceDataPointViewModel({
      mass: Mass.forValueAndUnit(massInKg, 'KILOGRAMS'),
      temperatureInCelsius: temperature,
      pressureAltitudeInFeet: altitude,
      distance: Distance.forValueAndUnit(value, this._horizontalDistanceUnit)
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

  temperatureLabelAt(altitudeInFeet: number, temperature: number): string {

    if (this.temperatureMode == 'ISA') {
      const absoluteTemperature = Temperature.ISATemperatureAt(altitudeInFeet).valueInCelsius + temperature;
      return `${temperature === 0 ? 'Std = ' : ''} ${absoluteTemperature.toFixed(0)}`;
    } else {
      return `${temperature.toFixed(0)}`;
    }

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
    const temperaturesToUpdate = this._temperatures;
    pushAtSortPosition(temperaturesToUpdate, newTemperature, (a, b) => a > b ? 1 : a < b ? -1 : 0, 0);
    this._temperatures = [...new Set(temperaturesToUpdate)];
  }

  private updateMasses(newMass: number) {
    const massesToUpdate = this._massesInKg;
    pushAtSortPosition(massesToUpdate, Mass.forValueAndUnit(newMass, this._massUnit).valueIn("KILOGRAMS"), (a, b) => a > b ? 1 : a < b ? -1 : 0, 0);
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
