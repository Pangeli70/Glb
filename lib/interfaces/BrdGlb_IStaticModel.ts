/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20240127
 * ----------------------------------------------------------------------------
 */

import {
    BrdGlb_eLayer
} from "../enums/BrdGlb_eLayer.ts";


export const BrdGlb_IStaticModel_Signature = "BrdGlb_IStaticModel";

/**
 * Modello statico creato da servito da qualche CDN
 */
export interface BrdGlb_IStaticModel {
    readonly signature: "BrdGlb_IStaticModel",
    name: string;
    asset: string;
    layer: BrdGlb_eLayer
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