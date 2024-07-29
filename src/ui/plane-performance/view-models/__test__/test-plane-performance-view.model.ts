import {PlanePerformancesViewModel} from "../plane-performances-view.model";
import {validPlanePerformances} from "../../../../domain/__test__/test-plane";

export const validPlanePerformanceViewModel: PlanePerformancesViewModel = PlanePerformancesViewModel.fromPlanePerformances(validPlanePerformances);
