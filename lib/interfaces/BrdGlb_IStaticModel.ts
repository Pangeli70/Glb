/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20240127
 * ----------------------------------------------------------------------------
 */

import {
    BrdGlb_eLayer
} from "../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_IPoint3D
} from "./BrdGlb_IPoint3D.ts";


export const BrdGlb_IStaticModel_Signature = "BrdGlb_IStaticModel_Signature_V1";


/**
 * Modello statico creato o servito da qualche CDN
 */
export interface BrdGlb_IStaticModel {
    readonly signature: "BrdGlb_IStaticModel_Signature_V1",
    name: string;
    asset: string;
    position: BrdGlb_IPoint3D,
    scale: number;
    layer: BrdGlb_eLayer,
    model?: THREE.Object3D,
    loaded?: boolean,
    enabled?: boolean
}


/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved
 * @licence You cannot host, display, distribute or share this Work in any
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * ---------------------------------------------------------------------------
 */