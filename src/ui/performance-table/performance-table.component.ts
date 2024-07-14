import {Component, Input} from '@angular/core';
import {PerformanceDataPoint} from "../../domain/performance-data-point";


@Component({
  selector: 'performance-table',
  standalone: true,
  templateUrl: './performance-table.component.html',
  imports: [],
  providers: [],
  styleUrl: './performance-table.component.css'
})
export class PerformanceTableComponent {

  private _masses: number[] = [];
  private _temperatures: number[] = [];
  private _altitudes: number[] = [];

  private _dataMap: Map<number, Map<number, Map<number, number>>> = new Map();


  @Input()
  set dataPoints(dataPoints: PerformanceDataPoint[]) {
    this._masses = [...new Set(dataPoints.map(dataPoint => dataPoint.massInKg))];
    this._temperatures = [...new Set(dataPoints.map(dataPoint => dataPoint.temperatureInCelsius))];
    this._altitudes = [...new Set(dataPoints.map(dataPoint => dataPoint.altitudePressureInFeet))];

    dataPoints.forEach(dataPoint => {
      if(!this._dataMap.has(dataPoint.massInKg)){
        this._dataMap.set(dataPoint.massInKg, new Map());
      }
      if(!this._dataMap.get(dataPoint.massInKg)?.has(dataPoint.temperatureInCelsius)){
        this._dataMap.get(dataPoint.massInKg)?.set(dataPoint.temperatureInCelsius, new Map());
      }
      this._dataMap.get(dataPoint.massInKg)
        ?.get(dataPoint.temperatureInCelsius)
        ?.set(dataPoint.altitudePressureInFeet, dataPoint.distanceInMeters);
    })
  }

  get masses(): number[] {
    return this._masses;
  }

  get temperatures(): number[] {
    return this._temperatures;
  }

  get altitudes(): number[] {
    return this._altitudes;
  }

  valueAt(mass: number, temperature: number, altitude: number): number {
    return this._dataMap.get(mass)?.get(temperature)?.get(altitude) || 0;
  }
}
