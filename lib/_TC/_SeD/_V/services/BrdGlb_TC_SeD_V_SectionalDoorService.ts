/** ---------------------------------------------------------------------------
 * @module [BrdGlb_TC_SeD_V]
 * @author [DLV] De Luca Valentina
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 DLV 20230626
 * @version 0.2 APG 20230720
 * @version 0.3 DLV 20231009
 * @version 0.4 APG 20231113 Pulizia generale + refactoring 
 * ----------------------------------------------------------------------------
 */


//-----------------------------------------------------------------------------
// #region Imports


import {
    BrdGlb_AssetsServer
} from "../../../../consts/BrdGlb_AssetsServer.ts";
import {
    Blm,
    THREE,
    Uts
} from "../../../../deps.ts";
import {
    BrdGlb_IBumpMapDef
} from "../../../../interfaces/BrdGlb_IBumpMapDef.ts";
import {
    BrdGlb_IIntExtMaterialDef
} from "../../../../interfaces/BrdGlb_IIntExtMaterialDef.ts";
import {
    BrdGlb_IMaterialDef
} from "../../../../interfaces/BrdGlb_IMaterialDef.ts";
import {
    BrdGlb_TC_SeD_FP_FinishVariant_Recordset
} from "../../_FP/recordsets/BrdGlb_TC_SeD_FP_FinishVariant_Recordset.ts";
import {
    BrdGlb_TC_SeD_SectionMaterials_Recordset
} from "../../recordsets/BrdGlb_TC_SeD_SectionMaterials_Recordset.ts";
import {
    BrdGlb_TC_SeD_V_Co_Service
} from "../_Co/services/BrdGlb_TC_SeD_V_Co_Service.ts";


// #endregion
//-----------------------------------------------------------------------------

/**
 * Per i log, i messaggi di errore e di avvertimento
 */
const MODULE_NAME = "Brd3Dv_SeDSceneBuilder";



/**
 * Costruttore della scena per la configurazione di un portone sezionale
 */
export class BrdGlb_TC_SeD_V_SectionalDoorService {

    logger: Uts.BrdUts_Logger;

    configuration: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig;

    contextParams: Blm.TC.Ctx.BrdBlm_TC_Ctx_IParams;
    doorParams: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorParams;
    maxAnisotropy: number;


    constructor(
        alogger: Uts.BrdUts_Logger,
        aconfiguration: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig,
        amaxAnisotropy: number
    ) {

        this.logger = alogger;
        this.configuration = aconfiguration;
        this.maxAnisotropy = amaxAnisotropy;

        this.contextParams = this.#getContextParams(this.configuration);

        this.doorParams = this.#getDoorParams(this.configuration);

        if (this.doorParams.isStopAndGo === true) {
            this.#getWicketDoorParams(this.configuration);
        }

        this.logger.log(MODULE_NAME + ":constructor");
    }



    #getContextParams(aconfiguration: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig) {

        const r: Blm.TC.Ctx.BrdBlm_TC_Ctx_IParams = {
            holeWidth: aconfiguration.W,
            holeHeight: aconfiguration.H,
            holeLintel: aconfiguration.h,
            holeLintelAdditionalHeight: 0,
            holeLintelAdditionalDepth: 0,
            embrasureLeft: 350,
            embrasureRight: 350,
            wallRightOutline: [],
            wallLeftOutline: [],
            wallThickness: 300,
            roomDepth: 4000,
            floorThickness: 200,
            ceilingThickness: 250,
            ceilingOutline: [],
            columns: [],
            trasversalBeams:[]
        };
        return r;
    }



    #getDoorParams(aconfiguration: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig) {

        if (!Object.values(Blm.TC.SeD.BrdBlm_TC_SeD_eFinish).includes(aconfiguration.finish as Blm.TC.SeD.BrdBlm_TC_SeD_eFinish)) {
            alert(
                "La finitura (" +
                aconfiguration.finish +
                ") non è disponibile. Viene sostituita con preverniciato C21."
            );
            aconfiguration.finish = Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C21;
        }

        const r: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorParams = {

            width: aconfiguration.W,
            height: aconfiguration.H,
            lintel: aconfiguration.h,

            finish: aconfiguration.finish,
            extColor: aconfiguration.extColor,
            intColor: aconfiguration.intColor,
            design: aconfiguration.design,
            visaType: aconfiguration.visaType,

            hasHandle: aconfiguration.hasHandle,
            isLoweredTheshold: aconfiguration.hasLoweredThreshold,
            isStopAndGo: this.#isStopAndGo(aconfiguration),

            sections: this.#getDoorSectionsParams(aconfiguration),

        };

        return r;
    }



    #isStopAndGo(
        aconfiguration: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig
    ) {
        let r = false;
        if (aconfiguration.configuration === Blm.TC.SeD.BrdBlm_TC_SeD_eConfiguration.STOP_AND_GO ||
            aconfiguration.configuration === Blm.TC.SeD.BrdBlm_TC_SeD_eConfiguration.VISA_STOP_AND_GO) {
            r = true;
        }
        return r;
    }



    #getDoorSectionsParams(
        aconfig: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig
    ) {

        const r: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams[] = [];

        const configSections = aconfig.sections;

        const lastIndex = configSections.length - 1;

        // TODO Magic Numbers -- APG 20231121
        let yDisplacement = (aconfig.hasLoweredThreshold) ? 20 : 55;

        for (let i = 0; i <= lastIndex; i++) {

            const configSection = configSections[i];

            const family = this.#getSectionFamily(configSection);

            const type = this.#getSectionType(aconfig, i, lastIndex);

            const materials = this.#getMaterialsForFoamedPanels(aconfig);

            const topCut = (i != (lastIndex - 1)) ?
                0 :
                aconfig.H - yDisplacement - 10; // TODO magic Number -- APG 20231121

            const sectionParams: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionParams = {
                sequence: i,
                family,
                type,
                length: aconfig.W + 20, // TODO MAGIC Number -- APG 20231120
                height: configSection.h,
                displacement,
                topCut,
                bottomCut: 0,
            }
            r.push(sectionParams);

            yDisplacement += configSection.h;
        }

        return r;
    }



    /**
     * Questa funzione è da implementare per PEGASO LINE e WOOD LINE
     */
    #getSectionFamily(section: Blm.TC.SeD.BrdBlm_TC_SeD_ISectionConfig) {

        return (section.fillings) ? Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.VISA : Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.FOAMED;

    }




    #getSectionType(aconfig: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig, i: number, lastIndex: number) {

        let type = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.UNDEFINED;

        const section = aconfig.sections[i];
        const family = (section.fillings) ? Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.VISA : Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.FOAMED;
        const visaType = aconfig.visaType;
        const panelDesign = aconfig.design;

        if (family == Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.VISA) {

            type = this.#getSectionTypeForHorizontalVisaSection(visaType, i, lastIndex);

        }
        else if (family == Blm.TC.SeD.BrdBlm_TC_SeD_eSectionFamily.FOAMED) {

            type = this.#getSectionTypeForHorizontalFoamedPanel(panelDesign, i, lastIndex, section.h);

        }
        else {

            Uts.BrdUts.Assert(
                false,
                `$$225: La famiglia ${family} non è gestita!`
            );
        }
        return type;
    }



    #getSectionTypeForHorizontalVisaSection(
        avisaType: Blm.TC.SeD.BrdBlm_TC_SeD_eVisaType,
        aindex: number,
        alastIndex: number
    ) {

        let r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.UNDEFINED;

        if (avisaType == Blm.TC.SeD.BrdBlm_TC_SeD_eVisaType.LUXOR) {
            if (aindex == 0) {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.LUXOR_LOW;
            }
            else if (aindex == alastIndex) {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.LUXOR_HIGH;
            }
            else {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.LUXOR;
            }
        }
        else if (avisaType == Blm.TC.SeD.BrdBlm_TC_SeD_eVisaType.LUX) {
            if (aindex == 0) {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.LUX_LOW;
            }
            else if (aindex == alastIndex) {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.LUX_HIGH;
            }
            else {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.LUX;
            }
        }
        else {
            if (aindex == 0) {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.FULL_VISION_LOW;
            }
            else if (aindex == alastIndex) {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.FULL_VISION_HIGH;
            }
            else {
                r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.FULL_VISION;
            }
        }
        return r;
    }



    #getSectionTypeForHorizontalFoamedPanel(
        apanelDesign: Blm.TC.SeD.BrdBlm_TC_SeD_eDesign,
        aindex: number,
        alastIndex: number,
        asectionHeight: number
    ) {
        let r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.UNDEFINED;

        if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.FLAT) {
            r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.FLAT
        }
        else if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.MULTI) {
            r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.MULTI
        }
        else if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.MULTIRIB) {
            r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.MULTIRIB
        }
        else if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.SINGLE) {
            r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.SINGLE
        }
        else if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.BLOCKS) {
            r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.BLOCKS
        }


        // Primo pannello
        if (aindex == 0) {
            // Cassettato
            if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.BLOCKS) {
                // Da 615 casstta alta
                if (asectionHeight == 615) {
                    r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.BLOCKS_H;
                }
            }
            // Single
            if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.SINGLE) {
                // da 615 Nervatura alta
                if (asectionHeight == 615) {
                    r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.SINGLE_H
                }
            }
        }

        // Ultimo pannello
        if (aindex == alastIndex) {
            // Cassettato
            if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.BLOCKS) {
                // Da 615 casstta bassa
                if (asectionHeight == 615) {
                    r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.BLOCKS_L;
                }
            }
            // Single
            if (apanelDesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.SINGLE) {
                // da 615 Nervatura bassa
                if (asectionHeight == 615) {
                    r = Blm.TC.SeD.BrdBlm_TC_SeD_eSectionType.SINGLE_L
                }
            }
        }

        return r;
    }



    #getMaterialsForFoamedPanels(
        aconfig: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig,
    ) {


        const extColor = this.#getColorFromFinish(
            aconfig.finish,
            aconfig.extColor
        );

        const textureLoader = new THREE.TextureLoader();

        const ext = this.#getSheetMetalMaterial(
            textureLoader,
            aconfig.design,
            aconfig.finish,
            aconfig.variant,
            aconfig.extColor
        );

        const int = this.#getSheetMetalMaterial(
            textureLoader,
            Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.MULTI,
            Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C21,
            Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.STUCCO,
            aconfig.intColor
        );

        const r: BrdGlb_IIntExtMaterialDef = {
            int,
            ext
        };

        return r;
    }




    #getSheetMetalMaterial(
        atextureLoader: THREE.TextureLoader,
        adesign: Blm.TC.SeD.BrdBlm_TC_SeD_eDesign,
        afinish: Blm.TC.SeD.BrdBlm_TC_SeD_eFinish,
        afinishVariant: Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant,
        acolor?: string
    ) {

        const urlRoot = BrdGlb_AssetsServer + "/assets/img/jpg/textures/sections/";

        const material = new THREE.MeshStandardMaterial({
            wireframe: false,
        });

        const sectionMaterial = BrdGlb_TC_SeD_SectionMaterials_Recordset[afinish];
        material.roughness = sectionMaterial.roughness;

        if (acolor) {

            if (acolor.startsWith("RAL")) {
                const ralColor = Blm.BrdBlm_RalColorsService.getColor(acolor)
                if (ralColor == undefined) {
                    Uts.BrdUts.Assert(
                        false,
                        `$$471 Colore RAL ${acolor} non riconosciuto`
                    )
                }
                else {
                    material.color = new THREE.Color(ralColor.color);
                }
            }
            else if (acolor.startsWith("M")) {
                material.color = new THREE.Color(acolor);
            }
            else {
                Uts.BrdUts.Assert(
                    false,
                    `$$484 Colore fuori standard ${acolor} non gestito`
                )
            }
        }
        else {
            material.color = new THREE.Color(sectionMaterial.color);
        }

        if (sectionMaterial.texture) {
            const mapPath = "maps/";
            const mapData = this.#buildMapTexture(
                atextureLoader,
                urlRoot + mapPath,
                sectionMaterial
            );
            material.map = mapData.texture!;
            // The original texture of KeoSang is 960x1250mm
            if (sectionMaterial.texture.uScale == undefined || sectionMaterial.texture.vScale == undefined) {
                alert(
                    "The U/V coordinates are not set properly for the map of finish: [" +
                    afinish +
                    "]"
                );
            }
            material.map.repeat.setX(sectionMaterial.texture.uScale || 1);
            material.map.repeat.setY(sectionMaterial.texture.vScale || 1);
        }

        let finishVariant = BrdGlb_TC_SeD_FP_FinishVariant_Recordset[afinishVariant];

        if (adesign == Blm.TC.SeD.BrdBlm_TC_SeD_eDesign.MULTIRIB) {
            finishVariant = BrdGlb_TC_SeD_FP_FinishVariant_Recordset[Blm.TC.SeD.BrdBlm_TC_SeD_eFinishVariant.MULTIRIB];
        }

        if (finishVariant && finishVariant.bumpMap) {
            const bumpPath = "bumpMaps/";
            const bumpData = this.#buildBumpMapTexture(
                atextureLoader,
                urlRoot + bumpPath,
                finishVariant
            );
            material.bumpMap = bumpData.bumpMap!;
            material.bumpScale = finishVariant.depth;
            material.bumpMap.repeat.setX(finishVariant.uScale);
            material.bumpMap.repeat.setY(finishVariant.vScale);
        }
        const r: BrdGlb_IMaterialDef = {
            color: material.color.getHex(),
            roughness: material.roughness,
            material
        }

        return r;
    }



    #buildMapTexture(
        atextureLoader: THREE.TextureLoader,
        aurlRoot: string,
        afinish: BrdGlb_IMaterialDef
    ) {
        const textureName = afinish.texture!.texture;
        const textureUrl = textureName == "" ? "" : aurlRoot + textureName;
        const texture = textureName == "" ? undefined : atextureLoader.load(textureUrl);

        if (texture) {
            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.colorSpace = THREE.SRGBColorSpace;
            // TODO implement anisotropy control -- APG 20231120
            // texture.anisotropy =
        }
        return { textureName, texture };
    }



    #buildBumpMapTexture(
        atextureLoader: THREE.TextureLoader,
        aurlRoot: string,
        asurface: BrdGlb_IBumpMapDef
    ) {
        const bumpMapName = asurface.bumpMap;
        const bumpMapUrl = bumpMapName == "" ? "" : aurlRoot + bumpMapName;
        const bumpMap =
            bumpMapName == "" ? undefined : atextureLoader.load(bumpMapUrl);
        if (bumpMap) {
            bumpMap.wrapS = THREE.RepeatWrapping;
            bumpMap.wrapT = THREE.RepeatWrapping;
            // texture.anisotropy =
            bumpMap.colorSpace = THREE.SRGBColorSpace;
        }
        return { bumpMapName, bumpMap };
    }





    #getWicketDoorParams(aconfiguration: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IDoorConfig) {

        // if (aconfiguration.wicketDoor === undefined) {
        //     alert("Porta pedonale - non presenti parametri");
        //     return;
        // }


        // aconfiguration.wicketDoor.sectionHeights = [];
        // const numSections = aconfiguration.doorSections.length > 3 ? 4 : 3;
        // for (let i = 0; i < numSections; i++) {
        //     const section = aconfiguration.doorSections[i];
        //     aconfiguration.wicketDoor.sectionHeights.push(section.h);
        // }
        // aconfiguration.wicketDoor.hasLoweredThreshold =
        //     aconfiguration.hasLoweredThreshold;
        // aconfiguration.wicketDoor.model = aconfiguration.model;
        // aconfiguration.wicketDoor.doorHeight = aconfiguration.H;
        // aconfiguration.wicketDoor.Wconfiguration = aconfiguration.W;

        // const wicketDoorBuilder = new Brd3DvWicketDoorBuilder(
        //     this.logger,
        //     aconfiguration.wicketDoor
        // );
        // wicketDoorBuilder.buildWicketDoor(
        //     this.scene,
        //     this.logger,
        //     aconfiguration.wicketDoor
        // );
    }



    #getColorFromFinish(
        afinish: Blm.TC.SeD.BrdBlm_TC_SeD_eFinish,
        acolor?: string
    ) {

        // Default Magenta Colore non valido
        let r = 0xff00ff;

        switch (afinish) {
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.RAL_GLOSS_10_FS:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.NOT_STANDARD:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.RAL_GLOSS_25_35_FS: {
                if (acolor == undefined) {
                    alert(
                        "The finish is non standard RAL but the color is not specified"
                    );
                    break;
                }
                const ral = Blm.BrdBlm_RalColorsService.getColor(acolor);
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C21: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 9002");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C81:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C81_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 9001");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C17:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_C17_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 8019");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_9016_SATIN_FS:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_9016_SATIN: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 9016");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_7016:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_7016_FS:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_7016_SATIN:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_7016_SATIN_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 7016");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_6005:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_6005_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 6005");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_3000:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_3000_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 3000");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_5010:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_5010_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 5010");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_9006:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_9006_FS:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_9006_SATIN:
            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.PRE_LAQ_RAL_9006_SATIN_FS: {
                const ral = Blm.BrdBlm_RalColorsService.getColor("RAL 9006");
                if (ral != undefined) {
                    r = ral.color;
                }
                break;
            }

            case Blm.TC.SeD.BrdBlm_TC_SeD_eFinish.MICACEOUS_FS: {
                if (acolor == undefined) {
                    alert(
                        "The finish is non standard MICACEOUS but the color is not specified"
                    );
                    break;
                }
                switch (acolor) {
                    case Blm.BrdBlm_eMicaceousFinish.SIVER_GRAY:
                        r = 0x808080;
                        break;
                    case Blm.BrdBlm_eMicaceousFinish.METALLIC_GRAY:
                        r = 0x8d918d;
                        break;
                    case Blm.BrdBlm_eMicaceousFinish.GRAPHITE_GRAY:
                        r = 0x383428;
                        break;
                    case Blm.BrdBlm_eMicaceousFinish.SMOKE_BLACK:
                        r = 0x100c08;
                        break;
                    case Blm.BrdBlm_eMicaceousFinish.PINE_GREEN:
                        r = 0x01796f;
                        break;
                    case Blm.BrdBlm_eMicaceousFinish.ANCIENT_RED:
                        r = 0x922a31;
                        break;
                    case Blm.BrdBlm_eMicaceousFinish.BURNT_SOIL:
                        r = 0xb46448;
                        break;
                    default:
                        alert(`The MICACEOUS color ${acolor} is not defined`);
                        break;
                }
                break;
            }
            // TODO Refine the micaceous colors -- APG 20230705

            // All WOOD-LIKE colors have white
            default:
                r = 0xffffff;
                break;
        }
        return r;
    }



    // /**
    //  * Calcola i parametri di costruzione della sezione a partire dai dati di 
    //  * configurazione della porta
    //  *
    //  * @param adoor Parametri di configurazione della porta
    //  * @param asectionN Numero della sezione da preparare. ATTENZIONE! parte da 0 !!!
    //  */
    // #getSectionParams(adoor: BrdSeD_ISectionalDoorConfig, asectionN: number) {

    //     const currSection = adoor.sections[asectionN];

    //     const length = adoor.width + 20; // TODO Magic number!!! -- APG 20230720

    //     let height = currSection.height;
    //     let topCut = 0;

    //     let type = Brd3Dv_eSectionType.UNDEFINED;
    //     let family = BrdSeD_eSectionFamily.UNDEFINED

    //     // prima sezione
    //     if (asectionN === 0) {
    //         // Single alta
    //         if (
    //             adoor.design === BrdSeD_eDesign.SINGLE &&
    //             height === 615
    //         ) {
    //             type = Brd3Dv_eSectionType.SINGLE_H;
    //             family = BrdSeD_eSectionFamily.FOAMED;
    //         }
    //         // Cassetta alta
    //         if (
    //             adoor.design === BrdSeD_eDesign.BLOCKS &&
    //             height === 615
    //         ) {
    //             type = Brd3Dv_eSectionType.BLOCKS_H;
    //             family = BrdSeD_eSectionFamily.FOAMED;
    //         }
    //         // Visa Luxor base
    //         if (
    //             adoor.design === BrdSeD_eDesign.VISA_LUXOR &&
    //             adoor.isBaseVisa
    //         ) {
    //             type = Brd3Dv_eSectionType.LUXOR_LOW;
    //             family = BrdSeD_eSectionFamily.VISA;
    //         }
    //         // Visa Lux base
    //         if (
    //             adoor.design === BrdSeD_eDesign.VISA_LUX &&
    //             adoor.isBaseVisa
    //         ) {
    //             type = Brd3Dv_eSectionType.LUX_LOW;
    //             family = BrdSeD_eSectionFamily.VISA;
    //         }
    //         // Visa full vision base
    //         if (
    //             adoor.design === BrdSeD_eDesign.VISA_FULL_VISION &&
    //             adoor.isBaseVisa
    //         ) {
    //             type = Brd3Dv_eSectionType.FULL_VISION_LOW;
    //             family = BrdSeD_eSectionFamily.VISA;
    //         }
    //     }
    //     // ultima sezione
    //     else if (asectionN === adoor.sections.length - 1) {

    //         topCut = adoor.sections[asectionN].height;

    //         // Single bassa
    //         if (
    //             adoor.design === BrdSeD_eDesign.SINGLE &&
    //             height === 615
    //         ) {
    //             type = Brd3Dv_eSectionType.SINGLE_L;
    //             family = BrdSeD_eSectionFamily.FOAMED;
    //         }
    //         // Cassetta bassa
    //         if (adoor.
    //             design === BrdSeD_eDesign.BLOCKS &&
    //             height === 615
    //         ) {
    //             type = Brd3Dv_eSectionType.BLOCKS_L;
    //             family = BrdSeD_eSectionFamily.FOAMED;
    //         }
    //         // Visa Luxor Alta
    //         if (
    //             adoor.design === BrdSeD_eDesign.VISA_LUXOR &&
    //             adoor.isTopVisa
    //         ) {
    //             type = Brd3Dv_eSectionType.LUXOR_HIGH;
    //             family = BrdSeD_eSectionFamily.VISA;
    //         }
    //         // Visa Lux Alta
    //         if (
    //             adoor.design === BrdSeD_eDesign.VISA_LUX &&
    //             adoor.isTopVisa
    //         ) {
    //             type = Brd3Dv_eSectionType.LUX_HIGH;
    //             family = BrdSeD_eSectionFamily.VISA;
    //         }
    //         // Visa Full Vision Alta
    //         if (
    //             adoor.design === BrdSeD_eDesign.VISA_FULL_VISION &&
    //             adoor.isTopVisa
    //         ) {
    //             type = Brd3Dv_eSectionType.FULL_VISION_HIGH;
    //             family = BrdSeD_eSectionFamily.VISA;
    //         }
    //     }
    //     // Sezioni intermedie
    //     else {
    //         if (
    //             adoor.design == BrdSeD_eDesign.VISA_LUXOR ||
    //             adoor.design == BrdSeD_eDesign.VISA_LUX ||
    //             adoor.design == BrdSeD_eDesign.VISA_FULL_VISION
    //         ) {
    //             if( currSection.)
    //             family = BrdSeD_eSectionFamily.VISA;
    //         } else {
    //             family = BrdSeD_eSectionFamily.FOAMED;
    //         }
    //     }

    //     const r: Brd3Dv_ISeDSectionParams = {
    //         sequence: asectionN,
    //         family,
    //         type,
    //         visaType,
    //         length,
    //         height,
    //         topCut,
    //         bottomCut,
    //         inserts: this.#getSectionHoles(adoor, asectionN),
    //         filling: this.#getSectionVisa(adoor, asectionN),
    //     };
    //     return r;
    // }



    // #getSectionHoles(adoor: Brd3Dv_ISeDDoorParams, asectionN: number) {
    //     //Inspection windows and Grilles -- DLV 20230802
    //     const r: BrdSeD_ISectionHole[] = [];
    //     const section = adoor.sections[asectionN];
    //     if (
    //         section.inserts !== undefined &&
    //         Array.isArray(section.inserts) &&
    //         section.inserts.length > 0
    //     ) {
    //         r.push(...section.inserts);
    //     }
    //     if (asectionN === 0 && adoor.hasHandle === true) {
    //         let y = (495 - 15) / 2 - 43 / 2;
    //         const x = 300 - 45; // = posizione al centro - meta foro
    //         if (section.h === 615) {
    //             if (adoor.design === BrdSeD_eDesign.SINGLE) {
    //                 y = 615 - 15 - y;
    //             } else {
    //                 y = (615 - 15) / 2 - 43 / 2;
    //             }
    //         }
    //         r.push({ code: "153200100001", x, y });
    //     }
    //     return r;
    // }



    // #getSectionVisa(adoor: Brd3Dv_ISeDDoorParams, asectionN: number) {
    //     const visaParam = BrdSeDV_Rules.VISA;
    //     const visaParamCalc = BrdSeDV_Rules.VISA_CALCULATED;
    //     // TODO Implement this! for visa -- APG 20230720
    //     const r: BrdSeD_ISectionFilling[] = [];
    //     const section = adoor.sections[asectionN];
    //     if (
    //         section.fillings !== undefined &&
    //         Array.isArray(section.fillings) &&
    //         section.fillings.length > 0
    //     ) {
    //         /** Valori da restituire */
    //         let dimSpecchio = 0;
    //         let dimSection = 0;
    //         let posX = 0;
    //         let posY = 0;
    //         let dimH = 0;
    //         /** Determina dimensioni dello specchio */
    //         for (let i = 0; i < section.fillings.length; i++) {
    //             const fillingSection = section.fillings[i];
    //             const codeFil = fillingSection.code;
    //             const x = fillingSection.x;
    //             const w = fillingSection.w;
    //             const h = section.h;
    //             if (adoor.visaType === eBrdSeDVisaType.LUXOR) {
    //                 if (i === 0) {
    //                     dimSpecchio = w - visaParam.PLINTH_150 - visaParam.T_WIDTH / 2;
    //                     posX = visaParam.PLINTH_150;
    //                 } else {
    //                     posX = posX + dimSpecchio + visaParam.T_WIDTH;
    //                     dimSection = posX + dimSpecchio + visaParam.PLINTH_150;
    //                 }
    //                 posY = visaParam.FEMALE_HEIGHT;
    //                 dimH = h - visaParamCalc.REDUCE_INTERM_SECTION_LUXOR;
    //                 if (asectionN === 0) {
    //                     dimH = h - visaParamCalc.REDUCE_BASE_SECTION_LUXOR;
    //                 }
    //                 if (asectionN === adoor.sections.length) {
    //                     dimH = h - visaParamCalc.REDUCE_HIGH_SECTION_LUXOR;
    //                 }
    //             }

    //             r.push({
    //                 code: codeFil,
    //                 x,
    //                 w,
    //                 posX,
    //                 posY,
    //                 dimH,
    //                 dimSpecchio,
    //                 dimSection,
    //             });
    //             // console.log("return", r);
    //         }
    //     }

    //     return r;
    // }







    build(ascene: THREE.Scene) {

        const start = performance.now();

        const contextBuilder = new Blm.TC.Ctx.BrdGlb_TC_Ctx_Service(
            this.logger,
            this.maxAnisotropy
        );
        const contextMeshes = contextBuilder.build(this.contextParams);
        this.#addMeshesProgressively(ascene, contextMeshes);

        const coatBuilder = new BrdGlb_TC_SeD_V_Co_Service(this.logger);
        const coatMeshes = coatBuilder.build(this.doorParams);
        this.#addMeshesProgressively(ascene, coatMeshes);


        this.logger.log(MODULE_NAME + ":" + this.build.name);
    }


    #addMeshesProgressively(
        ascene: THREE.Scene,
        ameshes: THREE.Mesh[],
        amillisecondsDelay = 0
    ) {

        for (let i = 0; i < ameshes.length; i++) {
            if (amillisecondsDelay > 0) {
                setTimeout(() => {
                    ascene.add(ameshes[i]);
                }, i * amillisecondsDelay);
            }
            else {
                ascene.add(ameshes[i])
            }
        }
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