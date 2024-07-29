import {fireEvent, render, RenderComponentOptions, screen} from "@testing-library/angular";
import {PlaneCreatorComponent} from "./plane-creator.component";
import {
  validPlanePerformanceViewModel
} from "../plane-performance/view-models/__test__/test-plane-performance-view.model";
import {CreatePlane} from "../../domain/create-plane/create-plane";
import {MockedCreatePlane} from "../../domain/create-plane/__mock__/mocked-create-plane";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MockPlanePerformanceComponent} from "../plane-performance/__mock__/mock-plane-performance.component";
import {of} from "rxjs";

describe('PlaneCreatorComponent', () => {

  const mockedCreatePlane = new MockedCreatePlane();
  mockedCreatePlane.apply.mockReturnValue(of(null));

  const renderOptions: RenderComponentOptions<PlaneCreatorComponent> = {
    componentImports: [
      MockPlanePerformanceComponent,
      FaIconComponent,
      RouterLink,
      FormsModule
    ],
    componentProviders: [{
      provide: CreatePlane,
      useValue: mockedCreatePlane
    }],
  }

  test(`When rendering plane creator component,
  then save button is disabled`, async () => {
    await render(PlaneCreatorComponent, renderOptions)
    expect(screen.getByRole('button', {name: 'Save'})).toBeDisabled();
  });

  test(`Given rendered plane creator component,
  when filling with valid data and clicking on save button,
  then plane is saved and notification is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    MockPlanePerformanceComponent.emitter.emit(validPlanePerformanceViewModel);
    const registrationInput = screen.getByLabelText('Registration input');
    fireEvent.input(registrationInput, {target: {value: 'F-GHJK'}});
    const nameInput = screen.getByLabelText('Name input');
    fireEvent.input(nameInput, {target: {value: 'Airbus A380'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
    expect(mockedCreatePlane.apply).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Plane saved')).toBeInTheDocument();
  });
});
