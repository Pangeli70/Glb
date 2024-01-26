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
    BrdGlb_eLayer
} from "../../enums/BrdGlb_eLayer.ts";
import {
    BrdGlb_ShapeService
} from "../../services/BrdGlb_ShapeService.ts";
import {
    BrdGlb_UVRemapperService
} from "../../services/BrdGlb_UVRemapperService.ts";

import {
    BrdUts_Logger
} from "../../../../Uts/lib/classes/BrdUts_Logger.ts";
import {
    BrdBlm_IPoint2D
} from "../../../../Blm/lib/interfaces/BrdBlm_IPoint2D.ts";
import { BrdBlm_TC_Ctx_Part } from "../../../../Blm/lib/_TC/_Ctx/classes/BrdBlm_TC_Ctx_Part.ts";
import {
    BrdBlm_TC_Ctx_eFacadeColor
} from "../../../../Blm/lib/_TC/_Ctx/enums/BrdBlm_TC_Ctx_eFacadeColor.ts";
import {
    BrdBlm_TC_Ctx_eFacadeTexture
} from "../../../../Blm/lib/_TC/_Ctx/enums/BrdBlm_TC_Ctx_eFacadeTexture.ts";
import {
    BrdBlm_TC_Ctx_ePartName
} from "../../../../Blm/lib/_TC/_Ctx/enums/BrdBlm_TC_Ctx_ePartName.ts";
import {
    BrdBlm_TC_Ctx_ePavementTexture
} from "../../../../Blm/lib/_TC/_Ctx/enums/BrdBlm_TC_Ctx_ePavementTexture.ts";
import {
    BrdBlm_TC_Ctx_eWallColor
} from "../../../../Blm/lib/_TC/_Ctx/enums/BrdBlm_TC_Ctx_eWallColor.ts";
import {
    BrdBlm_TC_Ctx_eWallTexture
} from "../../../../Blm/lib/_TC/_Ctx/enums/BrdBlm_TC_Ctx_eWallTexture.ts";
import {
    BrdBlm_TC_Ctx_IParams
} from "../../../../Blm/lib/_TC/_Ctx/interfaces/BrdBlm_TC_Ctx_IParams.ts";
import { Brd3Dv_AssetsServer, THREE } from "../../deps.ts";

const MODULE_NAME = "Brd3Dv_ContextBuilder";



export interface Brd3Dv_IContextMaterials {

    externWall: THREE.MeshStandardMaterial;
    externPavement: THREE.MeshStandardMaterial;
    externThreshold: THREE.MeshStandardMaterial;
    externBaseboards: THREE.MeshStandardMaterial;

    internWalls: THREE.MeshStandardMaterial;
    internFloor: THREE.MeshStandardMaterial;
    internCeiling: THREE.MeshStandardMaterial;

    sectionCap: THREE.MeshStandardMaterial;
}

/**
 * Costruttore del contesto della scena
 */
export class BrdBlm_TC_Ctx_Service {

    _logger: BrdUts_Logger;
    maxAnysotropy: number;

    parts: Map<BrdBlm_TC_Ctx_ePartName, BrdBlm_TC_Ctx_Part> = new Map();

    /** Suddivide la geometria estrusa ogni xxx mm */
    readonly EXTRUSION_TASSELLATION_DISTANCE = 500;

    /** Spazio laterale aggiuntivo sulla facciata oltre allo spessore delle pareti in mm */
    readonly EXTRA_LATERAL_SPACE = 1000;
    /** Spazio superiore aggintivo sulla facciata oltre allo spessore del soffitto in mm */
    readonly EXTRA_UPPER_SPACE = 1000;
    /** Spessore della pavimentazione esterna in mm */
    readonly PAVEMENT_THICKNESS = 50;
    /** Altezza base dei battiscopa in mm */
    readonly BASEBOARD_BASE_HEIGHT = 100;
    /** Spessore del battiscopa in mm*/
    readonly BASEBOARD_THICKNESS = 15;



    constructor(alogger: BrdUts_Logger, amaxAnysotropy: number) {
        this._logger = alogger;
        this.maxAnysotropy = amaxAnysotropy;
    }



    getParts(acontext: BrdBlm_TC_Ctx_IParams) {

        let part = this.#getFacadePart(acontext);
        this.parts.set(part.name, part);

        part = this.#getPavementPart(acontext);
        this.parts.set(part.name, part);

        part = this.#getThresholdPart(acontext);
        this.parts.set(part.name, part);

    }



    #getFacadePart(acontext: BrdBlm_TC_Ctx_IParams) {

        const part = new BrdBlm_TC_Ctx_Part(BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE);

        const halfWidth = acontext.holeWidth / 2;

        const totalRightExternal = halfWidth
            + acontext.leftEmbrasure
            + acontext.wallThickness
            + this.EXTRA_LATERAL_SPACE;

        const totalLeftExternal = -(
            halfWidth
            + acontext.rightEmbrasure
            + acontext.wallThickness
            + this.EXTRA_LATERAL_SPACE
        );

        const totalHeight = acontext.holeHeight
            + acontext.holeLintel
            + acontext.holeLintelAdditionalHeight
            + acontext.ceilingThickness
            + this.EXTRA_UPPER_SPACE;

        part.profile = [
            { x: 0, y: acontext.holeHeight },
            { x: halfWidth, y: acontext.holeHeight },
            { x: halfWidth, y: 0 },
            { x: totalRightExternal, y: 0 },
            { x: totalRightExternal, y: totalHeight, },
            { x: totalLeftExternal, y: totalHeight, },
            { x: totalLeftExternal, y: 0 },
            { x: -halfWidth, y: 0 },
            { x: -halfWidth, y: acontext.holeHeight },
        ];

        return part;
    }


    #getPavementPart(acontext: BrdBlm_TC_Ctx_IParams) {

        const part = new BrdBlm_TC_Ctx_Part(BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT);

        const halfWidth = acontext.holeWidth / 2;

        const totalLeftExternal = -(
            halfWidth
            + acontext.rightEmbrasure
            + acontext.wallThickness
            + this.EXTRA_LATERAL_SPACE
        );

        const totalRightExternal = halfWidth
            + acontext.leftEmbrasure
            + acontext.wallThickness
            + this.EXTRA_LATERAL_SPACE;

        part.profile = [
            { x: totalLeftExternal, y: -this.PAVEMENT_THICKNESS },
            { x: totalLeftExternal, y: 0 },
            { x: totalRightExternal, y: 0 },
            { x: totalRightExternal, y: -this.PAVEMENT_THICKNESS },
        ];

        return part;
    }


    #getThresholdPart(acontext: BrdBlm_TC_Ctx_IParams) {

        const part = new BrdBlm_TC_Ctx_Part(BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT);

        const halfWidth = acontext.holeWidth / 2;

        const holeLeftExternal = - halfWidth;
        const holeRightExternal = halfWidth;

        part.profile = [
            { x: holeLeftExternal, y: -this.PAVEMENT_THICKNESS },
            { x: holeLeftExternal, y: 0 },
            { x: holeRightExternal, y: 0 },
            { x: holeRightExternal, y: -this.PAVEMENT_THICKNESS },
        ];

        return part;

    }


    #getShapeFromPart(aname: BrdBlm_TC_Ctx_ePartName) {

        const part = this.parts.get(aname)!;

        const r = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(part.profile);

        return r;
    }





    #getBaseboardsShapes(acontext: BrdBlm_TC_Ctx_IParams,) {

        const halfWidth = acontext.holeWidth / 2;

        const totalRightExternal =
            halfWidth
            + acontext.leftEmbrasure
            + acontext.wallThickness
            + this.EXTRA_LATERAL_SPACE;

        const totalLeftExternal = - (
            halfWidth
            + acontext.rightEmbrasure
            + acontext.wallThickness
            + this.EXTRA_LATERAL_SPACE
        );

        const leftProfile: BrdBlm_IPoint2D[] = [
            { x: -halfWidth, y: 0 },
            { x: -halfWidth + this.BASEBOARD_THICKNESS, y: 0 },
            { x: -halfWidth + this.BASEBOARD_THICKNESS, y: -acontext.wallThickness - this.BASEBOARD_THICKNESS },
            { x: totalLeftExternal, y: -acontext.wallThickness - this.BASEBOARD_THICKNESS },
            { x: totalLeftExternal, y: -acontext.wallThickness },
            { x: -halfWidth, y: -acontext.wallThickness },
        ];

        const rightProfile: BrdBlm_IPoint2D[] = [
            { x: halfWidth, y: 0 },
            { x: halfWidth - this.BASEBOARD_THICKNESS, y: 0 },
            { x: halfWidth - this.BASEBOARD_THICKNESS, y: -acontext.wallThickness - this.BASEBOARD_THICKNESS },
            { x: totalRightExternal, y: -acontext.wallThickness - this.BASEBOARD_THICKNESS },
            { x: totalRightExternal, y: -acontext.wallThickness },
            { x: halfWidth, y: -acontext.wallThickness },
        ];

        const r = {
            leftBaseboardShape: BrdGlb_ShapeService.GetShapeFromArrayOfPoints(leftProfile),
            rightBaseboardShape: BrdGlb_ShapeService.GetShapeFromArrayOfPoints(rightProfile)
        }
        return r;
    }



    #makeInterWallsShapes(acontext: BrdBlm_TC_Ctx_IParams,) {

        const totalRightExternal =
            acontext.holeWidth / 2
            + acontext.leftEmbrasure

        const totalLeftExternal = - (
            acontext.holeWidth / 2
            + acontext.rightEmbrasure
        );

        const totalWallHeight =
            acontext.holeHeight
            + acontext.holeLintel
            + acontext.holeLintelAdditionalHeight
            + acontext.ceilingThickness

        const rightWallProfile: BrdBlm_IPoint2D[] = [
            { x: totalRightExternal, y: 0 },
            { x: totalRightExternal, y: totalWallHeight },
            { x: totalRightExternal + acontext.wallThickness, y: totalWallHeight },
            { x: totalRightExternal + acontext.wallThickness, y: 0 },
        ];
        const leftWallProfile: BrdBlm_IPoint2D[] = [
            { x: totalLeftExternal, y: 0 },
            { x: totalLeftExternal - acontext.wallThickness, y: 0 },
            { x: totalLeftExternal - acontext.wallThickness, y: totalWallHeight },
            { x: totalLeftExternal, y: totalWallHeight },
        ];

        const r = {
            rightWallShape: BrdGlb_ShapeService.GetShapeFromArrayOfPoints(rightWallProfile),
            leftWallShape: BrdGlb_ShapeService.GetShapeFromArrayOfPoints(leftWallProfile)
        }
        return r;

    }



    #makeCeilingAndFloorShapes(acontext: BrdBlm_TC_Ctx_IParams,) {

        const totalRightExternal =
            acontext.holeWidth / 2
            + acontext.leftEmbrasure

        const totalLeftExternal = - (
            acontext.holeWidth / 2
            + acontext.rightEmbrasure
        );

        const totalCeilingHeight =
            acontext.holeHeight
            + acontext.holeLintel
            + acontext.holeLintelAdditionalHeight;

        const ceilingProfile: BrdBlm_IPoint2D[] = [
            { x: totalRightExternal, y: totalCeilingHeight },
            { x: totalLeftExternal, y: totalCeilingHeight },
            { x: totalLeftExternal, y: totalCeilingHeight + acontext.ceilingThickness },
            { x: totalRightExternal, y: totalCeilingHeight + acontext.ceilingThickness },
        ];
        const floorProfile: BrdBlm_IPoint2D[] = [
            { x: totalRightExternal, y: 0 },
            { x: totalLeftExternal, y: 0 },
            { x: totalLeftExternal, y: -acontext.floorThickness },
            { x: totalRightExternal, y: -acontext.floorThickness },
        ];
        const r = {
            ceilingShape: BrdGlb_ShapeService.GetShapeFromArrayOfPoints(ceilingProfile),
            floorShape: BrdGlb_ShapeService.GetShapeFromArrayOfPoints(floorProfile)
        }
        return r;

    }



    #getRandomFromEnum<E>(aenum: any) {
        const keys = Object.keys(aenum);
        const index = Math.floor(Math.random() * keys.length);
        const key = keys[index];
        return aenum[key] as E;
    }



    #getContextMaterials() {

        this._logger.begin(MODULE_NAME, this.#getContextMaterials.name);

        const baseUrl = Brd3Dv_AssetsServer + "/assets/img/jpg/textures/context/"

        const textureLoader = new THREE.TextureLoader();

        const randomFacadeTextureName = this.#getRandomFromEnum<BrdBlm_TC_Ctx_eFacadeTexture>(BrdBlm_TC_Ctx_eFacadeTexture);
        this._logger.log('Facade texture: ' + randomFacadeTextureName);
        const facadeTextureFile = baseUrl + "outdoor/facade/" + randomFacadeTextureName;
        const facadeTexture = textureLoader.load(facadeTextureFile);

        facadeTexture.wrapS = THREE.RepeatWrapping;
        facadeTexture.wrapT = THREE.RepeatWrapping;
        facadeTexture.repeat.set(1, 1);
        facadeTexture.anisotropy = this.maxAnysotropy;
        // TODO Rotation depends on texture characteristics -- APG 20230725
        if (randomFacadeTextureName != BrdBlm_TC_Ctx_eFacadeTexture.FINE_BLOCKS) {
            facadeTexture.rotation = Math.PI * 2 / 360 * 30;
        }
        facadeTexture.colorSpace = THREE.SRGBColorSpace;

        const randomFacadeColor = this.#getRandomFromEnum<BrdBlm_TC_Ctx_eFacadeColor>(BrdBlm_TC_Ctx_eFacadeColor);
        this._logger.log('Facade color: ' + randomFacadeColor);

        const externWall = new THREE.MeshStandardMaterial({
            color: randomFacadeColor,
            map: facadeTexture,
            bumpMap: facadeTexture,
            bumpScale: 100,
            wireframe: false,
        });

        const randomPavementTextureName = this.#getRandomFromEnum<BrdBlm_TC_Ctx_ePavementTexture>(BrdBlm_TC_Ctx_ePavementTexture);
        this._logger.log('Pavement texture: ' + randomPavementTextureName);
        const pavementTextureFile = baseUrl + "outdoor/pavement/" + randomPavementTextureName;
        const pavementTexture = textureLoader.load(pavementTextureFile);

        pavementTexture.matrixAutoUpdate = true;
        pavementTexture.wrapS = THREE.RepeatWrapping;
        pavementTexture.wrapT = THREE.RepeatWrapping;
        // TODO Set the tile repetition for every type ot texture -- APG 20230725 
        pavementTexture.repeat.set(1, 1);
        pavementTexture.anisotropy = this.maxAnysotropy;
        pavementTexture.rotation = Math.PI * 2 / 360 * 45;
        pavementTexture.needsUpdate = true;

        const externPavement = new THREE.MeshStandardMaterial({
            color: 0xDDEEDD,
            map: pavementTexture,
            bumpMap: pavementTexture,
            bumpScale: 100,
            wireframe: false
        });

        const externThreshold = new THREE.MeshStandardMaterial({
            color: 0x889898,
            roughness: 0.5
        });
        const externBaseboards = new THREE.MeshStandardMaterial({
            color: 0xAABBBB,
            roughness: 0.5,
        });

        const wallsTextureName = BrdBlm_TC_Ctx_eWallTexture.SMOOTH_MORTAR;
        const wallsTextureFile = baseUrl + "indoor/walls/" + wallsTextureName;

        this._logger.log('Walls texture: ' + wallsTextureName);

        const randomWallsColor = this.#getRandomFromEnum<BrdBlm_TC_Ctx_eWallColor>(BrdBlm_TC_Ctx_eWallColor);
        this._logger.log('Walls color: ' + randomWallsColor);

        const wallsTexture = textureLoader.load(wallsTextureFile);
        wallsTexture.wrapS = THREE.RepeatWrapping;
        wallsTexture.wrapT = THREE.RepeatWrapping;
        wallsTexture.repeat.set(0.5, 0.5);
        wallsTexture.colorSpace = THREE.SRGBColorSpace;


        const internWalls = new THREE.MeshStandardMaterial({
            color: randomWallsColor,
            map: wallsTexture,
            bumpMap: wallsTexture,
            bumpScale: 10,
            wireframe: false,
        });


        const internFloor = new THREE.MeshStandardMaterial({
            color: 0x553333,
            wireframe: false,
        });


        const internCeiling = new THREE.MeshStandardMaterial({
            color: randomWallsColor,
            map: wallsTexture,
            bumpMap: wallsTexture,
            wireframe: false,
        });


        const sectionCap = new THREE.MeshStandardMaterial({
            color: 0xffc61a,
            wireframe: false,
        });


        const r: Brd3Dv_IContextMaterials = {
            externWall,
            externPavement,
            externThreshold,
            externBaseboards,
            internWalls,
            internFloor,
            internCeiling,
            sectionCap
        };

        this._logger.end();

        return r;
    }



    #extrudeXYShapeAlongZ(
        ashape: THREE.Shape,
        adepth: number,
        amaterial: THREE.MeshStandardMaterial
    ) {
        const extrusionParams = {
            depth: adepth,
            steps: Math.trunc(adepth / this.EXTRUSION_TASSELLATION_DISTANCE) + 1,
        };

        const geometry = new THREE.ExtrudeGeometry(
            ashape,
            extrusionParams
        );

        const r = new THREE.Mesh(geometry, amaterial);

        r.receiveShadow = true;
        r.castShadow = true;

        BrdGlb_UVRemapperService.CubeMapping(r);

        return r;

    }



    #extrudeFacade(
        acontext: BrdBlm_TC_Ctx_IParams,
        acontextMaterials: Brd3Dv_IContextMaterials
    ) {

        const name = BrdBlm_TC_Ctx_ePartName.EXTERN_FACADE;
        const shape = this.#getShapeFromPart(name);
        const r = this.#extrudeXYShapeAlongZ(
            shape,
            acontext.wallThickness,
            acontextMaterials.externWall
        );

        r.layers.set(BrdGlb_eLayer.CONTEXT_OUTSIDE);
        r.name = name;

        return r;
    }



    #extrudePavement(
        acontext: BrdBlm_TC_Ctx_IParams,
        acontextMaterials: Brd3Dv_IContextMaterials
    ) {

        const name = BrdBlm_TC_Ctx_ePartName.EXTERN_PAVEMENT;
        const shape = this.#getShapeFromPart(name);

        const r = this.#extrudeXYShapeAlongZ(
            shape,
            acontext.floorDepth,
            acontextMaterials.externPavement,
        );
        r.layers.set(BrdGlb_eLayer.CONTEXT_OUTSIDE);
        r.name = name;

        return r;

    }



    #extrudeThreshold(
        acontext: BrdBlm_TC_Ctx_IParams,
        acontextMaterials: Brd3Dv_IContextMaterials
    ) {
        const name = BrdBlm_TC_Ctx_ePartName.EXTERN_THRESHOLD;
        const shape = this.#getShapeFromPart(name);

        const r = this.#extrudeXYShapeAlongZ(
            shape,
            acontext.wallThickness,
            acontextMaterials.externThreshold
        );
        r.layers.set(BrdGlb_eLayer.CONTEXT_OUTSIDE);
        r.name = name;

        return r;
    }



    #extrudeBaseboards(
        acontext: BrdBlm_TC_Ctx_IParams,
        acontextMaterials: Brd3Dv_IContextMaterials
    ) {

        const randomizedBaseboardHeight = (Math.round((Math.random() / 0.25)) + 1) * this.BASEBOARD_BASE_HEIGHT
        const baseBoardShapes = this.#getBaseboardsShapes(acontext);

        const leftBaseboardMesh = this.#extrudeXYShapeAlongZ(
            baseBoardShapes.leftBaseboardShape,
            randomizedBaseboardHeight,
            acontextMaterials.externBaseboards
        );
        leftBaseboardMesh.layers.set(BrdGlb_eLayer.CONTEXT_OUTSIDE);
        leftBaseboardMesh.name = BrdBlm_TC_Ctx_ePartName.EXTERN_BASEBOARDS;

        const rightBaseboardMesh = this.#extrudeXYShapeAlongZ(
            baseBoardShapes.rightBaseboardShape,
            randomizedBaseboardHeight,
            acontextMaterials.externBaseboards
        );
        rightBaseboardMesh.layers.set(BrdGlb_eLayer.CONTEXT_OUTSIDE);
        rightBaseboardMesh.name = BrdBlm_TC_Ctx_ePartName.EXTERN_BASEBOARDS;

        return {
            leftBaseboardMesh,
            rightBaseboardMesh
        }
    }



    #extrudeInternWalls(
        acontext: BrdBlm_TC_Ctx_IParams,
        acontextMaterials: Brd3Dv_IContextMaterials
    ) {
        const internWallShapes = this.#makeInterWallsShapes(acontext);

        const leftWallMesh = this.#extrudeXYShapeAlongZ(
            internWallShapes.leftWallShape,
            acontext.floorDepth,
            acontextMaterials.internWalls
        );
        leftWallMesh.position.z = -acontext.floorDepth;
        leftWallMesh.layers.set(BrdGlb_eLayer.CONTEXT_INSIDE);
        leftWallMesh.name = BrdBlm_TC_Ctx_ePartName.INTERN_LEFT_WALL;

        const rightWallMesh = this.#extrudeXYShapeAlongZ(
            internWallShapes.rightWallShape,
            acontext.floorDepth,
            acontextMaterials.internWalls
        );
        rightWallMesh.position.z = -acontext.floorDepth;
        rightWallMesh.layers.set(BrdGlb_eLayer.CONTEXT_INSIDE);
        rightWallMesh.name = BrdBlm_TC_Ctx_ePartName.INTERN_RIGHT_WALL;

        const r = {
            leftWallMesh,
            rightWallMesh
        }

        return r;
    }



    #extrudeCeilingAndFloor(
        acontext: BrdBlm_TC_Ctx_IParams,
        acontextMaterials: Brd3Dv_IContextMaterials
    ) {

        const ceilingAndFloorShapes = this.#makeCeilingAndFloorShapes(acontext);

        const floorMesh = this.#extrudeXYShapeAlongZ(
            ceilingAndFloorShapes.floorShape,
            acontext.floorDepth,
            acontextMaterials.internFloor
        );
        floorMesh.position.z = - acontext.floorDepth;
        floorMesh.layers.set(BrdGlb_eLayer.CONTEXT_INSIDE);
        floorMesh.name = BrdBlm_TC_Ctx_ePartName.INTERN_FLOOR;

        const ceilingMesh = this.#extrudeXYShapeAlongZ(
            ceilingAndFloorShapes.ceilingShape,
            acontext.floorDepth,
            acontextMaterials.internCeiling
        );
        ceilingMesh.position.z = - acontext.floorDepth;
        ceilingMesh.layers.set(BrdGlb_eLayer.CONTEXT_INSIDE);
        ceilingMesh.name = BrdBlm_TC_Ctx_ePartName.INTERN_CEILING;

        const r = {
            floorMesh,
            ceilingMesh,
        }
        return r;
    }



    build(
        acontext: BrdBlm_TC_Ctx_IParams,
    ) {
        this._logger.begin(MODULE_NAME, this.build.name);

        const contextMaterials = this.#getContextMaterials();

        const r: THREE.Mesh[] = []

        const facadeMesh = this.#extrudeFacade(acontext, contextMaterials);
        r.push(facadeMesh);


        const externPavementMesh = this.#extrudePavement(acontext, contextMaterials);
        externPavementMesh.position.y = -20
        r.push(externPavementMesh);


        const thresholdMesh = this.#extrudeThreshold(acontext, contextMaterials);
        r.push(thresholdMesh);


        const baseboardsMeshes = this.#extrudeBaseboards(acontext, contextMaterials);

        baseboardsMeshes.leftBaseboardMesh.rotation.x = -Math.PI / 2;
        baseboardsMeshes.leftBaseboardMesh.position.y = -20;
        baseboardsMeshes.leftBaseboardMesh.updateMatrix();
        r.push(baseboardsMeshes.leftBaseboardMesh);

        baseboardsMeshes.rightBaseboardMesh.rotation.x = -Math.PI / 2;
        baseboardsMeshes.rightBaseboardMesh.position.y = -20;
        baseboardsMeshes.rightBaseboardMesh.updateMatrix();
        r.push(baseboardsMeshes.rightBaseboardMesh);


        const internWallMeshes = this.#extrudeInternWalls(acontext, contextMaterials);
        r.push(internWallMeshes.leftWallMesh);
        r.push(internWallMeshes.rightWallMesh);


        const ceilingAndFloorMeshes = this.#extrudeCeilingAndFloor(acontext, contextMaterials);
        r.push(ceilingAndFloorMeshes.ceilingMesh);
        r.push(ceilingAndFloorMeshes.floorMesh);

        this._logger.end();

        return r;

    }



    #buildStub(ascene: THREE.Scene, acontext: BrdBlm_TC_Ctx_IParams, contextMaterials: Brd3Dv_IContextMaterials) {
        const box = new THREE.Mesh(
            new THREE.BoxGeometry(acontext.holeWidth, acontext.holeHeight, 2),
            new THREE.MeshPhongMaterial({
                color: 0xffbbcc,
                bumpMap: contextMaterials.externWall!.map,
                bumpScale: 20
            })
        );
        box.position.set(0, acontext.holeHeight / 2, 0);
        ascene.add(box);
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