/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto 
 * @version 0.1 APG 20240402
 * ----------------------------------------------------------------------------
 */
import {
    Uts
} from "../deps.ts";


/**
 * Firma per il risultato della chiamata in post verso i microservizi 
 * che generano modelli dinamici lato server
 */
export const BrdGlb_IDynamicModel_PostPayload_Signature = "BrdGlb_IDynamicModel_PostPayload_Signature_V1";


/**
 * Payload restituito della chiamata in post verso i microservizi
 * che generano modelli dinamici lato server
 */
export interface BrdGlb_IDynamicModel_PostPayload extends Uts.BrdUts_IRestPayload {

    /**
    * Firma del record
    */
    readonly signature: "BrdGlb_IDynamicModel_PostPayload_Signature_V1";

    /**
     * Ci si aspetta che il risultato della elaborazione sia un url in formato stringa
     * dal quale verrà scaricato il file GLTF o GLB con una chiamata in GET
     */
    data: string;
}
