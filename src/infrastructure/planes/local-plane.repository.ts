import {map, Observable, of} from "rxjs";
import {
  Plane,
  PlanePerformances,
  RunwayFactors,
  StepCoefficient,
  WindCoefficientComputationData
} from "../../domain/plane";
import {PlaneRepository} from "../../domain/plane.repository";
import {PlaneCreationCommand} from "../../domain/create-plane/plane-creation-command";
import {User} from "../../domain/user/user";

let idSequence = 1
const stubbedUser: User = new User('1', 'Emmanuel Colas');

const dr400120TakeOfPerformance = [
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 285},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 480},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 315},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 535},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 345},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 590},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 375},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 645},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 415},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 720},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 460},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 800}
];

const dr400120LandingPerformance = [
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 365},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 435},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 385},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 460},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 400},
  {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 485},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 395},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 475},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 420},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 505},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 440},
  {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 535}
]

const dr400TakeOffRunwayFactors: RunwayFactors = new RunwayFactors(1.15, 1.15, 1, 1);
const dr400LandingRunwayFactors: RunwayFactors = new RunwayFactors(1.15, 1.35, 1, 1.15);

const dr400WindTakeOffCoefficients: StepCoefficient[] = [
  {step: -10, coefficient: 1.5},
  {step: -8, coefficient: 1.4},
  {step: -6, coefficient: 1.3},
  {step: -4, coefficient: 1.2},
  {step: -2, coefficient: 1.1},
  {step: 0, coefficient: 1},
  {step: 10, coefficient: 0.85},
  {step: 20, coefficient: 0.65},
  {step: 30, coefficient: 0.55},
]

const dr400120WindLandingCoefficients: StepCoefficient[] = [
  {step: -10, coefficient: 1.5},
  {step: -8, coefficient: 1.4},
  {step: -6, coefficient: 1.3},
  {step: -4, coefficient: 1.2},
  {step: -2, coefficient: 1.1},
  {step: 0, coefficient: 1},
  {step: 10, coefficient: 0.78},
  {step: 20, coefficient: 0.63},
  {step: 30, coefficient: 0.52},
]

const dr400120Performances: PlanePerformances = new PlanePerformances(
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffRunwayFactors,
  dr400LandingRunwayFactors,
  WindCoefficientComputationData.fromStepCoefficients(dr400WindTakeOffCoefficients),
  WindCoefficientComputationData.fromStepCoefficients(dr400120WindLandingCoefficients)
);

const fgkrd = new Plane(
  (idSequence++).toString(),
  "DR400-120",
  "F-GKRD",
  dr400120Performances,
  stubbedUser
);

const fgnna = new Plane(
  (idSequence++).toString(),
  "DR400-120",
  "F-GNNA",
  dr400120Performances,
  stubbedUser
);

const fhato = new Plane(
  (idSequence++).toString(),
  "DR401-120",
  "F-HATO",
  dr400120Performances,
  stubbedUser
);

const fgukq = new Plane(
  (idSequence++).toString(),
  "DR400-120",
  "F-GUKQ",
  dr400120Performances
);

const fgnnl = new Plane(
  (idSequence++).toString(),
  "DR400-160",
  "F-GNNL",
  new PlanePerformances(
    [
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 245},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 435},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 265},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 485},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 290},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 535},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 320},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 580},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 350},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 645},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 465},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 870}
    ],
    [
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 403},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 480},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 433},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 513},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 460},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 550},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 450},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 540},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 487},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 587},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 523},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 630}
    ],
    dr400TakeOffRunwayFactors,
    dr400LandingRunwayFactors,
    WindCoefficientComputationData.fromStepCoefficients(dr400WindTakeOffCoefficients),
    WindCoefficientComputationData.fromStepCoefficients([
      {step: -10, coefficient: 1.5},
      {step: -8, coefficient: 1.4},
      {step: -6, coefficient: 1.3},
      {step: -4, coefficient: 1.2},
      {step: -2, coefficient: 1.1},
      {step: 0, coefficient: 1},
      {step: 10, coefficient: 0.79},
      {step: 20, coefficient: 0.64},
      {step: 30, coefficient: 0.53},
    ]))
);

const fgmxo = new Plane(
  (idSequence++).toString(),
  "DR400-180",
  "F-GMXO",
  new PlanePerformances(
    [
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 250},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1100, distanceInMeters: 445},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 290},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1100, distanceInMeters: 515},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 340},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1100, distanceInMeters: 600},
      {pressureAltitudeInFeet: 2500, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 310},
      {pressureAltitudeInFeet: 2500, temperatureInCelsius: -20, massInKg: 1100, distanceInMeters: 540},
      {pressureAltitudeInFeet: 2500, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 360},
      {pressureAltitudeInFeet: 2500, temperatureInCelsius: 0, massInKg: 1100, distanceInMeters: 635},
      {pressureAltitudeInFeet: 2500, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 415},
      {pressureAltitudeInFeet: 2500, temperatureInCelsius: 20, massInKg: 1100, distanceInMeters: 735},
      {pressureAltitudeInFeet: 5000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 385},
      {pressureAltitudeInFeet: 5000, temperatureInCelsius: -20, massInKg: 1100, distanceInMeters: 680},
      {pressureAltitudeInFeet: 5000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 450},
      {pressureAltitudeInFeet: 5000, temperatureInCelsius: 0, massInKg: 1100, distanceInMeters: 795},
      {pressureAltitudeInFeet: 5000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 520},
      {pressureAltitudeInFeet: 5000, temperatureInCelsius: 20, massInKg: 1100, distanceInMeters: 925}
    ],
    [
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 845, distanceInMeters: 425},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1045, distanceInMeters: 500},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 845, distanceInMeters: 450},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1045, distanceInMeters: 530},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 845, distanceInMeters: 475},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1045, distanceInMeters: 560},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 845, distanceInMeters: 465},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1045, distanceInMeters: 550},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 845, distanceInMeters: 495},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1045, distanceInMeters: 585},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 845, distanceInMeters: 520},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1045, distanceInMeters: 620}
    ],
    dr400TakeOffRunwayFactors,
    dr400LandingRunwayFactors,
    WindCoefficientComputationData.fromStepCoefficients(dr400WindTakeOffCoefficients),
    WindCoefficientComputationData.fromStepCoefficients([
      {step: -10, coefficient: 1.5},
      {step: -8, coefficient: 1.4},
      {step: -6, coefficient: 1.3},
      {step: -4, coefficient: 1.2},
      {step: -2, coefficient: 1.1},
      {step: 0, coefficient: 1},
      {step: 10, coefficient: 0.85},
      {step: 20, coefficient: 0.65},
      {step: 30, coefficient: 0.55},
    ]))
);

const fhgsm = new Plane(
  (idSequence++).toString(),
  "DR400-160",
  "F-HGSM",
  new PlanePerformances(
    [
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 340},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 530},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 375},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 590},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 415},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 655},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 445},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 710},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 500},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 800},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 550},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 890}
    ],
    [
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 435},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 510},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 460},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 545},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 485},
      {pressureAltitudeInFeet: 0, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 575},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 850, distanceInMeters: 475},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: -20, massInKg: 1050, distanceInMeters: 565},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 850, distanceInMeters: 505},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 0, massInKg: 1050, distanceInMeters: 600},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 850, distanceInMeters: 535},
      {pressureAltitudeInFeet: 4000, temperatureInCelsius: 20, massInKg: 1050, distanceInMeters: 635}
    ],
    dr400TakeOffRunwayFactors,
    dr400LandingRunwayFactors,
    WindCoefficientComputationData.fromStepCoefficients(dr400WindTakeOffCoefficients),
    WindCoefficientComputationData.fromStepCoefficients([
      {step: -10, coefficient: 1.5},
      {step: -8, coefficient: 1.4},
      {step: -6, coefficient: 1.3},
      {step: -4, coefficient: 1.2},
      {step: -2, coefficient: 1.1},
      {step: 0, coefficient: 1},
      {step: 10, coefficient: 0.85},
      {step: 20, coefficient: 0.65},
      {step: 30, coefficient: 0.55},
    ]))
);

const allPlanes: Map<string, Plane> = new Map([
  [fgkrd.id, fgkrd],
  [fgnna.id, fgnna],
  [fhato.id, fhato],
  [fgnnl.id, fgnnl],
  [fgmxo.id, fgmxo],
  [fgukq.id, fgukq],
  [fhgsm.id, fhgsm]
]);

const myPlanes: Map<string, Plane> = new Map([
  [fgkrd.id, fgkrd],
  [fgnna.id, fgnna],
  [fhato.id, fhato],
]);

const favoritePlanes: Map<string, Plane> = new Map([
  [fgnnl.id, fgnnl],
  [fgmxo.id, fgmxo],
  [fgukq.id, fgukq],
  [fhgsm.id, fhgsm]
]);

export class LocalPlaneRepository implements PlaneRepository {
  mine(): Observable<Plane[]> {
    return of([...myPlanes.values()]);
  }

  get(id: string): Observable<Plane> {
    return of(allPlanes.get(id) as Plane);
  }

  save(plane: PlaneCreationCommand): Observable<any> {
    const id = (idSequence++).toString()
    const newPlane = new Plane(
      id,
      plane.name,
      plane.immat,
      plane.performances
    );
    myPlanes.set(id, newPlane);
    allPlanes.set(id, newPlane);
    return of(null);
  }

  toggleFavorite(id: string): Observable<any> {
    return this.isFavorite(id).pipe(map(isFavorite => {
      if (isFavorite) {
        return this.removeFromFavorites(id)
      } else {
        return this.addToFavorites(id)
      }
    }))
  }

  addToFavorites(id: string): Observable<any> {
    this.get(id).subscribe(plane => favoritePlanes.set(plane.id, plane));
    return of(null);
  }

  removeFromFavorites(id: string): Observable<any> {
    favoritePlanes.delete(id);
    return of(null);
  }

  favorites(): Observable<Plane[]> {
    return of([...favoritePlanes.values()]);
  }

  isFavorite(id: string): Observable<boolean> {
    return of(favoritePlanes.has(id));
  }

  isMine(id: string): Observable<boolean> {
    return of(myPlanes.has(id));
  }
}
