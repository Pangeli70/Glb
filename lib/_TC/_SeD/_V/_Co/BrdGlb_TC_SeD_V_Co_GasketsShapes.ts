import {
  THREE
} from "../../../../deps.ts";

export interface BrdGlb_TC_SeD_V_Co_GasketsShapes {
  topBottomAluProfile: THREE.Shape;
  bottomGasket: THREE.Shape;
  topGasket: THREE.Shape;
  lateralGasket: THREE.Shape;
  // TODO Profilo ALU per soglia ribassata -- APG 20231109
  loweredThresholdAluProfile?: THREE.Shape;
}
