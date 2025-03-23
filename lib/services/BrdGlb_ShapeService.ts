/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231226 Spostato nel modulo BrdGlb
 * ----------------------------------------------------------------------------
 */

import { A3D, Blm, THREE } from "../deps.ts";


/**
 * Servizio che converte una sagoma definita come array di punti in una forma 
 * utilizzabile come profilo di estrusione di una geometria
 */
export class BrdGlb_ShapeService {


    static GetShapeFromArrayOfPoints(apoints: A3D.ApgA3D_IPoint2D[]) {
        const vectors: THREE.Vector2[] = [];
        apoints.forEach((point) => {
            vectors.push(new THREE.Vector2(point.x, point.y));
        });
        const r = new THREE.Shape(vectors);
        return r;
    }


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