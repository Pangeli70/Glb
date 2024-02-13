/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD_V_Co]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231109 Ridenominazione, Pulizia e refactoring
 * @version 0.3 APG 20240102 Spostato nel modulo BrdGlb
 * ----------------------------------------------------------------------------
 */

import {
    Blm,
    THREE,
    Uts
} from "../../../../../deps.ts";
import {
    BrdGlb_eLayer
} from "../../../../../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_ShapeService
} from "../../../../../services/BrdGlb_ShapeService.ts";
import {
    BrdGlb_TC_SeD_ICoatGasketsMaterials
} from "../../../interfaces/BrdGlb_TC_SeD_ICoatGasketsMaterials.ts";
import {
    BrdGlb_TC_SeD_V_Co_GasketsShapes
} from "../BrdGlb_TC_SeD_V_Co_GasketsShapes.ts";

export const MODULE_NAME = "BrdGlb_TC_SeD_V_Co_GasketsService";



export class BrdGlb_TC_SeD_V_Co_GasketsService {

    logger: Uts.BrdUts_Logger;


    constructor(alogger: Uts.BrdUts_Logger) {
        this.logger = alogger;
    }



    #makeGasketsShapes() {

        const aluGasketProfile: Blm.BrdBlm_IPoint2D[] = [
            { x: 0, y: 0 },
            { x: 42, y: 0 },
            { x: 42, y: 40 },
            { x: 44, y: 40 },
            { x: 44, y: -10 },
            { x: -2, y: -10 },
            { x: -2, y: 10 },
            { x: 0, y: 10 },
        ]
        const topBottomAluProfile = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(aluGasketProfile);


        const bottomGasketProfile: Blm.BrdBlm_IPoint2D[] = [
            { x: 0, y: 0 },
            { x: 42, y: 0 },
            { x: 32, y: -20 },
            { x: 36, y: -27 },
            { x: 36, y: -33 },
            { x: 32, y: -40 },
            { x: 36, y: -45 },
            { x: 6, y: -45 },
            { x: 10, y: -40 },
            { x: 6, y: -33 },
            { x: 6, y: -27 },
            { x: 10, y: -20 },
        ]
        const bottomGasket = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(bottomGasketProfile);


        const topGasketProfile: Blm.BrdBlm_IPoint2D[] = [
            { x: 0, y: 0 },
            { x: 3, y: 3 },
            { x: -20, y: 23 },
            { x: -18, y: 25 },
            { x: 10, y: 0 },
        ]
        const topGasket = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(topGasketProfile);


        const lateralGasketProfile: Blm.BrdBlm_IPoint2D[] = [
            { x: 0, y: 0 },
            { x: -20, y: 0 },
            { x: -20, y: 2 },
            { x: -2, y: 2 },
            { x: -2, y: 8 },
            { x: -20, y: 8 },
            { x: -20, y: 10 },
            { x: -2, y: 10 },
            { x: 18, y: 18 },
            { x: 0, y: 6 },
        ]
        const lateralGasket = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(lateralGasketProfile);


        const r: BrdGlb_TC_SeD_V_Co_GasketsShapes = {
            topBottomAluProfile,
            bottomGasket,
            topGasket,
            lateralGasket
        };
        return r;
    }



    #getGasketsMaterials() {

        const rubber = new THREE.MeshPhongMaterial({
            color: 0x202020,
        });
        
        const scotchBriteBlack = new THREE.MeshPhongMaterial({
            color: 0x404040,
            // TODO Add a bit of reflectivity to alu material -- APG 20231109
        });
        
        const r: BrdGlb_TC_SeD_ICoatGasketsMaterials = {
            rubber,
            scotchBriteBlack
        };
        return r;
    }



    #SeD_extrudeGasketMesh(
        alenght: number,
        ashape: THREE.Shape,
        amaterial: THREE.Material,
        aname: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames
    ) {
        const extrusionOptions = {
            depth: alenght,
            steps: 1,
        };
        const geometry = new THREE.ExtrudeGeometry(ashape, extrusionOptions);
        const r = new THREE.Mesh(geometry, amaterial);

        r.receiveShadow = true;
        r.castShadow = true;

        const layer = parseInt(BrdGlb_eLayer.PRODUCT_COAT);
        r.layers.set(layer);
        r.name = aname;
        return r;
    }



    SeD_build(
        ascene: THREE.Scene,
        adoor: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorParams
    ) {
        const start = performance.now();

        const yDisplacement = 55;
        const zDisplacement = -20;
        const horizLenght = adoor.width + 20;
        const verticalLenght = adoor.height + 20;
        const originX = -horizLenght / 2;
        const rot90Deg = Math.PI / 2;
        const rot180Deg = Math.PI;
        const scale = 1;

        const gasketsMaterials = this.#getGasketsMaterials();
        const gasketShapes = this.#makeGasketsShapes();


        const baseAluProfile = this.#SeD_extrudeGasketMesh(
            horizLenght,
            gasketShapes.topBottomAluProfile,
            gasketsMaterials.scotchBriteBlack,
            Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames.BASE_ALU_PROFILE
        );
        baseAluProfile.position.set(originX, yDisplacement, zDisplacement);
        baseAluProfile.rotation.y = rot90Deg;
        baseAluProfile.scale.set(scale, scale, scale);
        ascene.add(baseAluProfile);


        const topAluProfile = baseAluProfile.clone(false);
        topAluProfile.name = Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames.TOP_ALU_PROFILE
        const topYDisplacement = adoor.height - 10;
        topAluProfile.position.set(-originX, topYDisplacement, zDisplacement);
        topAluProfile.rotation.y = -rot90Deg;
        topAluProfile.rotation.x = rot180Deg;
        topAluProfile.scale.set(scale, scale, scale);
        ascene.add(topAluProfile);


        const bottomGasket = this.#SeD_extrudeGasketMesh(
            horizLenght,
            gasketShapes.bottomGasket,
            gasketsMaterials.rubber,
            Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames.BOTTOM_GASKET
        );
        bottomGasket.position.set(originX, yDisplacement - 10, zDisplacement);
        bottomGasket.rotation.y = rot90Deg;
        bottomGasket.scale.set(scale, scale, scale);
        ascene.add(bottomGasket);


        const rightGasket = this.#SeD_extrudeGasketMesh(
            verticalLenght,
            gasketShapes.lateralGasket,
            gasketsMaterials.rubber,
            Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames.RIGHT_GASKET
        );
        rightGasket.position.set(originX, 0, 0);
        rightGasket.rotation.x = -rot90Deg;
        rightGasket.scale.set(scale, scale, scale);
        ascene.add(rightGasket);


        const leftGasket = rightGasket.clone(false);
        leftGasket.name = Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames.LEFT_GASKET
        leftGasket.position.set(originX, 0, 0);
        // NOTE Flip trick using a pivot for rotation -- APG 20230630
        const mirrorPivot = new THREE.Group();
        mirrorPivot.position.set(0, verticalLenght, 0);
        mirrorPivot.rotation.z = rot180Deg;
        mirrorPivot.add(leftGasket);
        ascene.add(mirrorPivot);


        const topGasket = this.#SeD_extrudeGasketMesh(
            horizLenght,
            gasketShapes.topGasket,
            gasketsMaterials.rubber,
            Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eCoatGasketsPartNames.TOP_GASKET
        );
        topGasket.position.set(originX, topYDisplacement + 10, zDisplacement);
        topGasket.rotation.y = rot90Deg;
        topGasket.scale.set(scale, scale, scale);
        ascene.add(topGasket);


        this.logger.log('Gaskets are built');
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
