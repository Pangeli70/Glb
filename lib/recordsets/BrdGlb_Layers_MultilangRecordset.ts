/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231113 Spostato nel proprio file nella cartella data/multilang
 * @version 0.3 APG 20231229 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */


import {
    Blm
} from "../deps.ts";
import {
    BrdGlb_eLayers
} from "../enums/BrdGlb_eLayers.ts";


type BrdGlb_TLayers_MultilangRecordset = Record<
    BrdGlb_eLayers,
    Blm.BrdBlm_IMultilanguage
>;

/**
 * Nomi multilingua dei livelli del viewer di THREE
 */
export const BrdGlb_Layers_MultilangRecordset: BrdGlb_TLayers_MultilangRecordset = {
    
    [BrdGlb_eLayers.DEFAULT]: {
        it: "Generico",
        en: "Generic",
    },

    [BrdGlb_eLayers.LIGHTS]: {
        it: "Luci",
        en: "Lights",
    },

    [BrdGlb_eLayers.HELPERS]: {
        it: "Aiuti per il debug",
        en: "Debug gizmos",
    },

    [BrdGlb_eLayers.CONTEXT]: {
        it: "Contesto architettonico",
        en: "Architectural context",
    },

    [BrdGlb_eLayers.CONTEXT_INSIDE]: {
        it: "Pareti interne",
        en: "Internal walls",
    },

    [BrdGlb_eLayers.TC_SeD_COAT]: {
        it: "Manto del prodotto",
        en: "Coat of the product",
    },

    [BrdGlb_eLayers.TC_SeD_ST]: {
        it: "Guide di scorrimento",
        en: "Sliding tracks",
    },
    [BrdGlb_eLayers.PRODUCT_BALANCING]: {
        it: "Sistema di bilanciamento",
        en: "Balancing system",
    },

    [BrdGlb_eLayers.PRODUCT_MOVING_AIDS]: {
        it: "Ausili alla movimentazione",
        en: "Moving aids",
    },

    [BrdGlb_eLayers.PRODUCT_BLACK_AND_WHITE]: {
        it: "Prodotto in bianco e nero",
        en: "Broduct in black and white",
    },

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



