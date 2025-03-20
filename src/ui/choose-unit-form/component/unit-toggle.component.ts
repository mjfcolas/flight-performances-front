import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'unit-toggle',
  standalone: true,
  templateUrl: './unit-toggle.component.html',
  imports: [
    FormsModule,
  ],
  providers: []
})
export class UnitToggleComponent {

  @Input()
  firstUnitLabel: string = '';

  @Input()
  secondUnitLabel: string = '';

  _firstUnitValue: string = '';
  @Input()
  set firstUnitValue(value: string) {
    this._firstUnitValue = value;
    this.toggleValue = this._chosenUnit === this._secondUnitValue;
  };

  _secondUnitValue: string = '';
  @Input()
  set secondUnitValue(value: string) {
    this._secondUnitValue = value;
    this.toggleValue = this._chosenUnit === this._secondUnitValue;
  };

  _chosenUnit: string = '';
  @Input()
  set chosenUnit(chosenUnit: string) {
    this._chosenUnit = chosenUnit;
    this.toggleValue = chosenUnit === this._secondUnitValue;
  }

  toggleValue: boolean = false;

  @Output()
  readonly output: EventEmitter<string> = new EventEmitter<string>();
  @Input() labelText!: string;


  constructor() {
  }

  public emitNewUnit(): void {
    this._chosenUnit = this.toggleValue ? this._secondUnitValue : this._firstUnitValue;
    this.output.emit(this._chosenUnit)
  }
}
