/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved
 * @licence You cannot host, display, distribute or share this Work in any
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * ----------------------------------------------------------------------------
 */

/** ---------------------------------------------------------------------------
 * @module [Brd/3Dv]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 DLV 20230626
 * @version 0.2 APG 20230720
 * @version 0.3 APG 20231113 - Refactoring semplificazione e pulizia
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
// #region Imports
import {
    Blm
} from "../../../deps.ts";
import {
    THREE
} from "../../../../../V3d/srv/assets/ts/Brd3Dv_Deps.ts";
import {
    Brd3Dv_eParts,
} from "../../../../../V3d/srv/assets/ts_old/__/__Brd3Dv_Enums.ts";

import {
    BrdGlb_IIntExtShapes
} from "../../../interfaces/BrdGlb_IIntExtShapes.ts";
import {
    BrdGlb_IIntExtGeometries
} from "../../../interfaces/BrdGlb_IIntExtGeometries.ts";
import {
    BrdGlb_IIntExtMaterialDef
} from "../../../interfaces/BrdGlb_IIntExtMaterialDef.ts";
import {
    BrdGlb_IIntExtMeshes
} from "../../../interfaces/BrdGlb_IIntExtMeshes.ts";
import {
    BrdGlb_HoleService
} from "../../../services/BrdGlb_HoleService.ts";
import { 
    BrdUts_Logger
} from "../../../../../Uts/lib/classes/BrdUts_Logger.ts";
import { 
    BrdBlm_TC_SeD_FoamedPanelsOutlines_Service 
} from "../../../../../Blm/lib/_TC/_SeD/services/BrdBlm_TC_SeD_FoamedPanelsOutlines_Service.ts";
import { 
    BrdGlb_ShapeService 
} from "../../../services/BrdGlb_ShapeService.ts";
import { 
    BrdGlb_UVRemapperService 
} from "../../../services/BrdGlb_UVRemapperService.ts";
import { BrdGlb_eLayers } from "../../../enums/BrdGlb_eLayers.ts";

// #endregion
//-----------------------------------------------------------------------------


export const BRD_3DV_SECTIONS_BUILDER_MODULE_NAME = "Brd3DvSectionsBuilder";



/**
 * Costruttore del pannello coibentato della sezione del portone sezionale
 */
export class BrdGlb_TC_SeD_FoamedPanelsService {

    private _logger: BrdUts_Logger;



    constructor(alogger: BrdUts_Logger) {

        this._logger = alogger;

    }



    /**
     * Costruisce la sezione del portone sezionale
     */
    build(
        asection: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams
    ) {
        const start = performance.now();

        const r = this.#buildSection(
           asection
        );

        this._logger.log("Costruita sezione");

        return r;
    }



    /**
     * Prepara le forme di estrusione per i pannelli schiumati del portone
     * sezionale
     */
    #getFoamedPanelShapes(aparams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams) {

        const outlines = BrdBlm_TC_SeD_FoamedPanelsOutlines_Service.getFoamedPanelOutlines(aparams);

        const extShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(outlines.ext);
        const intShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(outlines.int);

        const r: BrdGlb_IIntExtShapes = {
            ext: [extShape],
            int: [intShape],
        };
        return r;
    }



    /**
     * Costruisce e posiziona il pannello coibentato del manto del portone sezionale
     */
    #buildSection(
        aparams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams,
    ) {


        const panelShapes = this.#getFoamedPanelShapes(aparams);

        const r = this.#extrudeFoamedPanel(
            aparams.length,
            panelShapes,
            aparams.materials!,
            aparams.inserts!
        );

        const originX = -aparams.length / 2;
        const rotationY = Math.PI / 2; // 90°

        // Esterno
        r.ext.position.set(originX, aparams.yDisplacement, 0);
        r.ext.rotation.y = rotationY;
        BrdGlb_UVRemapperService.CubeMapping(r.ext);

        r.ext.receiveShadow = true;
        r.ext.castShadow = true;

        r.ext.layers.set(BrdGlb_eLayers.TC_SeD_COAT);
        r.ext.name = Brd3Dv_eParts.PRODUCT_VSeD_SECTION_OUTSIDE;


        // Interno
        r.int.position.set(originX, aparams.yDisplacement, 0);
        r.int.rotation.y = rotationY;
        BrdGlb_UVRemapperService.CubeMapping(r.int);

        r.int.receiveShadow = true;
        r.int.castShadow = true;

        r.int.layers.set(BrdGlb_eLayers.TC_SeD_COAT);
        r.int.name = Brd3Dv_eParts.PRODUCT_VSeD_SECTION_INSIDE;


        return r;
    }



    #extrudeFoamedPanel(
        alength: number,
        ashapes: BrdGlb_IIntExtShapes,
        amaterials: BrdGlb_IIntExtMaterialDef,
        ainserts: Blm.TC.BrdBlm_TC_IInsertParams[],
    ) {
        const extrusionOptions = {
            depth: alength,
            steps: 10,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.4, //spessore lamiera
            bevelSegments: 1,
        };

        const clonedMaterial = amaterials.ext.material!.clone();
        // Pannello con texture
        if (clonedMaterial.map) {
            const clonedTexture = clonedMaterial.map.clone();
            // Sposta la texture in orizzontale per mescolare le ripetizioni in verticale
            clonedTexture.offset = new THREE.Vector2(Math.random(), 0);
            clonedMaterial.map = clonedTexture;
        }

        let extGeometry = new THREE.ExtrudeGeometry(ashapes.ext, extrusionOptions);
        let intGeometry = new THREE.ExtrudeGeometry(ashapes.int, extrusionOptions);

        if (ainserts !== undefined && Array.isArray(ainserts) && ainserts.length > 0) {
            const geometries: BrdGlb_IIntExtGeometries = {
                ext: extGeometry,
                int: intGeometry,
            };
            const machinedGeometries = BrdGlb_HoleService.makeHolesForInsertsOnIntExtGeometry(
                geometries,
                ainserts
            );
            extGeometry = machinedGeometries.ext;
            intGeometry = machinedGeometries.int;
        }

        const extMesh = new THREE.Mesh(extGeometry, clonedMaterial);
        const intMesh = new THREE.Mesh(intGeometry, amaterials.int.material);

        const r: BrdGlb_IIntExtMeshes = {
            ext: extMesh,
            int: intMesh,
        };
        return r;
    }




}
