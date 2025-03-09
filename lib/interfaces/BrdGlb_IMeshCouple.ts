/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20231202
 * @version 0.2 APG 20231226 Spostato nel modulo BrdGlb
 * ----------------------------------------------------------------------------
 */

import {  THREE } from "../deps.ts";

/**
 * Coppia di profilati estrusi destro e sinistro.
 * Usato ad esempio per le guide di scorrimento o per i componenti delle molle
 * di bilanciamento
 */
export interface BrdGlb_IMeshCouple {
  right: THREE.Mesh;
  left: THREE.Mesh;
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