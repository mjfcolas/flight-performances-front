import {fireEvent, render, screen} from "@testing-library/angular";
import {PerformanceTableComponent} from "./performance-table.component";
import {PerformanceDataPointViewModel} from "../view-models/plane-performances-view.model";
import {Mass} from "../../../domain/mass";
import {Distance} from "../../../domain/distance";

describe('PerformanceTableComponent', () => {

  const performanceDataPoints: PerformanceDataPointViewModel[] = [
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 0,
      temperatureInCelsius: -20,
      mass: Mass.forValueAndUnit(850, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(340, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 0,
      temperatureInCelsius: -20,
      mass: Mass.forValueAndUnit(1050, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(530, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 0,
      temperatureInCelsius: 0,
      mass: Mass.forValueAndUnit(850, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(375, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 0,
      temperatureInCelsius: 0,
      mass: Mass.forValueAndUnit(1050, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(590, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 0,
      temperatureInCelsius: 20,
      mass: Mass.forValueAndUnit(850, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(415, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 0,
      temperatureInCelsius: 20,
      mass: Mass.forValueAndUnit(1050, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(655, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 4000,
      temperatureInCelsius: -20,
      mass: Mass.forValueAndUnit(850, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(445, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 4000,
      temperatureInCelsius: -20,
      mass: Mass.forValueAndUnit(1050, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(710, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 4000,
      temperatureInCelsius: 0,
      mass: Mass.forValueAndUnit(850, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(500, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 4000,
      temperatureInCelsius: 0,
      mass: Mass.forValueAndUnit(1050, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(800, "METERS")

    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 4000,
      temperatureInCelsius: 20,
      mass: Mass.forValueAndUnit(850, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(550, "METERS")
    }),
    new PerformanceDataPointViewModel({
      pressureAltitudeInFeet: 4000,
      temperatureInCelsius: 20,
      mass: Mass.forValueAndUnit(1050, 'KILOGRAMS'),
      distance: Distance.forValueAndUnit(890, "METERS")
    })
  ];

  describe(`Read only table`, () => {


    test(`Given an array of performance data points,
  when rendering the performance table in readonly mode,
  then the performance table displays performance data points`, async () => {
      await render(PerformanceTableComponent, {
        componentInputs: {
          dataPoints: performanceDataPoints,
          mode: 'READ_ONLY'
        }
      })

      expect(screen.getByRole('columnheader', {
        name: '850 kg (m)'
      })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', {
        name: '1050 kg (m)'
      })).toBeInTheDocument();
      expect(screen.getByRole('cell', {
        name: '0'
      })).toBeInTheDocument();
      expect(screen.getByRole('cell', {
        name: '4000'
      })).toBeInTheDocument();
      expect(screen.getByRole('cell', {
        name: 'Std = 15'
      })).toBeInTheDocument();
      expect(screen.getByRole('cell', {
        name: '655'
      })).toBeInTheDocument();
    })
  })

  describe(`Editable table`, () => {
    test(`Given no performance data points,
    when rendering the performance table in editable mode,
    then a form is displayed to allow the user to add a new performance data point`, async () => {
      await render(PerformanceTableComponent, {
        componentInputs: {
          dataPoints: [],
          mode: 'EDIT'
        }
      })

      expect(screen.getByLabelText(/Altitude/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Diff with ISA Temp/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Mass/)).toBeInTheDocument();
    })

    test(`Given no performance data points,
    when rendering the performance table in editable mode,
    then standard temperature at 0ft is already preloaded`, async () => {
      await render(PerformanceTableComponent, {
        componentInputs: {
          dataPoints: [],
          mode: 'EDIT'
        }
      })
      expect(screen.getByRole('cell', {
        name: 'Std = 15'
      })).toBeInTheDocument();

    });

    test(`Given a rendered editable performance table,
  when adding an altitude, a temperature and a mass,
  then the table display an input in the performance table`, async () => {
      await render(PerformanceTableComponent, {
        componentInputs: {
          dataPoints: [],
          mode: 'EDIT'
        }
      })
      enterValues('0', '0', '850');
      expect(screen.getByLabelText('850 Kg at 0 °C and 0 ft')).toBeInTheDocument();
    });

    test(`Given a rendered editable performance table,
    when filling an altitude and then clearing the input,
    then the add button is disabled`, async () => {
      await render(PerformanceTableComponent, {
        componentInputs: {
          dataPoints: [],
          mode: 'EDIT'
        }
      })
      enterValues('0', '0', '850');
      enterValues('', '0', '850');
      expect(screen.getByRole('button', {
        name: 'Add altitude'
      })).toBeDisabled();
    });

    test(`Given a rendered editable performance table with two unfilled available cells,
    when filling one cell,
    then data points with values are emitted to the parent component`, async () => {
      const emittedDataPoints = jest.fn();
      await render(PerformanceTableComponent, {
        componentInputs: {
          dataPoints: [],
          mode: 'EDIT'
        },
        on: {
          emittedDataPoints
        }
      })
      enterValues('0', '0', '850');
      enterValues('0', '0', '900');
      const inputToFill = screen.getByLabelText('850 Kg at 0 °C and 0 ft');
      fireEvent.input(inputToFill, {
        target: {
          value: 400
        }
      });
      expect(emittedDataPoints).toHaveBeenCalledWith([new PerformanceDataPointViewModel({
        pressureAltitudeInFeet: 0,
        temperatureInCelsius: 0,
        mass: Mass.forValueAndUnit(850, "KILOGRAMS"),
        distance: Distance.forValueAndUnit(400, "METERS")
      })]);
    });
  });

  function enterValues(altitude: string, temperature: string, mass: string) {
    const altitudeInput = screen.getByLabelText(/Altitude/);
    const temperatureInput = screen.getByLabelText(/Diff with ISA Temp/,);
    const massInput = screen.getByLabelText(/Mass/);

    fireEvent.input(altitudeInput, {
      target: {
        value: altitude
      }
    });
    fireEvent.click(screen.getByRole('button', {
      name: 'Add altitude'
    }));
    fireEvent.input(temperatureInput, {
      target: {
        value: temperature
      }
    });
    fireEvent.click(screen.getByRole('button', {
      name: 'Add temperature'
    }));
    fireEvent.input(massInput, {
      target: {
        value: mass
      }
    });
    fireEvent.click(screen.getByRole('button', {
      name: 'Add mass'
    }));
  }
});
