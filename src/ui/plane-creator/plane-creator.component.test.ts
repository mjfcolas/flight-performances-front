import {fireEvent, render, RenderComponentOptions, screen} from "@testing-library/angular";
import {PlaneCreatorComponent} from "./plane-creator.component";
import {
  planePerformanceViewModelWithMissingLandingWindCoefficient,
  planePerformanceViewModelWithMissingRunwayFactor,
  planePerformanceViewModelWithMissingTakeOffWindCoefficient,
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
import {UserRepository} from "../../domain/user/user.repository";
import {MockedUserRepository} from "../../domain/user/__mock__/mocked-user.repository";
import {AsyncPipe} from "@angular/common";
import {DefaultUnitRepository} from "../../domain/physical-quantity/default-unit.repository";
import {MockedDefaultUnitRepository} from "../../domain/physical-quantity/__mock__/mocked-default-unit.repository";

describe('PlaneCreatorComponent', () => {

  const mockedPlaneRepository = new MockedPlaneRepository();
  mockedPlaneRepository.save.mockReturnValue(of({
    status: "SUCCESS"
  }));

  const mockedLoginRepository = new MockedLoginRepository();
  mockedLoginRepository.isLoggedIn.mockReturnValue(of(true));

  const mockedUserRepository = new MockedUserRepository();
  mockedUserRepository.getUser.mockReturnValue(of({
    nickname: 'John'
  }));

  const renderOptions: RenderComponentOptions<PlaneCreatorComponent> = {
    componentImports: [
      MockPlanePerformanceComponent,
      FaIconComponent,
      RouterLink,
      FormsModule,
      AsyncPipe
    ],
    componentProviders: [
      {
        provide: PlaneRepository,
        useValue: mockedPlaneRepository
      },
      {
        provide: LoginRepository,
        useValue: mockedLoginRepository
      },
      {
        provide: UserRepository,
        useValue: mockedUserRepository
      },
      {
        provide: DefaultUnitRepository,
        useValue: new MockedDefaultUnitRepository()
      }
    ],
  }

  test(`When rendering plane creator component,
  then save button is enabled`, async () => {
    await render(PlaneCreatorComponent, renderOptions)
    expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled();
  });

  test(`Given unfilled registration,
  when saving the plane,
  then expected error message is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    MockPlanePerformanceComponent.emitter.emit(validPlanePerformanceViewModel);
    const nameInput = screen.getByLabelText('Name input');
    fireEvent.input(nameInput, {target: {value: 'Airbus A380'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
    expect(screen.getByText('Plane registration is mandatory')).toBeInTheDocument();
  });

  test(`Given unfilled name,
  when saving the plane,
  then expected error message is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    MockPlanePerformanceComponent.emitter.emit(validPlanePerformanceViewModel);
    const registrationInput = screen.getByLabelText('Registration input');
    fireEvent.input(registrationInput, {target: {value: 'F-GHJK'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
    expect(screen.getByText('Plane name is mandatory')).toBeInTheDocument();
  });

  test(`Given unfilled runway coefficient,
  when saving the plane,
  then expected error message is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    MockPlanePerformanceComponent.emitter.emit(planePerformanceViewModelWithMissingRunwayFactor);
    const registrationInput = screen.getByLabelText('Registration input');
    fireEvent.input(registrationInput, {target: {value: 'F-GHJK'}});
    const nameInput = screen.getByLabelText('Name input');
    fireEvent.input(nameInput, {target: {value: 'Airbus A380'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
    expect(screen.getByText('At least one runway coefficient is not properly filled')).toBeInTheDocument();
  });

  test(`Given unfilled take off wind coefficient,
  when saving the plane,
  then expected error message is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    MockPlanePerformanceComponent.emitter.emit(planePerformanceViewModelWithMissingTakeOffWindCoefficient);
    const registrationInput = screen.getByLabelText('Registration input');
    fireEvent.input(registrationInput, {target: {value: 'F-GHJK'}});
    const nameInput = screen.getByLabelText('Name input');
    fireEvent.input(nameInput, {target: {value: 'Airbus A380'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
    expect(screen.getByText('At least one take off wind coefficient is needed. Could be 1 for a 0 kt wind')).toBeInTheDocument();
  });

  test(`Given unfilled landing wind coefficient,
  when saving the plane,
  then expected error message is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    MockPlanePerformanceComponent.emitter.emit(planePerformanceViewModelWithMissingLandingWindCoefficient);
    const registrationInput = screen.getByLabelText('Registration input');
    fireEvent.input(registrationInput, {target: {value: 'F-GHJK'}});
    const nameInput = screen.getByLabelText('Name input');
    fireEvent.input(nameInput, {target: {value: 'Airbus A380'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
    expect(screen.getByText('At least one landing wind coefficient is needed. Could be 1 for a 0 kt wind')).toBeInTheDocument();
  });

  test(`Given rendered plane creator component,
  when filling with valid data and clicking on save button,
  then plane is saved and notification is displayed`, async () => {
    await render(PlaneCreatorComponent, renderOptions)
    await fillAndSavePlane();
    expect(mockedPlaneRepository.save).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Plane saved')).toBeInTheDocument();
  });

  test(`Given a plane that has just been saved,
  when modifying registration,
  then save message is not displayed anymore`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    await fillAndSavePlane()
    fireEvent.input(screen.getByLabelText('Registration input'), {target: {value: 'F-GHJ'}});
    expect(screen.queryByText('Plane saved')).not.toBeInTheDocument();
  });

  test(`Given a plane that has just been saved,
  when modifying name,
  then save message is not displayed anymore`, async () => {
    await render(PlaneCreatorComponent, renderOptions)

    await fillAndSavePlane()
    fireEvent.input(screen.getByLabelText('Name input'), {target: {value: 'Test'}});
    expect(screen.queryByText('Plane saved')).not.toBeInTheDocument();
  });

  test(`Given a plane that has just been saved,
  when modifying plane performances,
  then save message is not displayed anymore`, async () => {
    const {fixture} = await render(PlaneCreatorComponent, renderOptions)

    await fillAndSavePlane()
    MockPlanePerformanceComponent.emitter.emit(planePerformanceViewModelWithMissingLandingWindCoefficient);
    fixture.detectChanges()

    expect(screen.queryByText('Plane saved')).not.toBeInTheDocument();
  });

  async function fillAndSavePlane() {

    MockPlanePerformanceComponent.emitter.emit(validPlanePerformanceViewModel);
    const registrationInput = screen.getByLabelText('Registration input');
    fireEvent.input(registrationInput, {target: {value: 'F-GHJK'}});
    const nameInput = screen.getByLabelText('Name input');
    fireEvent.input(nameInput, {target: {value: 'Airbus A380'}});

    const saveButton = await screen.findByRole('button', {name: 'Save'})
    fireEvent.click(saveButton);
  }
});
