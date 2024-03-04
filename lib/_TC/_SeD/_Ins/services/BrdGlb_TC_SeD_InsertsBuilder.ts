/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved
 * @licence You cannot host, display, distribute or share this Work in any
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * ---------------------------------------------------------------------------
 */
/** ---------------------------------------------------------------------------
 * @module [Brd/3Dv]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230725
 * @version 0.2 APG 20231109 Pulizia e refactoring
 * ----------------------------------------------------------------------------
 */


import {
    BrdBlm_TC_SeD_V_IDoorParams
} from "../../../../../../Blm/lib/_TC/_SeD/_V/interfaces/BrdBlm_TC_SeD_V_IDoorParams.ts";
import {
    BrdGlb_UVRemapperService
} from "../../../../services/BrdGlb_UVRemapperService.ts";


export const MODULE_NAME = "Brd3DvSeDAccessoriesBuilder";



export class BrdGlb_TC_SeD_InsertsBuilder {

    stlLoader: STLLoader;
    glbLoader: GLTFLoader;

    scene: THREE.Scene;
    door: BrdBlm_TC_SeD_V_IDoorParams;
    enableShadows: boolean;


    constructor(
        ascene: THREE.Scene,
        adoor: BrdBlm_TC_SeD_V_IDoorParams,
        aenableShadows = true
    ) {
        this.scene = ascene;
        this.door = adoor;
        this.enableShadows = aenableShadows;

        this.stlLoader = new STLLoader();
        this.glbLoader = new GLTFLoader();

    }



    stub() {

        this.#glbLoaderStub();

        this.#stlLoaderStub();

    }



    #stlLoaderStub() {

        this.#addAccessoryFromStl(
            '1542000x0010',
            'Cornice oblò 525x350',
            new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.75 }),
            {
                position: new THREE.Vector3(
                    -(this.door.width / 2) + 230,
                    45 + 10 + 615 + 125 - 10,
                    -12
                ),
                rotation: new THREE.Vector3(-Math.PI / 2, 0, 0),
            },
            BrdGlb_eLayers.TC_SeD_COAT,
        );

        // Maniglia Breda esterna
        const stlBredaHandleExtUrl = "/assets/stl/153200100001_01.stl";
        this.stlLoader.load(stlBredaHandleExtUrl, (stlGeometry) => {
            const r = new THREE.Mesh(
                stlGeometry,
                new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.75 })
            );
            BrdGlb_UVRemapperService.CubeMapping(r);
            r.position.x = -(this.door.width / 2 - 300 + 80);
            r.position.y = 45 + 10 + this.door.sections[0].height / 2 - 70 - 10;
            r.position.z = -8;
            r.rotation.x = -Math.PI / 2;

            r.receiveShadow = true;
            r.castShadow = true;

            r.layers.set(BrdGlb_eLayers.TC_SeD_COAT);
            r.name = '';
            this.scene!.add(r);
        });

        // Maniglia Breda interna
        const stlBredaHandleIntUrl = "/assets/stl/153200100001_02.stl";
        this.stlLoader.load(stlBredaHandleIntUrl, (stlGeometry) => {
            const r = new THREE.Mesh(
                stlGeometry,
                new THREE.MeshLambertMaterial({ color: "black" })
            );
            BrdGlb_UVRemapperService.CubeMapping(r);
            r.position.x = -(this.door.width / 2 - 300 + 80);
            r.position.y = 45 + 10 + this.door.sections[0].height / 2 - 33 - 10;
            r.position.z = -60;
            r.rotation.x = -Math.PI / 2;

            r.receiveShadow = true;
            r.castShadow = true;

            r.layers.set(BrdGlb_eLayers.TC_SeD_COAT);
            r.name = ''
            this.scene!.add(r);
        });

        // Maniglia PPI
        const stlBredaWickeDoorHandleUrl = "/assets/stl/1553001C.stl";
        this.stlLoader.load(stlBredaWickeDoorHandleUrl, (stlGeometry) => {
            const r = new THREE.Mesh(
                stlGeometry,
                new THREE.MeshLambertMaterial({ color: "black" })
            );
            BrdGlb_UVRemapperService.CubeMapping(r);
            r.position.x = -500;
            r.position.y = 45 + 10 + 615 + (600 - 350) / 2 - 33;
            r.position.z = -3;
            r.rotation.x = -Math.PI / 2;

            r.receiveShadow = true;
            r.castShadow = true;

            r.layers.set(BrdGlb_eLayers.TC_SeD_COAT);
            r.name = '';
            this.scene!.add(r);
        });
    }



    #addAccessoryFromStl(
        acode: string,
        aname: string,
        amaterial: THREE.MeshStandardMaterial,
        aplacement: { position: THREE.Vector3, rotation: THREE.Vector3 },
        alayer: number
    ) {
        const stlUrl = `/assets/stl/${acode}.stl`;
        this.stlLoader.load(stlUrl, (stlGeometry) => {
            const r = new THREE.Mesh(
                stlGeometry,
                amaterial
            );
            r.name = aname;

            BrdGlb_UVRemapperService.CubeMapping(r);

            r.position.x = aplacement.position.x;
            r.position.y = aplacement.position.y;
            r.position.z = aplacement.position.z;
            r.rotation.x = aplacement.rotation.x;
            r.rotation.y = aplacement.rotation.y;
            r.rotation.z = aplacement.rotation.z;

            r.layers.set(alayer);

            r.receiveShadow = true;
            r.castShadow = true;

            this.scene!.add(r);
        });
    }



    #glbLoaderStub() {

        const glbUrl = "/assets/gltf/BrdLogo3D2022.glb";

        this.glbLoader.load(glbUrl, (gltf) => {
            const rawLogoGltf = gltf.scene.children[0].children[0].children[0];
            const logoGltf = rawLogoGltf.clone();
            logoGltf.scale.x = 1000;
            logoGltf.scale.y = 1000;
            logoGltf.scale.z = 1000;
            // logoGltf.position.x = 0.25;
            logoGltf.position.y = 1000;
            logoGltf.position.z = -1000;

            this.scene!.add(logoGltf);
        });
    }


}
