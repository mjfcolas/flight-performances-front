import {fireEvent, render, RenderComponentOptions, screen} from "@testing-library/angular";
import {PlaneCreatorComponent} from "./plane-creator.component";
import {
  validPlanePerformanceViewModel
} from "../plane-performance/view-models/__test__/test-plane-performance-view.model";
import {MockedPlaneRepository} from "../../domain/__mock__/mocked-plane-repository";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {MockPlanePerformanceComponent} from "../plane-performance/__mock__/mock-plane-performance.component";
import {PlaneRepository} from "../../domain/plane.repository";
import {of} from "rxjs";
import {LoginRepository} from "../../domain/user/login.repository";
import {MockedLoginRepository} from "../../domain/user/__mock__/mocked-login.repository";

describe('PlaneCreatorComponent', () => {

  const mockedPlaneRepository = new MockedPlaneRepository();
  mockedPlaneRepository.save.mockReturnValue(of({
    status: "SUCCESS"
  }));

  const mockedLoginRepository = new MockedLoginRepository();
  mockedLoginRepository.isLoggedIn.mockReturnValue(of(true));

  const renderOptions: RenderComponentOptions<PlaneCreatorComponent> = {
    componentImports: [
      MockPlanePerformanceComponent,
      FaIconComponent,
      RouterLink,
      FormsModule
    ],
    componentProviders: [{
      provide: PlaneRepository,
      useValue: mockedPlaneRepository
    },
      {
        provide: LoginRepository,
        useValue: mockedLoginRepository
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
    expect(mockedPlaneRepository.save).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Plane saved')).toBeInTheDocument();
  });
});
