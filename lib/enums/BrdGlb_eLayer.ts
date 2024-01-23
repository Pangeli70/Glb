/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * ----------------------------------------------------------------------------
 */

/**
 * Livelli utilizzati dal visualizzatore 3D
 */
export enum BrdGlb_eLayer {
  DEFAULT = 0,
  LIGHTS = 1,
  HELPERS = 2,
  CONTEXT = 10,
  CONTEXT_INSIDE = 11,
  TC_SeD_COAT = 20,
  TC_SeD_ST = 21,
  PRODUCT_BALANCING = 22,
  PRODUCT_MOVING_AIDS = 23,
  PRODUCT_BLACK_AND_WHITE = 24
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
