/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */

import {
  Blm,
  THREE
} from "../deps.ts";
import {
  BrdGlb_ITextureDef
} from "./BrdGlb_ITextureDef.ts";
import {
  BrdGlb_IBumpMapDef
} from "./BrdGlb_IBumpMapDef.ts";


/**
 * Definizione del materiale per le mesh
 */
export interface BrdGlb_IMaterialDef {

  /**
   * Colore base del materiale
   */
  color: number;

  /**
   * Trasparenza base del materiale
   */
  trasparency?: number;

  /**
   * Riflettività del materiale
   */
  roughness: Blm.BrdBlm_eGlossRoughness;

  /**
   * Se il materiale ha una immagine ripetibile
   */
  texture?: BrdGlb_ITextureDef;

  /**
   * Se il materiale ha una mappa di rugosità
   */
  bumpMap?: BrdGlb_IBumpMapDef;

  /**
   * Materiale da usare per le mesh
   */
  material?: THREE.MeshStandardMaterial

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