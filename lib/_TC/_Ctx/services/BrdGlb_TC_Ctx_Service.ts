/** ---------------------------------------------------------------------------
 * @module [BrdBlm_TC_Ctx]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 DLV 20230626
 * @version 0.2 APG 20230707
 * @version 0.3 APG 20231109 Pulizia e refactoring
 * @version 0.4 APG 20231227 Modulo BrdBlm server side
 * ----------------------------------------------------------------------------
 */


import {
    Uts,
    Blm,
    THREE
} from "../../../deps.ts";
import {
    BrdGlb_eLayer
} from "../../../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_IUserData,
    BrdGlb_IUserData_Signature
} from "../../../interfaces/BrdGlb_IUserData.ts";
import {
    BrdGlb_BaseExporterService
} from "../../../services/BrdGlb_BaseExporterService.ts";
import {
    BrdGlb_ShapeService
} from "../../../services/BrdGlb_ShapeService.ts";


const MODULE_NAME = "BrdGlb_ContextService";



type BrdGlb_TC_Ctx_TMaterialRecordset = Record<
    Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName,
    THREE.MeshStandardMaterial | null
>



/**
 * Gestore del contesto della scena
 */
export class BrdGlb_TC_Ctx_Service extends BrdGlb_BaseExporterService {



    static #getMaterialFromDef(
        adef: Blm.BrdBlm_IMaterialDef,
    ) {

        const r = new THREE.MeshStandardMaterial({
            color: adef.color,
            roughness: adef.roughness,
            userData:  adef
        });

        return r;
    }




    static #getContextMaterials(
        acontext: Blm.TC.Ctx.BrdBlm_TC_Ctx
    ) {


        const r: BrdGlb_TC_Ctx_TMaterialRecordset = {
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_THRESHOLD]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_BASEBOARD]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_RIGHT_BASEBOARD]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_SIDEWALK]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_RIGHT_SIDEWALK]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_FRAME]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_CANOPY]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_ROOF]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_LAMP]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_RIGHT_LAMP]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FACADE]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_RIGHT_WALL]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_CEILING]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FLOOR]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_BASEBOARD]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_RIGHT_BASEBOARD]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_COLUMN]: null,
            [Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_BEAM]: null,
        };


        const facadeDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE];
        if (facadeDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE] =
                this.#getMaterialFromDef(facadeDef);
        }

        const pavementDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT];
        if (pavementDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT] =
                this.#getMaterialFromDef(pavementDef);
        }

        const thresholdDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_THRESHOLD];
        if (thresholdDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_THRESHOLD] =
                this.#getMaterialFromDef(thresholdDef);
        }

        const extBaseboardDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_BASEBOARD];
        if (extBaseboardDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_BASEBOARD] =
                this.#getMaterialFromDef(extBaseboardDef);
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_RIGHT_BASEBOARD] =
                r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_BASEBOARD];
        }

        const wallsDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL];
        if (wallsDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL] =
                this.#getMaterialFromDef(wallsDef);
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_RIGHT_WALL] =
                r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL];
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FACADE] =
                r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL];
        }

        const floorDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FLOOR];
        if (floorDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FLOOR] =
                this.#getMaterialFromDef(floorDef);
        }

        const ceilingDef = acontext.materialDefs![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_CEILING];
        if (ceilingDef) {
            r[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_CEILING] =
                this.#getMaterialFromDef(ceilingDef);
        }

        return r;

    }




    static #buildComponent(
        alayer: number,
        acomponent: Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
        amaterial: THREE.MeshStandardMaterial | null
    ) {

        const userData: BrdGlb_IUserData = {
            signature: BrdGlb_IUserData_Signature,
            layer: alayer
        }

        const shape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
            acomponent.outline
        );

        if (amaterial == null) {
            amaterial = new THREE.MeshStandardMaterial({ color: 0xff00ff })
        }

        const mesh = this.$ExtrudeXYShapeAlongZ(
            shape,
            acomponent.length,
            this.LINEAR_EXTRUSION_STEP,
            amaterial
        );

        mesh.name = acomponent.name;
        mesh.userData = userData;

        const r = this.$PlaceMeshWithOperations(mesh, acomponent.placementOps, false)

        return r;
    }




    //--------------------------------------------------------------------------
    // #region Scene

    static Build(
        alogger: Uts.BrdUts_Logger,
        aparams: Blm.TC.Ctx.BrdBlm_TC_Ctx_IParams,
    ) {

        alogger.begin(MODULE_NAME, this.Build.name);

        const r = new THREE.Scene();

        r.name = aparams.name;

        const context = new Blm.TC.Ctx.BrdBlm_TC_Ctx(aparams);

        if (!context.status.ok) return r;

        const materials = this.#getContextMaterials(context);

        let layer = parseInt(BrdGlb_eLayer.CONTEXT_OUTSIDE);

        const extFacadeComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE];
        if (extFacadeComponent) {
            const object = this.#buildComponent(
                layer,
                extFacadeComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE]
            )
            r.add(object);
        }

        const pavementComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT];
        if (pavementComponent) {
            const object = this.#buildComponent(
                layer,
                pavementComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT]
            )
            r.add(object);
        }

        const thresholdComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_THRESHOLD];
        if (thresholdComponent) {
            const object = this.#buildComponent(
                layer,
                thresholdComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_THRESHOLD]
            )
            r.add(object);
        }

        const extLeftBaseboardComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_BASEBOARD];
        if (extLeftBaseboardComponent) {
            const object = this.#buildComponent(
                layer,
                extLeftBaseboardComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_LEFT_BASEBOARD]
            )
            r.add(object);
        }

        const extRightBaseboardComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_RIGHT_BASEBOARD];
        if (extRightBaseboardComponent) {
            const object = this.#buildComponent(
                layer,
                extRightBaseboardComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.EXTERN_RIGHT_BASEBOARD]
            )
            r.add(object);
        }

        layer = parseInt(BrdGlb_eLayer.CONTEXT_INSIDE);

        const intFacadeComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FACADE];
        if (intFacadeComponent) {
            const object = this.#buildComponent(
                layer,
                intFacadeComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FACADE]
            )
            r.add(object);
        }

        const floorComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FLOOR];
        if (floorComponent) {
            const object = this.#buildComponent(
                layer,
                floorComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_FLOOR]
            )
            r.add(object);
        }

        const ceilingComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_CEILING];
        if (ceilingComponent) {
            const object = this.#buildComponent(
                layer,
                ceilingComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_CEILING]
            )
            r.add(object);
        }

        const leftWallComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL];
        if (leftWallComponent) {
            const object = this.#buildComponent(
                layer,
                leftWallComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL]
            )
            r.add(object);
        }

        const rightWallComponent = context.components![Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_RIGHT_WALL];
        if (rightWallComponent) {
            const object = this.#buildComponent(
                layer,
                rightWallComponent as Blm.TC.Ctx.BrdBlm_TC_Ctx_Component,
                materials[Blm.TC.Ctx.BrdBlm_TC_Ctx_ePartName.INTERN_RIGHT_WALL]
            )
            r.add(object);
        }


        alogger.end('Context building completed');

        return r;

    }





    static async Export(
        aid: string,
        ascene: THREE.Scene,
        adoBinary = true
    ) {
        return await super.$Export(aid, ascene, adoBinary);
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
 * --------------------------------------------------------------------------- 
 */