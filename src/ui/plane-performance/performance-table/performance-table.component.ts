import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DecimalPipe} from "@angular/common";
import {Temperature} from "../../../domain/temperature";
import {UiMode} from "../../ui-mode";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {pushAtSortPosition} from "array-push-at-sort-position";
import {PerformanceDataPointViewModel} from "../view-models/plane-performances-view.model";


const exampleDataPoints: PerformanceDataPointViewModel[] = [
  // {
  //   "massInKg": 800,
  //   "temperatureInCelsius": 0,
  //   "pressureAltitudeInFeet": 4000,
  //   "distanceInMeters": 800
  // },
  // {
  //   "massInKg": 800,
  //   "temperatureInCelsius": -15,
  //   "pressureAltitudeInFeet": 4000,
  //   "distanceInMeters": 700
  // },
  // {
  //   "massInKg": 800,
  //   "temperatureInCelsius": 15,
  //   "pressureAltitudeInFeet": 4000,
  //   "distanceInMeters": 900
  // },
  // {
  //   "massInKg": 900,
  //   "temperatureInCelsius": 15,
  //   "pressureAltitudeInFeet": 4000,
  //   "distanceInMeters": 800
  // },
  // {
  //   "massInKg": 1000,
  //   "temperatureInCelsius": 15,
  //   "pressureAltitudeInFeet": 4000,
  //   "distanceInMeters": 800
  // },
  // {
  //   "pressureAltitudeInFeet": 4000,
  //   "temperatureInCelsius": 15,
  //   "massInKg": 1000,
  //   "distanceInMeters": 800
  // }
]

@Component({
  selector: 'performance-table',
  standalone: true,
  templateUrl: './performance-table.component.html',
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: []
})
export class PerformanceTableComponent {

  private _masses: number[] = [];
  private _temperatures: number[] = [];
  private _altitudes: number[] = [];

  private _dataMap: Map<number, Map<number, Map<number, (number | null | undefined)>>> = new Map();

  currentAltitude?: number | null;
  currentTemperature?: number | null;
  currentMass?: number | null;

  @Output()
  emittedDataPoints: EventEmitter<PerformanceDataPointViewModel[]> = new EventEmitter<PerformanceDataPointViewModel[]>()

  @Input()
  mode: UiMode = 'READ_ONLY';

  @Input()
  set dataPoints(dataPoints: PerformanceDataPointViewModel[]) {
    if (dataPoints.length == 0) {
      dataPoints = exampleDataPoints
    }

    this._masses = [...new Set(dataPoints.map(dataPoint => dataPoint.massInKg).sort((a, b) => a - b))];
    this._altitudes = [...new Set(dataPoints.map(dataPoint => dataPoint.pressureAltitudeInFeet).sort((a, b) => a - b))];
    if (this._altitudes.length == 0) {
      this._altitudes = [0];
    }
    this._temperatures = [...new Set(dataPoints.map(dataPoint => dataPoint.temperatureInCelsius).sort((a, b) => a - b))];
    if (this._temperatures.length == 0) {
      this._temperatures = [0];
    }
    dataPoints.forEach(dataPoint => {
      this.addPerformanceDataPointToMap(dataPoint);
    })
  }

  get masses(): number[] {
    return this._masses;
  }

  get altitudes(): number[] {
    return this._altitudes;
  }

  get temperatures(): number[] {
    return this._temperatures;
  }

  valueAt(mass: number, temperature: number, altitude: number): number | undefined {
    return this._dataMap.get(mass)?.get(temperature)?.get(altitude) || undefined;
  }


  setValueAt(mass: number, temperature: number, altitude: number, value: number) {
    this.addPerformanceDataPointToMap(new PerformanceDataPointViewModel({
      massInKg: mass,
      temperatureInCelsius: temperature,
      pressureAltitudeInFeet: altitude,
      distanceInMeters: value
    }))
    this.emitDataPoints();
  }

  ISATemperatureAt(altitudeInFeet: number): number {
    return Temperature.ISATemperatureAt(altitudeInFeet).valueInCelsius;
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

  private addPerformanceDataPointToMap(dataPoint: PerformanceDataPointViewModel) {
    if (!this._dataMap.has(dataPoint.massInKg)) {
      this._dataMap.set(dataPoint.massInKg, new Map());
    }
    if (!this._dataMap.get(dataPoint.massInKg)?.has(dataPoint.temperatureInCelsius)) {
      this._dataMap.get(dataPoint.massInKg)?.set(dataPoint.temperatureInCelsius, new Map());
    }
    this._dataMap.get(dataPoint.massInKg)
      ?.get(dataPoint.temperatureInCelsius)
      ?.set(dataPoint.pressureAltitudeInFeet, dataPoint.distanceInMeters);
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
    const massesToUpdate = this._masses;
    pushAtSortPosition(massesToUpdate, newMass, (a, b) => a > b ? 1 : a < b ? -1 : 0, 0);
    this._masses = [...new Set(massesToUpdate)];
  }

  private emitDataPoints() {
    const dataPoints: PerformanceDataPointViewModel[] = [];
    this._dataMap.forEach((temperaturesMap, mass) => {
      temperaturesMap.forEach((altitudesMap, temperature) => {
        altitudesMap.forEach((value, altitude) => {
          if (value == undefined) {
            return;
          }
          dataPoints.push(new PerformanceDataPointViewModel({
            massInKg: mass,
            temperatureInCelsius: temperature,
            pressureAltitudeInFeet: altitude,
            distanceInMeters: value
          }))
        })
      })
    })
    this.emittedDataPoints.emit(dataPoints);
  }
}
