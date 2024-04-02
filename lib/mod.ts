/** ---------------------------------------------------------------------------
 * @module [BrdGlb] 
 * @description Creazione delle Scene 3D server side per i prodotti Breda
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20231202
 * @version 0.2 APG 20231226 Spostato nel modulo BrdGlb
 * @version 0.3 APG 20231229 Estratto nel suo file
 * ----------------------------------------------------------------------------
 */

export * from "./enums/BrdGlb_eLayer.ts"

export * from "./interfaces/BrdGlb_IBaseModel.ts"
export * from "./interfaces/BrdGlb_IBumpMapDef.ts"
export * from "./interfaces/BrdGlb_IDynamicModel.ts"
export * from "./interfaces/BrdGlb_IDynamicModel_PostPayload.ts"
export * from "./interfaces/BrdGlb_IIntExtGeometries.ts"
export * from "./interfaces/BrdGlb_IIntExtMaterialDef.ts"
export * from "./interfaces/BrdGlb_IIntExtMeshes.ts"
export * from "./interfaces/BrdGlb_IIntExtShapes.ts"
export * from "./interfaces/BrdGlb_IMaterialDef.ts"
export * from "./interfaces/BrdGlb_IMeshCouple.ts"
export * from "./interfaces/BrdGlb_IStaticModel.ts"
export * from "./interfaces/BrdGlb_ITextureDef.ts"

export * from "./services/BrdGlb_BaseExporterService.ts"
//export * from "./services/BrdGlb_HoleService.ts"
export * from "./services/BrdGlb_ShapeService.ts"
export * from "./services/BrdGlb_UVRemapperService.ts"

export * as TC from "./_TC/mod.ts"

/*! ---------------------------------------------------------------------------
 * @copyright Breda Sistemi industriali S.p.A., 2023 - http://bredasys.com
 * All rights reserved 
 * @licence You cannot host, display, distribute or share this Work in any 
 * form, both physical and digital. You cannot use this Work in any commercial
 * or non-commercial product, website or project. You cannot sell this Work
 * and you cannot mint an NFTs out of it.
 * --------------------------------------------------------------------------- 
 */