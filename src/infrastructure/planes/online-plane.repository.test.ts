import {PlaneCreateOrUpdateCommand} from "../../domain/create-plane/plane-create-or-update-command";
import {simpleValidPlanePerformance} from "../../domain/__test__/test-plane";
import {OnlinePlaneRepository} from "./online-plane.repository";
import {MockedLoginRepository} from "../../domain/user/__mock__/mocked-login.repository";
import {MockedWebClient} from "../__mock__/mocked-web-client";
import {MockedEnvironment} from "../../app/__mock__/mocked-environment";

const A_NEW_DTO_PLANE = {
  "id": "13",
  "name": "Test plane",
  "registration": "F-TEST",
  "performances": "{\"temperatureMode\":\"ABSOLUTE\",\"takeOffDataPoints\":[{\"pressureAltitudeInFeet\":0,\"massInKg\":800,\"distanceInMeters\":2,\"absoluteTemperatureInCelsius\":10},{\"pressureAltitudeInFeet\":0,\"massInKg\":1000,\"distanceInMeters\":2,\"absoluteTemperatureInCelsius\":10}],\"landingDataPoints\":[{\"pressureAltitudeInFeet\":0,\"massInKg\":800,\"distanceInMeters\":800,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":4000,\"massInKg\":800,\"distanceInMeters\":810,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":0,\"massInKg\":800,\"distanceInMeters\":700,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":4000,\"massInKg\":800,\"distanceInMeters\":710,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":0,\"massInKg\":1000,\"distanceInMeters\":1000,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":4000,\"massInKg\":1000,\"distanceInMeters\":1010,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":0,\"massInKg\":1000,\"distanceInMeters\":900,\"absoluteTemperatureInCelsius\":null},{\"pressureAltitudeInFeet\":4000,\"massInKg\":1000,\"distanceInMeters\":910,\"absoluteTemperatureInCelsius\":null}],\"takeOffRunwayFactors\":{\"grass\":1.3,\"grassWet\":1.3,\"hard\":1,\"hardWet\":1},\"landingRunwayFactors\":{\"grass\":1.2,\"grassWet\":1.5,\"hard\":1,\"hardWet\":1.2},\"takeOffCoefficientsComputationData\":{\"byStepsCoefficients\":{\"stepCoefficients\":[{\"step\":5,\"coefficient\":0.9},{\"step\":10,\"coefficient\":0.7}]}},\"landingCoefficientsComputationData\":{\"byStepsCoefficients\":{\"stepCoefficients\":[{\"step\":5,\"coefficient\":0.9},{\"step\":15,\"coefficient\":0.8}]}}}",
  "owner": {
    "id": "test",
    "nickname": "test"
  }
}

describe(`Online Plane Repository`, () => {

  describe(`save`, () => {

    test(`Given a plane creation command,
    when saving the plane,
    then expected API call is done`, () => {
      const planeCreationCommand = new PlaneCreateOrUpdateCommand(
        undefined,
        'NAME',
        'REGISTRATION',
        simpleValidPlanePerformance
      )

      const mockedWebClient = new MockedWebClient();
      mockedWebClient.fetch.mockResolvedValue({
        ok: true,
        json: async () => (A_NEW_DTO_PLANE)
      });

      const repository = new OnlinePlaneRepository(new MockedEnvironment(), new MockedLoginRepository(), mockedWebClient)
      repository.save(planeCreationCommand);

      const url = mockedWebClient.fetch.mock.calls[0][0];
      const init = mockedWebClient.fetch.mock.calls[0][1];

      expect(url).toBe('http://backend/planes');
      expect(JSON.parse(init.body)).toStrictEqual({
        "name": "NAME",
        "registration": "REGISTRATION",
        "performances": "{\"temperatureMode\":\"ISA\",\"takeOffDataPoints\":[{\"pressureAltitudeInFeet\":0,\"massInKg\":850,\"distanceInMeters\":340,\"diffWithIsaTemperatureInCelsius\":-20}],\"landingDataPoints\":[{\"pressureAltitudeInFeet\":0,\"massInKg\":850,\"distanceInMeters\":435,\"diffWithIsaTemperatureInCelsius\":-20}],\"takeOffRunwayFactors\":{\"grass\":1.15,\"grassWet\":1.15,\"hard\":1,\"hardWet\":1},\"landingRunwayFactors\":{\"grass\":1.15,\"grassWet\":1.15,\"hard\":1,\"hardWet\":1},\"takeOffCoefficientsComputationData\":{\"byStepsCoefficients\":{\"stepCoefficients\":[{\"step\":-10,\"coefficient\":1.5}]}},\"landingCoefficientsComputationData\":{\"byStepsCoefficients\":{\"stepCoefficients\":[{\"step\":-10,\"coefficient\":1.5}]}}}"
      });
    });
  });
});
