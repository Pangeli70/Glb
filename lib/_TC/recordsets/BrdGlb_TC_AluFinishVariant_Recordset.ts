/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */



import { Blm } from "../../deps.ts";
import { BrdGlb_IMaterialDef } from "../../interfaces/BrdGlb_IMaterialDef.ts";




const variant = Blm.TC.BrdBlm_TC_eAluFinishVariant;

type BrdGlb_TC_TAluFinishVariant_Recordset = Record<
    Blm.TC.BrdBlm_TC_eAluFinishVariant,
    BrdGlb_IMaterialDef
>;




/**
 * Gestione delle finiture per i profili di alluminio verniciati, ossidati o decorati
 */
export const BrdGlb_TC_AluFinishVariant_Recordset: BrdGlb_TC_TAluFinishVariant_Recordset = {

    [variant.C17]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
    },

    [variant.C21]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
    },

    [variant.C81]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
    },

    [variant.RAL3000]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
    },

    [variant.RAL5010]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
    },

    [variant.RAL6005]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
    },

    [variant.SCOTCH_BRITE_BLACK]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ANODIZED,
        bumpMap: {
            bumpMap: "Brd3Dv_BumpMap_SCOTCHBRITE_ALU_64.jpg",
            depth: 0.1,
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },
    },

    [variant.SCOTCH_BRITE_SILVER]: {
        color: 0x000000,
        roughness: Blm.BrdBlm_eGlossRoughness.ANODIZED,
    },

    [variant.SIMILARWOOD_NUT]: {
        color: 0xFFFFFF,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
        texture: {
            texture: "Brd3Dv_Texture_NUT_ALU_64.jpg",
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },
        bumpMap: {
            bumpMap: "Brd3Dv_BumpMap_WOODLIKE_ALU_64.jpg",
            depth: 0.1,
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },
    },

    [variant.SIMILARWOOD_GOLDEN_OAK]: {
        color: 0xFFFFFF,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
        texture: {
            texture: "Brd3Dv_Texture_GOLDEN_OAK_ALU_64.jpg",
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },
        bumpMap: {
            bumpMap: "Brd3Dv_BumpMap_WOODLIKE_ALU_64.jpg",
            depth: 0.1,
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },

    },

    [variant.SIMILARWOOD_LIGHT_OAK]: {
        color: 0xFFFFFF,
        roughness: Blm.BrdBlm_eGlossRoughness.ALU_POWDER,
        texture: {
            texture: "Brd3Dv_Texture_LIGHT_OAK_ALU_64.jpg",
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },
        bumpMap: {
            bumpMap: "Brd3Dv_BumpMap_WOODLIKE_ALU_64.jpg",
            depth: 0.1,
            uScale: 1000 / 64,
            vScale: 1000 / 64,
        },

    },

    [variant.RAL_GLOSS_10]: {
        color: 0xFF00FF,
        roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_10,
    },

    [variant.RAL_GLOSS_25_35]: {
        color: 0xFF00FF,
        roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
    },


};

/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved 
 * @licence You cannot host, display, distribute or share this Work in any 
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * --------------------------------------------------------------------------- 
 */