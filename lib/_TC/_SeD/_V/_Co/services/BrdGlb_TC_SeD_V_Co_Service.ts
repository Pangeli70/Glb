

/** ---------------------------------------------------------------------------
 * @module [Brd/3Dv]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 DLV 20230626
 * @version 0.2 APG 20230720
 * @version 0.3 APG 20231113 - Refactoring semplificazione e pulizia
 * @version 0.4 APG 20240102 Spostato nel modulo BrdGlb
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
// #region Imports



import {
    THREE, Uts, Blm
} from "../../../../../deps.ts";
import {
    BrdGlb_IIntExtMeshes
} from "../../../../../interfaces/BrdGlb_IIntExtMeshes.ts";
import {
    BrdGlb_TC_SeD_FP_Service
} from "../../../_FP/services/BrdGlb_TC_SeD_FP_Service.ts";

// #endregion
//-----------------------------------------------------------------------------



/**
 * Per i log, i messaggi di errore e di avvertimento
 */
const MODULE_NAME = "BrdGlb_TC_SeD_V_CoatService";



/**
 * Costruttore del manto del portone sezionale a scorrimento verticale
 */
export class BrdGlb_TC_SeD_V_Co_Service {



    private _logger: Uts.BrdUts_Logger;

    constructor(alogger: Uts.BrdUts_Logger) {

        this._logger = alogger;

    }



    /**
     * Costruisce il manto del portone sezionale.
     * @returns Array di mesh
     */
    build(
        adoor: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorParams
    ) {
        const start = performance.now();

        const r: THREE.Scene[] = [];

        const sections = this.#buildSections(adoor);

        r.push(...sections);

        // const gasketsBuilder = new Brd3Dv_SeDGasketsBuilder(this.logger);
        // const gaskets = gasketsBuilder.SeD_build(adoor);


        // const insertsBuilder = new Brd3Dv_SeDInsertsBuilder(this.logger)
        // const inserts = insertsBuilder.stub(adoor);

        this._logger.log(MODULE_NAME + ":" + this.build.name);

        return r;
    }



    /**
     * Costruisce le sezioni del manto
     */
    #buildSections(
        adoor: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorParams
    ) {

        const r: THREE.Scene[] = [];

        for (const section of adoor.sections) {

            if (section.family == Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.FOAMED) {
                const panelMeshes = BrdGlb_TC_SeD_FP_Service.BuildScene(
                    this._logger,
                    section
                );
                r.push(panelMeshes)
            }
            else {
                Uts.BrdUts.Assert(
                    false,
                    `${MODULE_NAME}:${this.#buildSections.name}: ` +
                    `Le sezioni della famiglia ${section.family} non sono ancora implementate.`
                )
            }
        }

        return r;
    };


}


/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved
 * @licence You cannot host, display, distribute or share this Work in any
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * ----------------------------------------------------------------------------
 */