/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */

import * as Blm1 from "../../../../../Blm/modForGlb.ts";
import { Blm } from "../../../deps.ts";
import {
  BrdGlb_IMaterialDef
} from "../../../interfaces/BrdGlb_IMaterialDef.ts";


/**
 * Definizione della struttura della tabella che contiene le combinazioni
 * dei materiali per le mesh delle sezioni estruse
 */
export type BrdGlb_TC_SeD_TSectionMaterial_Recordset = Record<
  Blm1.BrdBlm_TC_SeD_eFinish,
  BrdGlb_IMaterialDef
>;


const finish = Blm1.BrdBlm_TC_SeD_eFinish;

/**
 * Tabella definizione materiali per le sezioni dei portoni sezionali
 */
export const BrdGlb_TC_SeD_SectionMaterials_Recordset: BrdGlb_TC_SeD_TSectionMaterial_Recordset = {


  [finish.NOT_STANDARD]: {
    color: 0x000000,
    roughness: Blm.BrdBlm_eGlossRoughness.UNDEFINED,
  },



  [finish.PRE_LAQ_C21]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9002")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },



  [finish.PRE_LAQ_C81]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9010")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_C81_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },



  [finish.PRE_LAQ_C17]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 8019")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_C17_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 8019")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },



  [finish.PRE_LAQ_RAL_7016]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 7016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_7016_SATIN]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 7016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.PRE_LAQ_SATIN,
  },
  [finish.PRE_LAQ_RAL_7016_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 7016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_7016_SATIN_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 7016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.PRE_LAQ_SATIN,
  },



  [finish.PRE_LAQ_RAL_9006]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9006")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_9006_SATIN]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9006")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.PRE_LAQ_SATIN,
  },
  [finish.PRE_LAQ_RAL_9006_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9006")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_9006_SATIN_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9006")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.PRE_LAQ_SATIN,
  },



  [finish.PRE_LAQ_RAL_9016_SATIN]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.PRE_LAQ_SATIN,
  },
  [finish.PRE_LAQ_RAL_9016_SATIN_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 9016")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.PRE_LAQ_SATIN,
  },



  [finish.PRE_LAQ_RAL_3000]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 3000")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_3000_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 3000")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },



  [finish.PRE_LAQ_RAL_6005]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 6005")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_6005_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 6005")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },



  [finish.PRE_LAQ_RAL_5010]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 5010")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.PRE_LAQ_RAL_5010_FS]: {
    color: Blm.BrdBlm_RalColorsService.getColor("RAL 5010")!.color,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },



  [finish.WOODLIKE_NUT]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
    texture: {
      texture: "Brd3DvNut_Map_2048.jpg",
      uScale: 1000 / 960,
      vScale: 1000 / 1250
    },
  },
  [finish.WOODLIKE_GOLDEN_OAK]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
    texture: {
      texture: "Brd3DvGoldenOak_Map_2048.jpg",
      uScale: 1000 / 960,
      vScale: 1000 / 1250
    },
  },
  [finish.WOODLIKE_LIGHT_OAK]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
    texture: {
      texture: "Brd3DvLightOak_Map_2048.jpg",
      uScale: 1000 / 960,
      vScale: 1000 / 1250
    },
  },
  [finish.WOODLIKE_CONCRETE]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
    texture: {
      texture: "Brd3DvConcrete_Map_2048.jpg",
      uScale: 1000 / 960,
      vScale: 1000 / 1250
    },
  },
  [finish.RUSTY]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
    texture: {
      texture: "Brd3DvRusty_Map_2048.jpg",
      uScale: 1000 / 960,
      vScale: 1000 / 1250
    },
  },

  [finish.RAL_GLOSS_10_FS]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_10,
  },
  [finish.RAL_GLOSS_25_35_FS]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.RAL_GLOSS_25_35,
  },
  [finish.MICACEOUS_FS]: {
    color: 0xffffff,
    roughness: Blm.BrdBlm_eGlossRoughness.ROUGH,
  },
  [finish.PRE_LAQ_C81_ALU]: {
    color: 0xffffff,
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