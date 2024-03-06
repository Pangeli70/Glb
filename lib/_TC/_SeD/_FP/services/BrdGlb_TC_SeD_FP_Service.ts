/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 DLV 20230626
 * @version 0.2 APG 20230720
 * @version 0.3 APG 20231113 - Refactoring semplificazione e pulizia
 * ----------------------------------------------------------------------------
 */

//-----------------------------------------------------------------------------
// #region Imports

import {
    Blm,
    THREE,
    Uts
} from "../../../../deps.ts";
import {
    BrdGlb_eLayer
} from "../../../../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_IIntExtGeometries
} from "../../../../interfaces/BrdGlb_IIntExtGeometries.ts";
import {
    BrdGlb_IIntExtMaterialDef
} from "../../../../interfaces/BrdGlb_IIntExtMaterialDef.ts";
import {
    BrdGlb_IIntExtMeshes
} from "../../../../interfaces/BrdGlb_IIntExtMeshes.ts";
import {
    BrdGlb_IIntExtShapes
} from "../../../../interfaces/BrdGlb_IIntExtShapes.ts";
import {
    BrdGlb_IUserData,
    BrdGlb_IUserData_Signature
} from "../../../../interfaces/BrdGlb_IUserData.ts";
import {
    BrdGlb_BaseExporterService
} from "../../../../services/BrdGlb_BaseExporterService.ts";
import {
    BrdGlb_HoleService
} from "../../../../services/BrdGlb_HoleService.ts";
import {
    BrdGlb_ShapeService
} from "../../../../services/BrdGlb_ShapeService.ts";
import {
    BrdGlb_UVRemapperService
} from "../../../../services/BrdGlb_UVRemapperService.ts";
import {
    BrdGlb_TC_SeD_SectionMaterials_Recordset
} from "../../recordsets/BrdGlb_TC_SeD_SectionMaterials_Recordset.ts";
import {
    BrdGlb_TC_SeD_FP_FinishVariant_Recordset
} from "../recordsets/BrdGlb_TC_SeD_FP_FinishVariant_Recordset.ts";

// #endregion
//-----------------------------------------------------------------------------


export const MODULE_NAME = "Brd3DvSectionsBuilder";



/**
 * Gestore si pannelli coibentati per le sezioni del portone sezionale
 */
export class BrdGlb_TC_SeD_FP_Service extends BrdGlb_BaseExporterService {

    static #getMaterials(
        aparams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams
    ) {

        const intFinish = (aparams.intFinish) ?
            aparams.intFinish : Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C21;

        const r: BrdGlb_IIntExtMaterialDef = {
            ext: BrdGlb_TC_SeD_SectionMaterials_Recordset[aparams.extFinish],
            int: BrdGlb_TC_SeD_SectionMaterials_Recordset[intFinish]
        }

        r.ext.bumpMap = BrdGlb_TC_SeD_FP_FinishVariant_Recordset[aparams.variant]

        const intVariant = Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.STUCCO;
        r.int.bumpMap = BrdGlb_TC_SeD_FP_FinishVariant_Recordset[intVariant]

        return r;
    }


    //--------------------------------------------------------------------------
    // #region Shapes

    /**
     * Prepara le forme di estrusione per i pannelli schiumati del portone
     * sezionale
     */
    static #getFoamedPanelShapes(
        aparams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams
    ) {

        const outlines = Blm.TC.SeD.BrdBlm_TC_SeD_FoamedPanelsOutlines_Service.getOutlines(aparams);

        const extShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(outlines.ext);
        const intShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(outlines.int);

        const r: BrdGlb_IIntExtShapes = {
            ext: [extShape],
            int: [intShape],
        };
        return r;
    }

    // #endregion
    //--------------------------------------------------------------------------


    /**
     * Costruisce e posiziona il pannello coibentato del manto del portone sezionale
     */
    static BuildScene(
        alogger: Uts.BrdUts_Logger,
        aparams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams,
    ) {


        alogger.begin(MODULE_NAME, this.BuildScene.name);

        const r = new THREE.Scene();

        // NOTE Il visualizzatore utilizza come unità di misura i metri mentre
        // la business logic utilizza i millimetri --APG 20240303
        r.scale.x = 0.001;
        r.scale.y = 0.001;
        r.scale.z = 0.001;

        r.name = aparams.name;

        const panel = BrdGlb_TC_SeD_FP_Service.#BuildPanel(aparams);

        r.add(panel.int);
        r.add(panel.ext);

        alogger.end('Building of sliding tracks for vertical sectional door is completed');

        return r;
    }



    static #BuildPanel(
        aparams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams
    ) {

        const materials = this.#getMaterials(aparams);

        const panelShapes = this.#getFoamedPanelShapes(aparams);

        const name = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionsPartNames.FOAMED_PANEL + "_" + aparams.sequence.toString();

        const r = this.#extrudeFoamedPanelAlongZ(
            name,
            panelShapes,
            aparams.length,
            this.LINEAR_EXTRUSION_STEP,
            materials,
            aparams.inserts!,
            parseInt(BrdGlb_eLayer.PRODUCT_COAT)
        );

        const originX = -aparams.length / 2;
        const rotationY = Math.PI / 2; // 90°


        // Esterno
        r.ext.position.set(originX, aparams.displacement, 0);
        r.ext.rotation.y = rotationY;

        // Interno
        r.int.position.set(originX, aparams.displacement, 0);
        r.int.rotation.y = rotationY;

        return r;

    }


    //--------------------------------------------------------------------------
    // #region Extruders

    static #extrudeFoamedPanelAlongZ(
        aname: string,
        ashapes: BrdGlb_IIntExtShapes,
        adepth: number,
        astepLenght: number,
        amaterialsDefs: BrdGlb_IIntExtMaterialDef,
        ainserts: Blm.TC.BrdBlm_TC_IInsertParams[],
        alayer: number,
    ) {

        const userData: BrdGlb_IUserData = {
            signature: BrdGlb_IUserData_Signature,
            layer: alayer
        }

        const extrusionOptions: THREE.ExtrudeGeometryOptions = {
            depth: adepth,
            bevelEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.4, //spessore lamiera
            bevelSegments: 1,
            steps: Math.trunc(adepth / astepLenght) + 1,
        };

        const extClonedMaterial = (amaterialsDefs.ext.material) ?
            amaterialsDefs.ext.material.clone() :
            new THREE.MeshStandardMaterial({
                color: amaterialsDefs.ext.color
            })

        const intClonedMaterial = (amaterialsDefs.int.material) ?
            amaterialsDefs.int.material.clone() :
            new THREE.MeshStandardMaterial({
                color: amaterialsDefs.int.color
            })

        // Pannello con texture
        // TODO spostare tutto nella material Def in modo che sia il viewer ad 
        // applicare le texture  nel modo corretto -- APG 20240306
        if (extClonedMaterial.map) {
            const clonedTexture = extClonedMaterial.map.clone();
            // Sposta la texture in orizzontale per mescolare le ripetizioni in verticale
            clonedTexture.offset = new THREE.Vector2(Math.random(), 0);
            extClonedMaterial.map = clonedTexture;
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

        const extMesh = new THREE.Mesh(extGeometry, extClonedMaterial);
        BrdGlb_UVRemapperService.CubeMapping(extMesh);
        extMesh.name = aname + "_Ext";
        extMesh.userData = userData;

        const intMesh = new THREE.Mesh(intGeometry, intClonedMaterial);
        BrdGlb_UVRemapperService.CubeMapping(intMesh);
        intMesh.name = aname + "_Int";
        intMesh.userData = userData;

        const r: BrdGlb_IIntExtMeshes = {
            ext: extMesh,
            int: intMesh,
        };
        return r;
    }


    // #endregion
    //--------------------------------------------------------------------------

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