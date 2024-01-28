/** ---------------------------------------------------------------------------
 * @module [BrdGlb]
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 APG 20230707
 * @version 0.2 APG 20231115 Spostato nel suo file dedicato + Commenti e refactoring
 * @version 0.3 APG 20231227 Modulo BrdGlb server side
 * @version 0.4 APG 20240125 Aggiornato e riorganizzato elenco
 * ----------------------------------------------------------------------------
 */

/**
 * Livelli utilizzati dal visualizzatore 3D
 */
export enum BrdGlb_eLayer {

    UNSET = "0",
    
    DEFAULT = "1",
    BACKGROUND = "2",
    CURSORS = "3",
    HELPERS = "4",
    EDGES = "5",

    PRODUCT_ADAPTERS = "10",
    PRODUCT_SLIDING = "11",
    PRODUCT_BALANCING = "12",
    PRODUCT_COAT = "13",
    PRODUCT_COAT_INSERTS = "14",
    PRODUCT_COAT_FILLINGS = "15",
    PRODUCT_MOVING_AIDS = "16",

    CONTEXT_OUTSIDE = "20",
    CONTEXT_INSIDE = "21",
    CONTEXT_VEHICLES = "22",
    CONTEXT_CHARACTERS = "23",
    CONTEXT_ENVIRONMENT = "24",

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
