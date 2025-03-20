import {ComputationData, PerformanceComputeResponse} from "../performance-compute-response";
import {Distance} from "../physical-quantity/distance";
import {TemperatureDifference} from "../physical-quantity/temperature";
import {Mass} from "../physical-quantity/mass";

export const testPerformanceComputeResponse: PerformanceComputeResponse = new PerformanceComputeResponse(
  Distance.forValueAndUnit(100, 'METERS'),
  Distance.forValueAndUnit(130, 'METERS'),
  false,
  new ComputationData(
    new Map([
      ["DRY_HARD", 1.2],
      ["SECURITY", 1.4],
      ["WIND", 1.5],
    ]),
    2000,
    TemperatureDifference.forValueAndUnit(5, 'CELSIUS'),
    undefined,
    Mass.forValueAndUnit(850, 'KILOGRAMS')
  )
)
