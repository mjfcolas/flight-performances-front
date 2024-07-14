// @ts-nocheck

import {InterpolationProvider} from "../../domain/interpolation.provider";
import {PerformanceDataPoint} from "../../domain/performance-data-point";

export class TrilinearInterpolationProvider implements InterpolationProvider {
  interpolate(grid: PerformanceDataPoint[], toInterpolate: PerformanceDataPoint): number {

    const raw = grid
      .map(({altitudePressureInFeet, temperatureInCelsius, massInKg, distanceInMeters})
        => [altitudePressureInFeet, temperatureInCelsius, massInKg, distanceInMeters]);

    return interpolate(raw, [toInterpolate.altitudePressureInFeet, toInterpolate.temperatureInCelsius, toInterpolate.massInKg])[3]
  }
}


function interpolate(grid: [], pointToInterpolate: []) {

  const boundingVolume = getBoundingVolume(grid, pointToInterpolate);

  const c000 = boundingVolume[0][0][0];
  const c001 = boundingVolume[0][0][1];
  const c010 = boundingVolume[0][1][0];
  const c011 = boundingVolume[0][1][1];
  const c100 = boundingVolume[1][0][0];
  const c101 = boundingVolume[1][0][1];
  const c110 = boundingVolume[1][1][0];
  const c111 = boundingVolume[1][1][1];

  if (!c000 || !c001 || !c010 || !c011 || !c100 || !c101 || !c110 || !c111) {
    throw new Error('OUT_OF_BOUND_ERROR');
  }


  const c00Factor = (pointToInterpolate[0] - c000[0]) / (c100[0] - c000[0])
  const c00 = [c000[0] + c00Factor * (c100[0] - c000[0]), (c100[1] + c000[1]) / 2, (c100[2] + c000[2]) / 2, c000[3] + c00Factor * (c100[3] - c000[3])];
  const c01Factor = (pointToInterpolate[0] - c001[0]) / (c101[0] - c001[0])
  const c01 = [c001[0] + c01Factor * (c101[0] - c001[0]), (c101[1] + c001[1]) / 2, (c101[2] + c001[2]) / 2, c001[3] + c01Factor * (c101[3] - c001[3])];
  const c10Factor = (pointToInterpolate[0] - c010[0]) / (c110[0] - c010[0])
  const c10 = [c010[0] + c10Factor * (c110[0] - c010[0]), (c110[1] + c010[1]) / 2, (c110[2] + c010[2]) / 2, c010[3] + c10Factor * (c110[3] - c010[3])];
  const c11Factor = (pointToInterpolate[0] - c011[0]) / (c111[0] - c011[0])
  const c11 = [c011[0] + c11Factor * (c111[0] - c011[0]), (c111[1] + c011[1]) / 2, (c111[2] + c011[2]) / 2, c011[3] + c11Factor * (c111[3] - c011[3])];

  const c0Factor = (pointToInterpolate[1] - c00[1]) / (c10[1] - c00[1]);
  const c0 = [(c10[0] + c00[0]) / 2, c00[1] + c0Factor * (c10[1] - c00[1]), (c10[2] + c00[2]) / 2, c00[3] + c0Factor * (c10[3] - c00[3])];
  const c1Factor = (pointToInterpolate[1] - c01[1]) / (c11[1] - c01[1]);
  const c1 = [(c11[0] + c01[0]) / 2, c01[1] + c1Factor * (c11[1] - c01[1]), (c11[2] + c01[2]) / 2, c01[3] + c1Factor * (c11[3] - c01[3])];

  const cFactor = (pointToInterpolate[2] - c0[2]) / (c1[2] - c0[2]);
  return [(c1[0] + c0[0]) / 2, (c1[1] + c0[1]) / 2, c0[2] + cFactor * (c1[2] - c0[2]), c0[3] + cFactor * (c1[3] - c0[3])];
}

// z    y
// |   /
// |  /
// | /
// |_______ x

function getBoundingVolume(grid, toExtrapolatePoint) {

  const [x, y, z] = toExtrapolatePoint;

  const result = [
    [
      [0, 0],
      [0, 0]
    ],
    [
      [0, 0],
      [0, 0]
    ],
  ];

  const maxX = Math.max(...grid.map(([x]) => x));
  const maxY = Math.max(...grid.map(([, y]) => y));
  const maxZ = Math.max(...grid.map(([, , z]) => z));

  const belowCriteria =
    ([x1, y1, z1], direction: 'X' | 'Y' | 'Z') => {
      switch (direction) {
        case 'X':
          return x === maxX ? x1 < x : x1 <= x;
        case 'Y':
          return y === maxY ? y1 < y : y1 <= y;
        case 'Z':
          return z === maxZ ? z1 < z : z1 <= z;
      }
    }

  const aboveCriteria =
    ([x1, y1, z1], direction: 'X' | 'Y' | 'Z') => {
      switch (direction) {
        case 'X':
          return x === maxX ? x1 >= x : x1 > x;
        case 'Y':
          return y == maxY ? y1 >= y : y1 > y;
        case 'Z':
          return z == maxZ ? z1 >= z : z1 > z;
      }
    }


  const sortedGrid = [...grid]
    .sort(([x1, y1, z1], [x2, y2, z2]) =>
      threeDimensionDistanceSquaredDistance([x1, y1, z1], [x, y, z])
      - threeDimensionDistanceSquaredDistance([x2, y2, z2], [x, y, z]));

  const alreadyChosenPoints = []

  result[0][0][0] = sortedGrid
    .filter((potentialCorner) =>
      belowCriteria(potentialCorner, 'X')
      && belowCriteria(potentialCorner, 'Y')
      && belowCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[0][0][0]);

  result[0][0][1] = sortedGrid
    .filter((potentialCorner) =>
      belowCriteria(potentialCorner, 'X')
      && belowCriteria(potentialCorner, 'Y')
      && aboveCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[0][0][1]);

  result[0][1][0] = sortedGrid
    .filter((potentialCorner) =>
      belowCriteria(potentialCorner, 'X')
      && aboveCriteria(potentialCorner, 'Y')
      && belowCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[0][1][0]);

  result[0][1][1] = sortedGrid
    .filter((potentialCorner) =>
      belowCriteria(potentialCorner, 'X')
      && aboveCriteria(potentialCorner, 'Y')
      && aboveCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[0][1][1]);

  result[1][0][0] = sortedGrid
    .filter((potentialCorner) =>
      aboveCriteria(potentialCorner, 'X')
      && belowCriteria(potentialCorner, 'Y')
      && belowCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[1][0][0]);

  result[1][0][1] = sortedGrid
    .filter((potentialCorner) =>
      aboveCriteria(potentialCorner, 'X')
      && belowCriteria(potentialCorner, 'Y')
      && aboveCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[1][0][1]);

  result[1][1][0] = sortedGrid
    .filter((potentialCorner) =>
      aboveCriteria(potentialCorner, 'X')
      && aboveCriteria(potentialCorner, 'Y')
      && belowCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[1][1][0]);

  result[1][1][1] = sortedGrid
    .filter((potentialCorner) =>
      aboveCriteria(potentialCorner, 'X')
      && aboveCriteria(potentialCorner, 'Y')
      && aboveCriteria(potentialCorner, 'Z'))
    .filter(current => !alreadyChosenPoints.includes(current))[0];
  alreadyChosenPoints.push(result[1][1][1]);

  return result;
}

function threeDimensionDistanceSquaredDistance([x1, y1, z1], [x2, y2, z2]) {
  return Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2);
}
