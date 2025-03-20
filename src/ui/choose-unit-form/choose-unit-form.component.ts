import {AfterViewInit, Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ChosenUnit} from "../units/chosen-unit";
import {isMassUnit, MassUnit} from "../../domain/physical-quantity/mass";
import {DistanceUnit, isDistanceUnit} from "../../domain/physical-quantity/distance";
import {AtmosphericPressureUnit, isAtmosphericPressureUnit} from "../../domain/physical-quantity/atmospheric-pressure";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {UnitToggleComponent} from "./component/unit-toggle.component";
import {isTemperatureUnit, TemperatureUnit} from "../../domain/physical-quantity/temperature";


@Component({
  selector: 'choose-unit-form',
  standalone: true,
  templateUrl: './choose-unit-form.component.html',
  imports: [
    FormsModule,
    UnitToggleComponent,
  ],
  providers: []
})
export class ChooseUnitFormComponent implements AfterViewInit {

  @Output()
  readonly output: EventEmitter<ChosenUnit> = new EventEmitter<ChosenUnit>();

  massUnit: MassUnit;
  horizontalDistanceUnit: DistanceUnit;
  atmosphericPressureUnit: AtmosphericPressureUnit;
  temperatureUnit: TemperatureUnit;

  constructor(private readonly defaultUnitProvider: DefaultUnitRepository) {
    this.massUnit = defaultUnitProvider.getMassUnit();
    this.horizontalDistanceUnit = defaultUnitProvider.getHorizontalDistanceUnit();
    this.atmosphericPressureUnit = defaultUnitProvider.getAtmosphericPressureUnit();
    this.temperatureUnit = defaultUnitProvider.getTemperatureUnit();
  }

  ngAfterViewInit(): void {
    this.emitNewValues();
  }

  public emitNewValues(): void {
    this.output.emit({
      massUnit: this.massUnit,
      horizontalDistanceUnit: this.horizontalDistanceUnit,
      atmosphericPressureUnit: this.atmosphericPressureUnit,
      temperatureUnit: this.temperatureUnit
    })
  }

  massUnitChanged(massUnit: any) {
    if (isMassUnit(massUnit)) {
      this.massUnit = massUnit;
      this.emitNewValues();
    }
  }

  horizontalDistanceUnitChanged(horizontalDistanceUnit: any) {
    if (isDistanceUnit(horizontalDistanceUnit)) {
      this.horizontalDistanceUnit = horizontalDistanceUnit;
      this.emitNewValues();
    }
  }

  atmosphericPressureUnitChanged(atmosphericPressureUnit: any) {
    if (isAtmosphericPressureUnit(atmosphericPressureUnit)) {
      this.atmosphericPressureUnit = atmosphericPressureUnit;
      this.emitNewValues();
    }
  }

  temperatureUnitChanged(temperatureUnit: any) {
    if (isTemperatureUnit(temperatureUnit)) {
      this.temperatureUnit = temperatureUnit;
      this.emitNewValues();
    }
  }
}
