/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */


import * as Blm from "../../../../../Blm/modForGlb.ts"
import {
  BrdGlb_IBumpMapDef
} from "../../../interfaces/BrdGlb_IBumpMapDef.ts";




const variant = Blm.BrdBlm_TC_SeD_eFinishVariant;

type BrdGlb_TC_SeD_TFoamedPanelFinishVariant_Recordset = Record<
  Blm.BrdBlm_TC_SeD_eFinishVariant,
  BrdGlb_IBumpMapDef
>;




/**
 * Gestione delle goffrature per le varianti finitura pannelli schiumati
 */
export const BrdGlb_TC_SeD_FoamedPanelFinishVariant_Recordset: BrdGlb_TC_SeD_TFoamedPanelFinishVariant_Recordset = {
  
  [variant.STUCCO]: {
    bumpMap: "Brd3DvStucco_BumpMap_256.jpg",
    depth: 10,
    uScale: 1000 / 125,
    vScale: 1000 / 125,
  },
  
  [variant.WOOD_GRAIN]: {
    bumpMap: "Brd3DvWoodGrain_BumpMap_256.jpg",
    depth: 10,
    uScale: 1000 / 125,
    vScale: 1000 / 125,
  },
  
  [variant.SMOOTH]: {
    bumpMap: "",
    depth: 0,
    uScale: 1,
    vScale: 1,
  },
  
  [variant.ULTRA_TOUCH]: {
    bumpMap: "",
    depth: 0,
    uScale: 1,
    vScale: 1,
  },
  
  [variant.MULTIRIB]: {
    bumpMap: "Brd3DvMultirib_BumpMap_64.jpg",
    depth: 10,
    uScale: 1000 / 125,
    vScale: 1000 / 64,
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