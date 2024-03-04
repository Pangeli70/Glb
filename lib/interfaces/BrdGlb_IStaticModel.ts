/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20240127
 * @version 0.1 APG 20240222 Rotazione
 * ----------------------------------------------------------------------------
 */

import {
    THREE
} from "../deps.ts";
import {
    BrdGlb_eLayer
} from "../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_IBaseModel
} from "./BrdGlb_IBaseModel.ts";
import {
    BrdGlb_IPoint3D
} from "./BrdGlb_IPoint3D.ts";


export const BrdGlb_IStaticModel_Signature = "BrdGlb_IStaticModel_Signature_V2";


/**
 * Modello statico creato o servito da qualche CDN
 */
export interface BrdGlb_IStaticModel extends BrdGlb_IBaseModel{

    /**
     * Firma del record
     */
    readonly signature: "BrdGlb_IStaticModel_Signature_V2",

    /**
     * Nome del tipo di asset statico
     */
    name: string;

    /**
     * Indirizzo dell'url per scaricare il modello statico
     */
    url: string;

    /**
     * Posizionamento dell'asset nella scena
     */
    position: BrdGlb_IPoint3D,

    /**
     * Aggiustamento della scala dell'asset
     */
    scale: number;

    /**
     * Rotazione dell'asset sull'asse Y
     */
    rotationInDeg: number; // @2

    /**
     * Layer sul quale sarà aggiunto il modello statico
     */
    layer: BrdGlb_eLayer,

    /**
     * Reference frame del modello statico caricato nella scena
     */
    model?: THREE.Object3D | THREE.Group,

    /**
     * Il modello è stato caricato
     */
    loaded?: boolean,

    /**
     * Il modello è visualizzato
     */
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