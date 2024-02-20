/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD_V_ST]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20231202
 * @version 0.2 APG 20231226 Spostato nel modulo BrdGlb
 * @version 0.3 APG 20231229 Estratto nel suo file
 * ----------------------------------------------------------------------------
 */

import {
    Blm,
    THREE,
} from "../../../../../deps.ts";
import {
    BrdGlb_eLayer
} from "../../../../../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_IMeshCouple
} from "../../../../../interfaces/BrdGlb_IMeshCouple.ts";
import {
    BrdGlb_IUserData,
    BrdGlb_IUserData_Signature
} from "../../../../../interfaces/BrdGlb_IUserData.ts";
import {
    BrdGlb_BaseExporterService
} from "../../../../../services/BrdGlb_BaseExporterService.ts";
import {
    BrdGlb_ShapeService
} from "../../../../../services/BrdGlb_ShapeService.ts";
import {
    BrdGlb_TC_SeD_TSlidingTracksMaterials_Recordset
} from "../../../types/BrdGlb_TC_SeD_TSlidingTracksMaterials_Recordset.ts";



/**
 * Gestore delle guide di scorrimento per i portoni sezionali verticali
 */
export class BrdGlb_TC_SeD_V_ST_Service extends BrdGlb_BaseExporterService {

    private static _trackMaterials: BrdGlb_TC_SeD_TSlidingTracksMaterials_Recordset | null = null;

    //--------------------------------------------------------------------------
    // #region Materials


    static #initMaterials() {

        const galvanizedMaterial = new THREE.MeshStandardMaterial({
            color: 0x888888,
            wireframe: this.DO_WIREFRAME,
        });
        const whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xFBFBFB,
            wireframe: this.DO_WIREFRAME,
        });
        const blackMaterial = new THREE.MeshStandardMaterial({
            color: 0x202020,
            wireframe: this.DO_WIREFRAME,
        });

        this._trackMaterials = {
            [Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTrackFinish.GALVANIZED]: galvanizedMaterial,
            [Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTrackFinish.WHITE]: whiteMaterial,
            [Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTrackFinish.BLACK]: blackMaterial,
        }

    }



    static #getMaterialFromFinish(
        afinish: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTrackFinish
    ) {

        if (this._trackMaterials == null) {
            this.#initMaterials();
        }

        return this._trackMaterials![afinish]!;
    }

    // #endregion
    //--------------------------------------------------------------------------



    //--------------------------------------------------------------------------
    // #region Shapes


    static #getShapeFromOutlineType(
        atype: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTracksOutlineType
    ) {

        const points = Blm.TC.SeD.BrdBlm_TC_SeD_SlidingTracksOutlines_Service.Get(atype);
        const r = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(points);

        return r;
    }


    static #getMirroredShapeFromOutlineType(
        atype: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTracksOutlineType
    ) {

        const points = Blm.TC.SeD.BrdBlm_TC_SeD_SlidingTracksOutlines_Service.Get(atype);
        const mirroredPoints = this.mirrorPointsAgainstYAxis(points);
        const r = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(mirroredPoints);

        return r;
    }

    // #endregion
    //--------------------------------------------------------------------------



    //--------------------------------------------------------------------------
    // #region Extrusions

    static #extrudeSlidingTrackCoupleAlongZ(
        aname: string,
        atype: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTracksOutlineType,
        alength: number,
        afinish: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTrackFinish,
        alayer: number
    ) {
        const userData: BrdGlb_IUserData = {
            signature: BrdGlb_IUserData_Signature,
            layer: alayer
        }

        const material = this.#getMaterialFromFinish(afinish);

        const rightShape = this.#getShapeFromOutlineType(atype);

        const rightMesh = this.extrudeXYShapeAlongZ(
            rightShape,
            alength,
            this.LINEAR_EXTRUSION_STEP,
            material
        );

        rightMesh.userData = userData;
        rightMesh.name = aname + "_Right";

        const leftShape = this.#getMirroredShapeFromOutlineType(atype);
        const leftMesh = this.extrudeXYShapeAlongZ(
            leftShape,
            alength,
            this.LINEAR_EXTRUSION_STEP,
            material
        )

        leftMesh.userData = userData;
        leftMesh.name = aname + "_Left"

        const r: BrdGlb_IMeshCouple = {
            right: rightMesh,
            left: leftMesh
        }

        return r;
    };



    static #extrudeSlidingTrackCoupleAlongPath(
        aname: string,
        atype: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTracksOutlineType,
        apath: THREE.Vector3[],
        afinish: Blm.TC.SeD.BrdBlm_TC_SeD_eSlidingTrackFinish,
        alayer: number
    ) {

        const userData: BrdGlb_IUserData = {
            signature: BrdGlb_IUserData_Signature,
            layer: alayer
        }
        const material = this.#getMaterialFromFinish(afinish);
        const pathSpline = new THREE.CatmullRomCurve3(apath);

        const rightShape = this.#getShapeFromOutlineType(atype);
        const rightMesh = this.extrudeXYShapeAlongPath(
            rightShape,
            pathSpline,
            (apath.length + 4) * 2,
            material
        );
        rightMesh.userData = userData;
        rightMesh.name = aname + "_Right";

        const leftShape = this.#getMirroredShapeFromOutlineType(atype);
        const leftMesh = this.extrudeXYShapeAlongPath(
            leftShape,
            pathSpline,
            (apath.length + 4) * 2,
            material
        );
        leftMesh.userData = userData;
        leftMesh.name = aname + "_Left";

        const r: BrdGlb_IMeshCouple = {
            right: rightMesh,
            left: leftMesh
        }

        return r;
    };



    // #endregion
    //--------------------------------------------------------------------------



    //--------------------------------------------------------------------------
    // #region Extruded profiled sheet metal


    static #buildCoupleOfProfiledSheetMetalBars(
        alayer: number,
        aprofiled?: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ProfiledSheetMetal,
    ) {

        let r: THREE.Object3D[] = [];
        if (!aprofiled) return r;
        if (!aprofiled.isStretch) return r;
        const stretch = aprofiled as Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_LinearStretch;

        const couple = this.#extrudeSlidingTrackCoupleAlongZ(
            stretch.name,
            stretch.outlineType,
            stretch.length,
            stretch.finish,
            alayer
        );

        r = this.placeCoupleWithOperations(couple, stretch.placement);

        return r;

    }




    static #buildCoupleOfProfiledSheetMetalRegularCurves(
        alayer: number,
        aprofile?: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ProfiledSheetMetal,
    ) {

        let r: THREE.Object3D[] = [];
        if (!aprofile) return r;
        if (!aprofile.isCurve) return r;
        const curve = aprofile as Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_RegularCurve;

        const vectorPath: THREE.Vector3[] = [];
        for (const p of curve.path) {
            vectorPath.push(new THREE.Vector3(
                p.x,
                p.y,
                // TODO Capire questo nasty hack che è necessario per fare estrudere 
                // le curve nel modo corretto. Se non si fa questo inverte le shape 
                // quando estrude lungo il percorso. Ma facendo questo costringe a 
                // fare una rotazione ulteriore di 180° sull'asse Y prima di 
                // posizionare le curve -- APG 20231220
                -p.z
            ));
        }

        const meshes = this.#extrudeSlidingTrackCoupleAlongPath(
            curve.name,
            curve.outlineType,
            vectorPath,
            curve.finish,
            alayer
        )

        r = this.placeCoupleWithOperations(
            meshes,
            curve.placement,
        );

        return r;

    }





    // #endregion
    //--------------------------------------------------------------------------



    //--------------------------------------------------------------------------
    // #region Stretches and curves



    static #buildAngleBarsFirstStretch(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.ANGLE_BARS_FIRST_STRETCH
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;
    }



    static #buildAngleBarsSecondStretch(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.ANGLE_BARS_SECOND_STRETCH
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;

    }



    static #buildHorizontalCProfiles(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.HORIZONTAL_C_PROFILES
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;
    };



    static #buildVerticalTracksFirstStretch(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.VERTICAL_TRACKS_FIRST_STRETCH
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;

    };



    static #buildVerticalTracksSecondStretch(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.VERTICAL_TRACKS_SECOND_STRETCH
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;

    };




    static #buildRegularCurve(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.REGULAR_CURVES
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalRegularCurves(layer, profile);

        return r;

    };



    static #buildLowerHorizontalTracks(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.HORIZONTAL_TRACKS
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;

    };



    static #buildUpperHorizontalTracks(
        aprofiles: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_TProfiledSheetMetalMap
    ) {

        const profile = aprofiles.get(
            Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_ePartName.HORIZONTAL_UPPER_TRACKS
        );

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_SLIDING);
        const r = this.#buildCoupleOfProfiledSheetMetalBars(layer, profile);

        return r;

    };


    // #endregion
    //--------------------------------------------------------------------------



    //--------------------------------------------------------------------------
    // #region Scene

    static Build(
        aparams: Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_IParams
    ) {

        const r = new THREE.Scene();

        r.rotation.y = this.RAD_180;
        r.name = aparams.name;

        const data = Blm.TC.SeD.V.ST.BrdBlm_TC_SeD_V_ST_Service.GetComponents(aparams);
        if (!data) return r;

        // Angolare verticale primo tratto
        const angleBarsFirstStretch = this.#buildAngleBarsFirstStretch(data);
        r.add(angleBarsFirstStretch[0]);
        r.add(angleBarsFirstStretch[1]);

        // Guida verticale primo tratto
        const verticalTracksFirstStretch = this.#buildVerticalTracksFirstStretch(data);
        r.add(verticalTracksFirstStretch[0]);
        r.add(verticalTracksFirstStretch[1]);

        // Angolare verticale secondo tratto solo per S3, S4 ecc.
        const angleBarsSecondStretch = this.#buildAngleBarsSecondStretch(data);
        if (angleBarsSecondStretch.length == 2) {
            // r.add(angleBarsSecondStretch[0]);
            // r.add(angleBarsSecondStretch[1]);
        }

        // Guida verticale secondo tratto, solo per S3, S4 ecc.
        const verticalTracksSecondStretch = this.#buildVerticalTracksSecondStretch(data);
        if (verticalTracksSecondStretch.length == 2) {
            // r.add(verticalTracksSecondStretch[0]);
            // r.add(verticalTracksSecondStretch[1]);
        }

        // Curva tranne che per S4, S4R
        const curves = this.#buildRegularCurve(data);
        if (curves.length == 2) {
            r.add(curves[0]);
            r.add(curves[1]);
        }

        // Profilo a C solo se non è STO, SMB3
        const horizontalCProfiles = this.#buildHorizontalCProfiles(data);
        if (horizontalCProfiles.length == 2) {
            r.add(horizontalCProfiles[0]);
            r.add(horizontalCProfiles[1]);
        }

        // Guida orizzontale inferiore solo se non è S4
        const lowerHorizontalTracks = this.#buildLowerHorizontalTracks(data);
        if (lowerHorizontalTracks.length == 2) {
            r.add(lowerHorizontalTracks[0]);
            r.add(lowerHorizontalTracks[1]);
        }

        // Guida orizzontale superiore solo se è STO, SR o S1
        const upperHorizontalTracks = this.#buildUpperHorizontalTracks(data);
        if (upperHorizontalTracks.length == 2) {
            r.add(upperHorizontalTracks[0]);
            r.add(upperHorizontalTracks[1]);
        }

        const helpers = this.buildPlanesHelpers(aparams.name);
        r.add(helpers);

        return r;
    }



    static async Export(
        aid: string,
        ascene: THREE.Scene,
        adoBinary = true
    ) {
        return await super.export(aid, ascene, adoBinary);
    }

    // #endregion
    //--------------------------------------------------------------------------



}