import {Observable, of} from "rxjs";
import {Plane, RunwayFactors} from "../../domain/plane";
import {PlaneProvider} from "../../domain/plane.provider";

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


const fgkrd = new Plane(
  "1",
  "DR400-120",
  "F-GKRD",
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffRunwayFactors,
  dr400LandingRunwayFactors
);

const fgnna = new Plane(
  "2",
  "DR400-120",
  "F-GNNA",
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffRunwayFactors,
  dr400LandingRunwayFactors
);

const fhato = new Plane(
  "3",
  "DR401-120",
  "F-HATO",
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffRunwayFactors,
  dr400LandingRunwayFactors
);

const fgnnl = new Plane(
  "4",
  "DR400-160",
  "F-GNNL",
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
  dr400LandingRunwayFactors
);

const fgmxo = new Plane(
  "5",
  "DR400-180",
  "F-GMXO",
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
  dr400LandingRunwayFactors
);

const planes: Map<string, Plane> = new Map([
  [fgkrd.id, fgkrd],
  [fgnna.id, fgnna],
  [fhato.id, fhato],
  [fgnnl.id, fgnnl],
  [fgmxo.id, fgmxo]
]);

export class LocalPlaneProvider implements PlaneProvider {
  list(): Observable<Plane[]> {
    return of([...planes.values()]);
  }

  get(id: string): Observable<Plane> {
    return of(planes.get(id) as Plane);
  }
}
