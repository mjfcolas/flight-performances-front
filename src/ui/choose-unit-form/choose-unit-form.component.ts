import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {ChosenUnit} from "../../domain/physical-quantity/chosen-unit";
import {isMassUnit} from "../../domain/physical-quantity/mass";
import {isDistanceUnit} from "../../domain/physical-quantity/distance";
import {isAtmosphericPressureUnit} from "../../domain/physical-quantity/atmospheric-pressure";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {UnitToggleComponent} from "./component/unit-toggle.component";
import {isTemperatureUnit} from "../../domain/physical-quantity/temperature";


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
export class ChooseUnitFormComponent {

  @Output()
  readonly output: EventEmitter<ChosenUnit> = new EventEmitter<ChosenUnit>();

  chosenUnit: ChosenUnit | undefined

  constructor(private readonly defaultUnitProvider: DefaultUnitRepository) {
    defaultUnitProvider.getChosenUnit().then(chosenUnit => {
      this.chosenUnit = chosenUnit
    });
  }

  public emitNewValues(): void {
    if (this.chosenUnit === undefined) {
      return;
    }
    this.defaultUnitProvider.persistChosenUnit(this.chosenUnit);
    this.output.emit(this.chosenUnit)
  }

  massUnitChanged(massUnit: any) {
    if (isMassUnit(massUnit) && this.chosenUnit) {
      this.chosenUnit = {
        ...this.chosenUnit,
        massUnit: massUnit
      };
      this.emitNewValues();
    }
  }

  horizontalDistanceUnitChanged(horizontalDistanceUnit: any) {
    if (isDistanceUnit(horizontalDistanceUnit) && this.chosenUnit) {
      this.chosenUnit = {
        ...this.chosenUnit,
        horizontalDistanceUnit: horizontalDistanceUnit
      }
      this.emitNewValues();
    }
  }

  atmosphericPressureUnitChanged(atmosphericPressureUnit: any) {
    if (isAtmosphericPressureUnit(atmosphericPressureUnit) && this.chosenUnit) {
      this.chosenUnit = {
        ...this.chosenUnit,
        atmosphericPressureUnit: atmosphericPressureUnit
      }
      this.emitNewValues();
    }
  }

  temperatureUnitChanged(temperatureUnit: any) {
    if (isTemperatureUnit(temperatureUnit) && this.chosenUnit) {
      this.chosenUnit = {
        ...this.chosenUnit,
        temperatureUnit: temperatureUnit
      }
      this.emitNewValues();
    }
  }
}
