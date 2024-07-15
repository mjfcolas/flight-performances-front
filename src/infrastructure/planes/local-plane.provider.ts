import {Observable, of} from "rxjs";
import {Plane, TrackFactors} from "../../domain/plane";
import {PlaneProvider} from "../../domain/plane.provider";

const dr400120TakeOfPerformance = [
  {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 285},
  {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 480},
  {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 315},
  {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 535},
  {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 345},
  {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 590},
  {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 375},
  {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 645},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 415},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 720},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 460},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 800}
];

const dr400120LandingPerformance = [
  {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 365},
  {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 435},
  {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 385},
  {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 460},
  {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 400},
  {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 485},
  {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 700, distanceInMeters: 395},
  {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 475},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 700, distanceInMeters: 420},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 505},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 700, distanceInMeters: 440},
  {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 535}
]

const dr400TakeOffTrackFactors: TrackFactors = new TrackFactors(1.15, 1.15, 1, 1);
const dr400LandingTrackFactors: TrackFactors = new TrackFactors(1.15, 1.35, 1, 1.15);


const fgkrd = new Plane(
  "1",
  "DR400-120",
  "F-GKRD",
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffTrackFactors,
  dr400LandingTrackFactors
);

const fgnna = new Plane(
  "2",
  "DR401-120",
  "F-GNNA",
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffTrackFactors,
  dr400LandingTrackFactors
);

const fhato = new Plane(
  "3",
  "DR400-120",
  "F-HATO",
  dr400120TakeOfPerformance,
  dr400120LandingPerformance,
  dr400TakeOffTrackFactors,
  dr400LandingTrackFactors
);

const fgnnl = new Plane(
  "4",
  "DR400-160",
  "F-GNNL",
  [
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 245},
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 435},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 265},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 485},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 290},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 535},
    {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 320},
    {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 580},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 350},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 645},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 465},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 870}
  ],
  [
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 403},
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 480},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 433},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 513},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 460},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 550},
    {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 800, distanceInMeters: 450},
    {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 1000, distanceInMeters: 540},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 800, distanceInMeters: 487},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 1000, distanceInMeters: 587},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 800, distanceInMeters: 523},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 1000, distanceInMeters: 630}
  ],
  dr400TakeOffTrackFactors,
  dr400LandingTrackFactors
);

const fgmxo = new Plane(
  "5",
  "DR400-180",
  "F-GMXO",
  [
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 250},
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 1100, distanceInMeters: 445},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 290},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 1100, distanceInMeters: 515},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 340},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 1100, distanceInMeters: 600},
    {altitudePressureInFeet: 2500, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 310},
    {altitudePressureInFeet: 2500, temperatureInCelsius: -20, massInKg: 1100, distanceInMeters: 540},
    {altitudePressureInFeet: 2500, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 360},
    {altitudePressureInFeet: 2500, temperatureInCelsius: 0, massInKg: 1100, distanceInMeters: 635},
    {altitudePressureInFeet: 2500, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 415},
    {altitudePressureInFeet: 2500, temperatureInCelsius: 20, massInKg: 1100, distanceInMeters: 735},
    {altitudePressureInFeet: 5000, temperatureInCelsius: -20, massInKg: 900, distanceInMeters: 385},
    {altitudePressureInFeet: 5000, temperatureInCelsius: -20, massInKg: 1100, distanceInMeters: 680},
    {altitudePressureInFeet: 5000, temperatureInCelsius: 0, massInKg: 900, distanceInMeters: 450},
    {altitudePressureInFeet: 5000, temperatureInCelsius: 0, massInKg: 1100, distanceInMeters: 795},
    {altitudePressureInFeet: 5000, temperatureInCelsius: 20, massInKg: 900, distanceInMeters: 520},
    {altitudePressureInFeet: 5000, temperatureInCelsius: 20, massInKg: 1100, distanceInMeters: 925}
  ],
  [
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 845, distanceInMeters: 425},
    {altitudePressureInFeet: 0, temperatureInCelsius: -20, massInKg: 1045, distanceInMeters: 500},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 845, distanceInMeters: 450},
    {altitudePressureInFeet: 0, temperatureInCelsius: 0, massInKg: 1045, distanceInMeters: 530},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 845, distanceInMeters: 475},
    {altitudePressureInFeet: 0, temperatureInCelsius: 20, massInKg: 1045, distanceInMeters: 560},
    {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 845, distanceInMeters: 465},
    {altitudePressureInFeet: 4000, temperatureInCelsius: -20, massInKg: 1045, distanceInMeters: 550},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 845, distanceInMeters: 495},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 0, massInKg: 1045, distanceInMeters: 585},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 845, distanceInMeters: 520},
    {altitudePressureInFeet: 4000, temperatureInCelsius: 20, massInKg: 1045, distanceInMeters: 620}
  ],
  dr400TakeOffTrackFactors,
  dr400LandingTrackFactors
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
