/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20240217
 * ----------------------------------------------------------------------------
 */


import {
    BrdGlb_eLayer
} from "../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_IBaseModel
} from "./BrdGlb_IBaseModel.ts";
import {
    BrdGlb_IPoint3D
} from "./BrdGlb_IPoint3D.ts";


export const BrdGlb_IDynamicModel_Signature = "BrdGlb_IDynamicModel_Signature_V1";


/**
 * Modello dinamico creato o servito da qualche microservizio
 */
export interface BrdGlb_IDynamicModel extends BrdGlb_IBaseModel {

    /**
     * Firma del record
     */
    readonly signature: "BrdGlb_IDynamicModel_Signature_V1",

    /**
     * Nome del tipo di asset dinamico
     */
    name: string

    /**
     * URL finale restituito dalla chiamata in post per scaricare il file GLTF/GLB
     */
    url: string;

    /**
     * Posizionamento dell'asset nella scena
     */
    position: BrdGlb_IPoint3D,

    /**
     * Aggiustamento della scala dell'asset
     */
    scale?: number;

    /**
     * Rotazione dell'asset sull'asse Y
     */
    rotationInDeg?: number; // @2

    /**
     * Layer sul quale sarà aggiunto il modello dinamico
     */
    layer: BrdGlb_eLayer,

    /**
     * Reference frame del modello dinamico caricato nella scena
     */
    model?: THREE.Object3D,

    /**
     * Il modello è stato caricato
     */
    loaded?: boolean,

    /**
     * Il modello è visualizzato
     */
    enabled?: boolean

    /**
     * Route dell'Url del server dove richiedere questo asset dinamico con una chiamata in post
     */
    postUrl: string,

    /**
     * Parametri di configurazione dal passare nel body della chiamata in post
     */
    postParams: any,


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