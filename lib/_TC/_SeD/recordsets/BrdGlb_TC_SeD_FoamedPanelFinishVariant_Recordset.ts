/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */

import {
  Blm
} from "../../../deps.ts";
import {
  BrdGlb_IBumpMapDef
} from "../../../interfaces/BrdGlb_IBumpMapDef.ts";




type BrdGlb_TC_SeD_TFoamedPanelFinishVariant_Recordset = Record<
  Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant,
  BrdGlb_IBumpMapDef
>;


/**
 * Gestione delle goffrature per le varianti finitura pannelli schiumati
 */
export const BrdBlm_TC_SeD_FoamedPanelFinishVariant_Recordset: BrdGlb_TC_SeD_TFoamedPanelFinishVariant_Recordset = {
  
  [Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.STUCCO]: {
    bumpMap: "Brd3DvStucco_BumpMap_256.jpg",
    depth: 10,
    uScale: 1000 / 125,
    vScale: 1000 / 125,
  },
  
  [Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.WOOD_GRAIN]: {
    bumpMap: "Brd3DvWoodGrain_BumpMap_256.jpg",
    depth: 10,
    uScale: 1000 / 125,
    vScale: 1000 / 125,
  },
  
  [Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.SMOOTH]: {
    bumpMap: "",
    depth: 0,
    uScale: 1,
    vScale: 1,
  },
  
  [Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.ULTRA_TOUCH]: {
    bumpMap: "",
    depth: 0,
    uScale: 1,
    vScale: 1,
  },
  
  [Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.MULTIRIB]: {
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