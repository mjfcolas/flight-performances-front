import {PlanePerformancesViewModel} from "../plane-performances-view.model";
import {validDiffWithISAPlanePerformances} from "../../../../domain/__test__/test-plane";

export const validPlanePerformanceViewModel: PlanePerformancesViewModel = PlanePerformancesViewModel.fromPlanePerformances(validDiffWithISAPlanePerformances);
