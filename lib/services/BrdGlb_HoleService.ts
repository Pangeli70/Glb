/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20240102 Spostato nel modulo BrdGlb
 * ----------------------------------------------------------------------------
 */

import {
  Blm,
  THREE,
  THREE_CSG
} from "../deps.ts";
import {
  BrdGlb_IIntExtGeometries } from "../interfaces/BrdGlb_IIntExtGeometries.ts";


/**
 * Generatore di geometrie per operazioni booleane di sottrazione
 * Utilizzato per fare i fori degli inserti sui pannelli sia delle sezioni che delle ante.
 */

export class BrdGlb_HoleService {

  /**
   * Estrude la geometria per l'operazione booleana di sottrazione
   * per il tipo di foro richiesto
   */
  static #getHoleGeometry(
    acode: string,
    aposition: Blm.BrdBlm_IPoint2D
  ) {

    const nr = Blm.TC.SeD.BrdBlm_TC_SeD_HolesOutlinesService.getOutlineByInsertCode(acode, aposition);
    const holeOutline = nr.payload as Blm.BrdBlm_IPoint2D[];


    const holePoints: THREE.Vector2[] = [];
    holeOutline.forEach((point) => {
      holePoints.push(new THREE.Vector2(point.x, point.y));
    });
    const holeShape = new THREE.Shape(holePoints);

    const extrusionParams = {
      depth: 200,
      steps: 1,
    };
    const r = new THREE.ExtrudeGeometry(holeShape, extrusionParams);
    r.rotateY(-Math.PI / 2);
    r.translate(extrusionParams.depth / 2, 0, 0);

    return r;

  }



  /**
   * Restituisce un gruppo di geometrie per le operazioni booleane di sottrazione dei fori
   */
  static #getHolesGeometries(ainserts: Blm.TC.BrdBlm_TC_IInsertParams[]) {

    const r: THREE.ExtrudeGeometry[] = [];

    for (const insert of ainserts) {
      r.push(this.#getHoleGeometry(insert.code, insert.position));
    }

    return r;

  }



  /**
   * Crea una serie di fori nelle geometrie esterne ed interne dei pannelli
   * @param ageometries geometrie del pannello
   * @param ainserts tipo e coordinate dei fori
   * @returns geometria dei pannelli interna ed esterna forata
   */
  static makeHolesForInsertsOnIntExtGeometry(
    ageometries: BrdGlb_IIntExtGeometries,
    ainserts: Blm.TC.BrdBlm_TC_IInsertParams[]
  ) {



      const r: BrdGlb_IIntExtGeometries= {
        ext: ageometries.ext.clone(),
        int: ageometries.int.clone(),
      };

      const holesGeometries = this.#getHolesGeometries(ainserts);

      for (const hole of holesGeometries) {

        const extCSG = THREE_CSG.fromGeometry(r.ext);
        const intCSG = THREE_CSG.fromGeometry(r.int);

        const holeCSG = THREE_CSG.fromGeometry(hole);

        const rext = extCSG.subtract(holeCSG);
        const rint = intCSG.subtract(holeCSG);

        r.ext = rext.toGeometry(
          new THREE.Matrix4().identity()
        ) as THREE.ExtrudeGeometry;

        r.int = rint.toGeometry(
          new THREE.Matrix4().identity()
        ) as THREE.ExtrudeGeometry;
      }
    

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