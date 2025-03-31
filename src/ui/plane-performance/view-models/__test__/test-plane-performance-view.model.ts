import {PlanePerformancesViewModel, RunwayFactorsViewModel} from "../plane-performances-view.model";
import {validDiffWithISAPlanePerformances} from "../../../../domain/__test__/test-plane";

export const validPlanePerformanceViewModel: PlanePerformancesViewModel = PlanePerformancesViewModel.fromPlanePerformances(validDiffWithISAPlanePerformances);
export const planePerformanceViewModelWithMissingRunwayFactor: PlanePerformancesViewModel = validPlanePerformanceViewModel.copyWith({
  takeOffRunwayFactors: new RunwayFactorsViewModel({
    grass: undefined,
    grassWet: undefined,
    hard: undefined,
    hardWet: undefined
  })
})
export const planePerformanceViewModelWithMissingTakeOffWindCoefficient: PlanePerformancesViewModel = validPlanePerformanceViewModel.copyWith(
  {
    takeOffCoefficientsComputationData: []
  }
)
export const planePerformanceViewModelWithMissingLandingWindCoefficient: PlanePerformancesViewModel = validPlanePerformanceViewModel.copyWith(
  {
    landingCoefficientsComputationData: []
  }
)



