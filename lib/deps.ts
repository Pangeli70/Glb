/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20230626
 * ----------------------------------------------------------------------------
 */

export * as THREE from "https://esm.sh/three@0.162.0/build/three.module.js";

export { GLTFExporter as THREE_GLTFExporter } from "https://esm.sh/three@0.162.0/examples/jsm/exporters/GLTFExporter.js";
export { STLExporter as THREE_STLExporter } from "https://esm.sh/three@0.162.0/examples/jsm/exporters/STLExporter.js";

export { GLTFLoader as THREE_GLTFLoader } from "https://esm.sh/three@0.162.0/examples/jsm/loaders/GLTFLoader.js";
export type { GLTF } from "https://esm.sh/three@0.162.0/examples/jsm/loaders/GLTFLoader.js";
export { STLLoader as THREE_STLLoader } from "https://esm.sh/three@0.162.0/examples/jsm/loaders/STLLoader.js";

export { CSG as THREE_CSG } from "https://esm.sh/three-csg-ts@3.1.14";

export const Brd3Dv_AssetsServer = "";


/** Internal dependencies */

export * from "./monorepo.ts";