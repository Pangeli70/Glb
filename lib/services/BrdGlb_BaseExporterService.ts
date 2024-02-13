/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20231202
 * @version 0.2 APG 20231226 Spostato nel modulo BrdGlb
 * ----------------------------------------------------------------------------
 */

import {
    Blm,
    THREE,
    THREE_GLTFExporter,
    THREE_STLExporter
} from "../deps.ts";
import {
    BrdGlb_IMeshCouple
} from "../interfaces/BrdGlb_IMeshCouple.ts";
import {
    BrdGlb_UVRemapperService
} from "./BrdGlb_UVRemapperService.ts";



/**
 * Servizio di base per gestire l'esportazione delle scene costruite server side
 */
export class BrdGlb_BaseExporterService {

    /**
     * 90 gradi sessaggesimali in radianti
     */
    protected static readonly RAD_90 = Math.PI / 2;
    /**
     * 180 gradi sessaggesimali in radianti
     */
    protected static readonly RAD_180 = Math.PI;
    /**
     * Costante di conversione 1 grado sessaggesimale in radianti
     */
    protected static readonly RAD_1 = 2 * Math.PI / 360;
    /**
     * Flag per impostare i materiali in Wireframe per scopi di debug
     */
    protected static readonly DO_WIREFRAME = false;
    /**
     * Coefficiente di suddivisione delle estrusioni lineari.
     * Permette di gestire la complessità delle geometrie.
     */
    protected static readonly LINEAR_EXTRUSION_STEP = 1000;
    /**
     * Flag che indica se siamo nell'edge di Deno Deploy
     */
    protected static get IS_DEPLOY() {
        const r = (Deno == undefined) ?
            false :
            Deno.env.get("DENO_DEPLOYMENT_ID") !== undefined;
        return r;
    }

    //--------------------------------------------------------------------------
    // #region Utilities

    protected static mirrorPointsAgainstYAxis(
        aprofile: Blm.BrdBlm_IPoint2D[]
    ) {

        const r: Blm.BrdBlm_IPoint2D[] = [];

        r.push({ ...aprofile[0] });

        r[0].x *= -1;

        for (let i = aprofile.length - 1; i > 0; i--) {

            const newPoint = { ...aprofile[i] };
            newPoint.x *= -1;

            r.push(newPoint);

        }

        return r;

    }


    /**
     * Posiziona una mesh usando una serie di operazioni di traslazione e
     * rotazione. Per fare questo crea una serie di oggetti di riferimento
     * di cui sfruttare le matrici di trasformazione in modo da poter eseguire
     * le operazioni nell'ordine corretto.
     * @param amesh Mesh da posizionare
     * @param aplacementOp elenco delle operazioni da eseguire
     * @param adoFlip inverte il valore delle operazioni per quelle che sono
     * marcate come invertibili
     * @returns un oggetto che contiene altri oggetti annidati fino alla mesh
     * originale pronto per essere aggiunto alla scena.
     */
    protected static placeMeshWithOperations(
        amesh: THREE.Mesh,
        aplacementOp: Blm.BrdBlm_IPlacementOperation[],
        adoFlip: boolean
    ) {

        let r = new THREE.Object3D();
        r.add(amesh);

        for (const op of aplacementOp) {

            const r1 = new THREE.Object3D();
            r1.add(r);
            let value = op.value;
            if (adoFlip && op.isFlippable) {
                value *= -1;
            }
            switch (op.operation) {
                case Blm.BrdBlm_ePlacementOperation.TRANSLATE_X_IN_MM: {
                    r1.translateX(value);
                    break;
                }
                case Blm.BrdBlm_ePlacementOperation.TRANSLATE_Y_IN_MM: {
                    r1.translateY(value);
                    break;
                }
                case Blm.BrdBlm_ePlacementOperation.TRANSLATE_Z_IN_MM: {
                    r1.translateZ(value);
                    break;
                }
                case Blm.BrdBlm_ePlacementOperation.ROTATE_X_IN_RAD: {
                    r1.rotateX(value);
                    break;
                }
                case Blm.BrdBlm_ePlacementOperation.ROTATE_Y_IN_RAD: {
                    r1.rotateY(value);
                    break;
                }
                case Blm.BrdBlm_ePlacementOperation.ROTATE_Z_IN_RAD: {
                    r1.rotateZ(value);
                    break;
                }
            }
            r = r1;
        }
        r.updateMatrix();

        return r;

    }



    protected static placeCoupleWithOperations(
        acouple: BrdGlb_IMeshCouple,
        operations: Blm.BrdBlm_IPlacementOperation[]
    ) {
        const r: THREE.Object3D[] = [];

        r.push(this.placeMeshWithOperations(acouple.right, operations, false));

        r.push(this.placeMeshWithOperations(acouple.left, operations, true));

        return r;
    }



    protected static buildPlanesHelpers(
        asizeInMM = 10000,
        adivisions = 10
    ) {

        const r = new THREE.Object3D();
        const size = asizeInMM;
        const divisions = adivisions;

        const gridHelperXZ = new THREE.GridHelper(
            size,
            divisions,
            0xf08080,
            0xf0b0b0
        );
        r.add(gridHelperXZ);

        const gridHelperXY = new THREE.GridHelper(
            size,
            divisions,
            0x80f080,
            0xb0f0b0
        );
        gridHelperXY.rotateX(this.RAD_90);
        r.add(gridHelperXY);

        const gridHelperZY = new THREE.GridHelper(
            size,
            divisions,
            0x8080f0,
            0xb0b0f0
        );
        gridHelperZY.rotateZ(this.RAD_90);
        r.add(gridHelperZY);

        return r;
    }


    // #endregion
    //--------------------------------------------------------------------------


    //--------------------------------------------------------------------------
    // #region Extruders


    protected static extrudeXYShapeAlongZ(
        ashape: THREE.Shape,
        adepth: number,
        astepLenght: number,
        amaterial: THREE.MeshStandardMaterial
    ) {
        const extrusionOptions: THREE.ExtrudeGeometryOptions = {
            depth: adepth,
            bevelEnabled: false,
            steps: Math.trunc(adepth / astepLenght) + 1,
        };

        const geometry = new THREE.ExtrudeGeometry(
            ashape,
            extrusionOptions
        );

        const r = new THREE.Mesh(geometry, amaterial);

        r.receiveShadow = true;
        r.castShadow = true;

        BrdGlb_UVRemapperService.CubeMapping(r);

        return r;

    }



    protected static extrudeXYShapeAlongPath(
        ashape: THREE.Shape,
        apath: THREE.CatmullRomCurve3,
        asteps: number,
        amaterial: THREE.MeshStandardMaterial
    ) {
        const star = this.getStarShapeForTest();
        const path = this.randomExtrusionPathAlongZForTest();
        const geometry1 = this.getRandomExtrudedGeometryAlongZForTest(star, path);
        const r1 = new THREE.Mesh(geometry1, amaterial);

        const extrusionOptions: THREE.ExtrudeGeometryOptions = {
            steps: asteps,
            bevelEnabled: false,
            extrudePath: apath
        };

        console.dir(ashape);

        try {
            const geometry0 = new THREE.ExtrudeGeometry(
                ashape,
                extrusionOptions
            );
            const r = new THREE.Mesh(geometry0, amaterial);

            r.receiveShadow = true;
            r.castShadow = true;

            BrdGlb_UVRemapperService.CubeMapping(r);

            return r;
        }
        catch (err) {
            console.log(err.message);
        }

        return r1;

    }



    protected static getStarShapeForTest() {
        const pts = [];
        const numPts = 5;

        for (let i = 0; i < numPts * 2; i++) {
            const l = i % 2 == 1 ? 10 : 20;
            const a = i / numPts * Math.PI;
            pts.push(new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l));
        }

        const r = new THREE.Shape(pts);
        return r;
    }



    protected static randomExtrusionPathAlongZForTest() {
        const randomPoints = [];

        for (let i = 0; i < 10; i++) {
            randomPoints.push(
                new THREE.Vector3(
                    THREE.MathUtils.randFloat(-1, 1),
                    THREE.MathUtils.randFloat(-5, 5),
                    i * 50
                )
            );
        }

        const r = new THREE.CatmullRomCurve3(randomPoints);
        return r;
    }



    protected static getRandomExtrudedGeometryAlongZForTest(
        ashape: THREE.Shape,
        apath: THREE.CatmullRomCurve3
    ) {
        const extrudeOptions: THREE.ExtrudeGeometryOptions = {
            steps: 200,
            bevelEnabled: false,
            extrudePath: apath
        };

        const r = new THREE.ExtrudeGeometry(ashape, extrudeOptions);
        return r;
    }


    // #endregion
    //--------------------------------------------------------------------------


    //--------------------------------------------------------------------------
    // #region Export


    protected static buildStl(ascene: THREE.Scene) {

        const exporter = new THREE_STLExporter();
        const options = {
            binary: false
        };

        ascene.updateMatrixWorld(true);

        const stl = exporter.parse(
            ascene,
            options
        );

        const r = stl as string;
        return r;
    }



    protected static async buildGltf(ascene: THREE.Scene) {

        const exporter = new THREE_GLTFExporter();
        const options = {
            binary: false
        };

        ascene.updateMatrixWorld(true);

        const gltf = await exporter.parseAsync(
            ascene,
            options
        );

        const r = JSON.stringify(gltf, null, 2);
        return r;
    }



    protected static async buildGlb(ascene: THREE.Scene) {

        const exporter = new THREE_GLTFExporter();
        const options = {
            binary: true
        };

        ascene.updateMatrixWorld(true);

        const glb = await exporter.parseAsync(
            ascene,
            options
        );

        const r = glb as ArrayBuffer;
        return r;
    }



    protected static async export(
        ascene: THREE.Scene,
        adoBinary = true
    ) {

        let r: string | Uint8Array;

        if (adoBinary) {

            const arrBuff = await this.buildGlb(ascene);
            const uint8Arr = new Uint8Array(arrBuff);

            if (!this.IS_DEPLOY) {
                Deno.writeFileSync('./srv/test/output/' + ascene.name + '.glb', uint8Arr);
            }

            r = uint8Arr;
        }
        else {

            const gltf = await this.buildGltf(ascene);

            if (!this.IS_DEPLOY) {
                Deno.writeTextFileSync('./srv/test/output/' + ascene.name + '.gltf', gltf);
                const stl = this.buildStl(ascene);
                Deno.writeTextFileSync('./srv/test/output/' + ascene.name + '.stl', stl);
            }

            r = gltf;
        }

        return r;
    }

    // #endregion
    //--------------------------------------------------------------------------

}


/*! ----------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved 
 * @licence You cannot host, display, distribute or share this Work in any 
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * -----------------------------------------------------------------------------
 */