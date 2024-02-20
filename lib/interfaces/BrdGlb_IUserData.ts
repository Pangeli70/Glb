/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20240219
 * ----------------------------------------------------------------------------
 */

export const BrdGlb_IUserData_Signature = "BrdGlb_IUserData_Signature_V1"


/**
 * Definizione dei dati da associare agli oggetti generati da GLB.
 */
export interface BrdGlb_IUserData {

    /**
     * Firma di questo oggetto
     */
    signature: "BrdGlb_IUserData_Signature_V1";

    /**
     * Layer di appartenenza
     */
    layer?: number;

}

/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023-24 - http://bredasys.com
 * All rights reserved
 * @licence You cannot host, display, distribute or share this Work in any
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * ---------------------------------------------------------------------------
 */
