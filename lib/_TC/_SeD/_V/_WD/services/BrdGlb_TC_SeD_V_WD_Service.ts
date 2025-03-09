/** ---------------------------------------------------------------------------
 * @module [Brd/3Dv]
 * @author [DLV] De Luca Valentina
 * @author [APG] Angeli Paolo Giusto
 * @version 0.1 DLV 20230831
 * @version 0.2 DLV 20231013 - PPI lato esterno + con soglia o senza + in posizione
 * @version 0.3 APG 20231113 - Refactoring, semplificazine pulizia
 * @notes Regole e disegni in cartella: C:\svnprog\deno\V3d\srv\assets\support
 * ----------------------------------------------------------------------------
 */
import {
  THREE,
  Blm,
  Uts } from "../../../../../deps.ts";

import { 
  BrdGlb_ShapeService  } from "../../../../../services/BrdGlb_ShapeService.ts";




export class BrdGlb_TC_SeD_V_WD_Service {
  
  logger: Uts.BrdUts_Logger;

  //Parametri fissi

  readonly lenghtWD: number;
  readonly initialPosition: number;
  readonly offsetExtFrame: number;
  readonly offsetIntFrame: number;
  readonly offsetExtLeaf: number;
  readonly offsetIntLeaf: number;
  readonly frameHExt: number;
  readonly frameHInt: number;
  readonly leafHExt: number;
  readonly leafHInt: number;
  //dimensioni dei profili anta e cassa, interni ed esterni, e della guarnizione
  readonly widthFrameExt = 28;
  readonly widthFrameInt = 109;
  readonly widthLeafExt = 55;
  readonly widthLeafInt = 84;
  readonly ridHighFrame = 39;
  readonly ridHighLeaf = 44;
  readonly thicknessRubberExt = 100;
  readonly thicknessRubberInt = 200;
  //valori di riduzione del profilo rispetto all'altezza del pannello
  readonly frameLeafVertInterm = 7 + 8;
  readonly frameVertHighExt = 390; //valore fisso per pannelli, cambia se VISA
  readonly frameVertHighInt = 439; //valore fisso per pannelli, cambia se VISA
  readonly leafVertHighExt = 359;
  readonly leafVertHighInt = 326;
  //panelsHeights restituisce array con le altezze delle sezioni relative porta pedonale
  panelsHeights: number[];

  // Configurazione della porta pedonale
  config: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IWicketDoorConfig;



  constructor(
    alogger: Uts.BrdUts_Logger,
    aParams: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IWicketDoorConfig
  ) {
  
    this.logger = alogger;

    this.config = aParams;
    this.panelsHeights = this.#getNumberSectionsWicketDoor();

    this.lenghtWD = this.config.w;
    //posizione iniziale della porta pedonale => ? soglia ribassata : soglia normale
    this.initialPosition = this.config.hasLoweredThreshold ? 30 : 151;
    // posizione assoluta dei profili anta e cassa rispetto al centro della porta
    this.offsetExtFrame = this.config.w / 2 + 36;
    this.offsetIntFrame = this.config.w / 2 + 9;
    this.offsetExtLeaf = this.config.w / 2 - 26;
    this.offsetIntLeaf = this.config.w / 2 - 80;
    //dimensione dei profili orizzontali rispetto alle quote nominali della porta pedonale
    this.frameHExt = this.config.w + 100 + 28;
    this.frameHInt = this.config.w + 100 + 136;
    this.leafHExt = this.config.w + 58;
    this.leafHInt = this.config.w + 8; //TODO valore da inserire
  }



  /** Funzione che restituisce il profilo specchiato con valori in X invariati e in Y con segno opposto */
  private mirrorProfileY(profile: Blm.BrdBlm_IPoint2D[]) {
    
    const r: Blm.BrdBlm_IPoint2D[] = [];
    
    for (const point of profile) {
      r.push({ x: point.x, y: point.y * -1 });
    }

    return r;
  }
  

  
  private mirrorProfileX(profile: Blm.BrdBlm_IPoint2D[]){
  
    const r: Blm.BrdBlm_IPoint2D[] = [];
  
    for (const point of profile) {
      r.push({ x: point.x * -1, y: point.y });
    }

    return r;
  }



  /**
   * Determino il numero di sezioni della porta pedonale
   * Regole: PPI Luxor 3 pannelli
   */
  #getNumberSectionsWicketDoor(): number[] {
  
    const r = [];
  
    let numSections = 4;
    //TODO da completare con regole delle altezze
    if (this.config.model === Blm.TC.SeD.V.BrdBlm_TC_SeD_V_eModel.LUXOR) {
      //con soglia normale
      if (this.config.hasLoweredThreshold === false) {
        //ppi su tre pannelli fino h 2260 + da 2650 a 3250
        numSections = 3;
      }
      //ppi su quattro pannelli
    }
    for (let i = 0; i < numSections; i++) {
      r.push(this.config.sectionsHeights[i]);
    }

    return r;

  }



  /** PROFILI VERTICALI
   * Disegno: PPI_01
   * - I profili verticali vanno disegnati in orizzontale,
   * rispetto al centro della porta e poi ruotati di 90°
   */
  #getVerticalAluProfile() {

    const aluProf: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorFrame = {
      case: [],
      leaf: [],
    };
    let position = this.initialPosition;
    //funzione che determina i punti di costruzione dei profili
    for (let i = 0; i < this.panelsHeights.length; i++) {
      const sectH = this.panelsHeights[i];

      /**
       * Definizione dei vari profili da disegnare
       */
      const frameProfSx: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
        ext: [],
        int: [],
        vertical: true,
      };
      const frameProfDx: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
        ext: [],
        int: [],
        vertical: true,
      };
      const leafProfSx: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
        ext: [],
        int: [],
        vertical: true,
      };
      const leafProfDx: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
        ext: [],
        int: [],
        vertical: true,
      };

      /**
       * Inserimento delle coordinate dei punti
       */
      //CASSA
      /** Riduzione cassa profilo di base rispetto al pannello
       *  ? con soglia ribassata : con soglia normale
       */
      const frameVertBase = this.config.hasLoweredThreshold ? 13 : 113;
      //check per definire forma del pezzo, rettangolare o trapezoidale (false = rettangolo / true = trapezio)
      const checkTheshold = this.config.hasLoweredThreshold ? false : true;
      const checkFrame = [checkTheshold, false, false, true];
      let ridFrameExt = this.frameLeafVertInterm;
      let ridFrameInt = this.frameLeafVertInterm;
      let ridDownFrameExt = 0;
      let ridUpFrameExt = 0;
      let ridUpFrameInt = 0;
      let ridCutFrameInt = 0;
      let ridHtheshold = 0;
      if (i === 0) {
        ridFrameExt = frameVertBase;
        ridFrameInt = frameVertBase;
        ridHtheshold = this.config.hasLoweredThreshold ? 0 : 96;
        if (checkFrame[0] === false) {
          ridDownFrameExt = 0;
        } else if (checkFrame[0] === true) {
          ridDownFrameExt = this.widthFrameExt;
        }
      }
      if (i === this.panelsHeights.length - 1) {
        ridFrameExt = this.panelsHeights[i] - this.frameVertHighExt;
        ridFrameInt = this.panelsHeights[i] - this.frameVertHighInt;
        ridUpFrameExt = this.widthFrameExt;
        ridUpFrameInt = this.widthFrameInt;
        ridCutFrameInt = this.ridHighFrame;
      }

      frameProfSx.ext = [
        { x: position + ridDownFrameExt, y: this.offsetExtFrame },
        { x: position, y: this.offsetExtFrame + this.widthFrameExt },
        {
          x: position + sectH - ridFrameExt,
          y: this.offsetExtFrame + this.widthFrameExt,
        },
        {
          x: position + sectH - ridFrameExt - ridUpFrameExt,
          y: this.offsetExtFrame,
        },
      ];
      if (checkTheshold === true && i === 0) {
        frameProfSx.int = [
          { x: position + this.widthFrameInt, y: this.offsetIntFrame },
          { x: position, y: this.offsetIntFrame + 60 },
          { x: position, y: this.offsetIntFrame + this.widthFrameInt },
          {
            x: position + sectH - ridFrameInt,
            y: this.offsetIntFrame + this.widthFrameInt,
          },
          {
            x: position + sectH - ridFrameInt,
            y: this.offsetIntFrame,
          },
        ];
      } else {
        frameProfSx.int = [
          { x: position, y: this.offsetIntFrame },
          { x: position, y: this.offsetIntFrame + this.widthFrameInt },
          {
            x: position + sectH - ridFrameInt - ridCutFrameInt,
            y: this.offsetIntFrame + this.widthFrameInt,
          },
          //inserire punto supplementare per profilo alto
          {
            x: position + sectH - ridFrameInt - ridUpFrameInt,
            y: this.offsetIntFrame,
          },
        ];
      }
      if (i === this.panelsHeights.length - 1) {
        //TODO inserisco nel profilo frameProfSx.int un punto per avere il trapezio tagliato di 39mm
        const point = {
          x: position + sectH - ridFrameInt - ridCutFrameInt,
          y: this.offsetIntFrame + this.widthFrameInt - ridCutFrameInt,
        };
        frameProfSx.int.splice(3, 0, point);
      }
      frameProfDx.ext = this.mirrorProfileY(frameProfSx.ext);
      frameProfDx.int = this.mirrorProfileY(frameProfSx.int);

      // ANTA
      let ridHthesholdLeafBase = 0;
      let cutLeafProfileBase = 0;
      let cutLeafProfileHight = 0;
      let ridHthesholdLeafHight = 0;
      if (i === 0) {
        if (this.config.hasLoweredThreshold === false) {
          ridHthesholdLeafBase = this.widthFrameExt;
        }
        ridHthesholdLeafBase = ridHthesholdLeafBase + 3;
        cutLeafProfileBase = this.widthLeafExt;
      }
      if (i === this.panelsHeights.length - 1) {
        ridHthesholdLeafHight = this.widthFrameExt + 3;
        cutLeafProfileHight = this.widthLeafExt;
      }
      leafProfSx.ext = [
        {
          x: position + ridHthesholdLeafBase + cutLeafProfileBase,
          y: this.offsetExtLeaf,
        },
        {
          x: position + ridHthesholdLeafBase,
          y: this.offsetExtLeaf + this.widthLeafExt,
        },
        {
          x: position + sectH - ridFrameExt - ridHthesholdLeafHight,
          y: this.offsetExtLeaf + this.widthLeafExt,
        },
        {
          x:
            position +
            sectH -
            ridFrameExt -
            ridUpFrameExt -
            cutLeafProfileHight,
          y: this.offsetExtLeaf,
        },
      ];
      leafProfSx.int = [
        { x: 0, y: 0 },
        // { x: position, y: this.offsetIntLeaf },
        // { x: position, y: this.offsetIntLeaf + this.widthLeafInt },
        // {
        //   x: position + sectH - ridLeaf,
        //   y: this.offsetIntLeaf + this.widthLeafInt,
        // },
        // { x: position + sectH - ridLeaf, y: this.offsetIntLeaf },
        // { x: position, y: this.offsetIntLeaf },
      ];
      leafProfDx.ext = this.mirrorProfileY(leafProfSx.ext);
      leafProfDx.int = this.mirrorProfileY(leafProfSx.int);

      position = position + sectH - ridHtheshold;

      aluProf.case.push(frameProfSx);
      aluProf.case.push(frameProfDx);
      aluProf.leaf.push(leafProfSx);
      aluProf.leaf.push(leafProfDx);
      // console.log("frame", frameProfSx);
    }

    return aluProf;
  }



  #getVertAluProfileShapes(): { ext: THREE.Shape[]; int: THREE.Shape[] } {
  
    /** array con tutti i punti dei profili */
    const aluProfile = this.#getVerticalAluProfile();
    const extShape = [];
    const intShape = [];
  
    for (const profile of aluProfile.case) {
      const aluProfileExtShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.ext
      );
      const aluProfileIntShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.int
      );
      extShape.push(aluProfileExtShape);
      intShape.push(aluProfileIntShape);
    }
    for (const profile of aluProfile.leaf) {
      const aluProfileExtShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.ext
      );
      const aluProfileIntShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.int
      );
      extShape.push(aluProfileExtShape);
      intShape.push(aluProfileIntShape);
    }

    return { ext: extShape, int: intShape };
  }



  #buildVerticalWicketDoorAluProfiles(): {
    ext: THREE.Shape[][];
    int: THREE.Shape[][];
  } {

    const rExt = [];
    const rInt = [];
    const aluProfileGeometries = this.#getVertAluProfileShapes();
    rExt.push(aluProfileGeometries.ext);
    rInt.push(aluProfileGeometries.int);

    return { ext: rExt, int: rInt };
  }


  /** PROFILI ORIZZONTALI
   * - Vedere disegno PPI_01 in cartella support
   *      i profili orizzontali vengono disegnati in posizione
   */
  #getHorizontalAluProfile() {
    const aluProf: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorFrame = {
      case: [],
      leaf: [],
    };
    let positionFrame = this.initialPosition;
    let positionLeaf = this.initialPosition;
    //determina la posizione dei profili
    let ridHthesholdLeaf = 0;
    for (let i = 0; i < this.panelsHeights.length - 1; i++) {
      const sectH = this.panelsHeights[i];
      let ridHtheshold = 0;
      if (i === 0) {
        ridHtheshold = this.config.hasLoweredThreshold ? 0 : 96;
        ridHthesholdLeaf = this.config.hasLoweredThreshold ? 0 : 28;
      }
      positionFrame = positionFrame + sectH - ridHtheshold;
      positionLeaf = positionLeaf + sectH - ridHtheshold;
      if (i === this.panelsHeights.length - 2) {
        positionFrame = positionFrame + this.frameVertHighExt;
        positionLeaf = positionLeaf + this.leafVertHighExt;
      }
    }
    /**
     * Definizione dei vari profili da disegnare
     */
    const frameProfHight: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };
    const frameProfBase: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };
    const leafProfHeight: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };
    const leafProfBase: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };

    /**
     * CASSA
     */
    //alta
    frameProfHight.ext = [
      { x: -this.frameHExt / 2, y: positionFrame },
      { x: this.frameHExt / 2, y: positionFrame },
      {
        x: this.frameHExt / 2 - this.widthFrameExt,
        y: positionFrame - this.widthFrameExt,
      },
      {
        x: -this.frameHExt / 2 + this.widthFrameExt,
        y: positionFrame - this.widthFrameExt,
      },
    ];
    frameProfHight.int = [
      { x: -this.frameHInt / 2 + this.ridHighFrame, y: positionFrame },
      { x: this.frameHInt / 2 - this.ridHighFrame, y: positionFrame },
      {
        x: this.frameHInt / 2 - this.widthFrameInt,
        y: positionFrame - this.widthFrameInt + this.ridHighFrame,
      },
      {
        x: -this.frameHInt / 2 + this.widthFrameInt,
        y: positionFrame - this.widthFrameInt + this.ridHighFrame,
      },
    ];
    aluProf.case.push(frameProfHight);
    //base
    frameProfBase.ext = [
      {
        x: -this.frameHExt / 2 + this.widthFrameExt,
        y: this.initialPosition + this.widthFrameExt,
      },
      {
        x: this.frameHExt / 2 - this.widthFrameExt,
        y: this.initialPosition + this.widthFrameExt,
      },
      { x: this.frameHExt / 2, y: this.initialPosition },
      { x: -this.frameHExt / 2, y: this.initialPosition },
    ];
    frameProfBase.int = [
      {
        x: this.offsetIntFrame,
        y: this.initialPosition + this.widthFrameInt,
      },
      { x: this.offsetIntFrame + 60, y: this.initialPosition },
      { x: -this.offsetIntFrame - 60, y: this.initialPosition },
      {
        x: -this.offsetIntFrame,
        y: this.initialPosition + this.widthFrameInt,
      },
    ];
    if (this.config.hasLoweredThreshold === false) {
      aluProf.case.push(frameProfBase);
    }
    /**
     * ANTA
     */
    const intFrameLeafVert = 3;
    // alta
    leafProfHeight.ext = [
      { x: -this.leafHExt / 2, y: positionLeaf },
      { x: this.leafHExt / 2, y: positionLeaf },
      {
        x: this.leafHExt / 2 - this.widthLeafExt,
        y: positionLeaf - this.widthLeafExt,
      },
      {
        x: -this.leafHExt / 2 + this.widthLeafExt,
        y: positionLeaf - this.widthLeafExt,
      },
    ];
    leafProfHeight.int = [
      { x: -this.leafHInt / 2, y: positionLeaf - this.ridHighLeaf },
      { x: this.leafHInt / 2, y: positionLeaf - this.ridHighLeaf },
      {
        x: this.leafHInt / 2 - this.widthLeafInt,
        y: positionLeaf - this.widthLeafInt - this.ridHighLeaf,
      },
      {
        x: -this.leafHInt / 2 + this.widthLeafInt,
        y: positionLeaf - this.widthLeafInt - this.ridHighLeaf,
      },
    ];
    aluProf.leaf.push(leafProfHeight);
    // base
    leafProfBase.ext = [
      {
        x: -this.leafHExt / 2 + this.widthLeafExt,
        y:
          this.initialPosition +
          intFrameLeafVert +
          this.widthLeafExt +
          ridHthesholdLeaf,
      },
      {
        x: this.leafHExt / 2 - this.widthLeafExt,
        y:
          this.initialPosition +
          intFrameLeafVert +
          this.widthLeafExt +
          ridHthesholdLeaf,
      },
      {
        x: this.leafHExt / 2,
        y: this.initialPosition + intFrameLeafVert + ridHthesholdLeaf,
      },
      {
        x: -this.leafHExt / 2,
        y: this.initialPosition + intFrameLeafVert + ridHthesholdLeaf,
      },
    ];
    leafProfBase.int = [{ x: 0, y: 0 }]; //TODO
    aluProf.leaf.push(leafProfBase);

    return aluProf;
  }



  /** array con tutti i punti dei profili */
  #getHorizAluProfileShapes(): { ext: THREE.Shape[]; int: THREE.Shape[] } {
  
    const horizAluProfile = this.#getHorizontalAluProfile();
    const extShape = [];
    const intShape = [];
  
    for (const profile of horizAluProfile.case) {
      const aluProfileExtShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.ext
      );
      const aluProfileIntShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.int
      );
      extShape.push(aluProfileExtShape);
      intShape.push(aluProfileIntShape);
    }
    for (const profile of horizAluProfile.leaf) {
      const aluProfileExtShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.ext
      );
      const aluProfileIntShape = BrdGlb_ShapeService.GetShapeFromArrayOfPoints(
        profile.int
      );
      extShape.push(aluProfileExtShape);
      intShape.push(aluProfileIntShape);
    }
    return { ext: extShape, int: intShape };
  }



  #buildHorizontalWicketDoorAluProfiles(): {
    ext: THREE.Shape[][];
    int: THREE.Shape[][];
  } {
    const rExt = [];
    const rInt = [];
    const aluProfileGeometries = this.#getHorizAluProfileShapes();
    rExt.push(aluProfileGeometries.ext);
    rInt.push(aluProfileGeometries.int);

    return { ext: rExt, int: rInt };
  }



  /** GUARNIZIONE
   * - Vedere disegno PPI_01 in cartella support
   * la guarnizione sporge rispetto al profilo di 3mm
   */
  /** TODO
   *  - Dividere guarnizione in trapezi
   * CASSA - verticali esterni
   * CASSA - orizzontali esterni (normale)
   * CASSA - orizzontali esterni (ribassata)
   *  - verticali interni
   *  - orizzontali interni (normale)
   *  - orizzontali interni (ribassata)
   */
  #getRubberProfile() {
    const rubProf: any = {
      vertical: [],
      horizontal: [],
    };
    const center = this.lenghtWD / 2;
    const compVerticalExt = 62 + 8;
    const compVerticalInt = 118 + 6;
    const initialPositionExt = this.initialPosition - 3;
    const initialPositionInt = this.initialPosition - 12;

    let positionRubber = initialPositionExt + 6;
    //determina la posizione dei profili
    for (let i = 0; i < this.panelsHeights.length - 1; i++) {
      const sectH = this.panelsHeights[i];
      let ridHtheshold = 0;
      if (i === 0) {
        ridHtheshold = this.config.hasLoweredThreshold ? 0 : 96;
      }
      positionRubber = positionRubber + sectH - ridHtheshold;
      if (i === this.panelsHeights.length - 2) {
        positionRubber = positionRubber + this.frameVertHighExt + 3;
      }
    }
    const ridBaseThesholdExt = this.config.hasLoweredThreshold
      ? this.widthFrameExt + 3
      : 0; //TODO
    const ridBaseThesholdInt = this.config.hasLoweredThreshold ? 51 : 0;
    /**
     * Definizione dei vari profili da disegnare
     */
    const rubberProfHight: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };
    const rubberProfBase: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };
    const rubberProfVertSx: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };
    const rubberProfVertDx: Blm.TC.SeD.BrdBlm_TC_SeD_IWicketDoorAluOutlines = {
      ext: [],
      int: [],
      vertical: true,
    };

    //Orizzontale base
    rubberProfBase.ext = [
      {
        x: -center - compVerticalExt + this.thicknessRubberExt,
        y: initialPositionExt + this.thicknessRubberExt - ridBaseThesholdExt,
      },
      { x: -center - compVerticalExt, y: initialPositionExt },
      { x: center + compVerticalExt, y: initialPositionExt },
      {
        x: center + compVerticalExt - this.thicknessRubberExt,
        y: initialPositionExt + this.thicknessRubberExt - ridBaseThesholdExt,
      },
    ];
    rubberProfBase.int = [
      {
        x: -center - compVerticalInt + this.thicknessRubberInt,
        y: initialPositionInt + this.thicknessRubberInt - ridBaseThesholdInt,
      },
      { x: -center - compVerticalInt, y: initialPositionInt },
      { x: center + compVerticalInt, y: initialPositionInt },
      {
        x: center + compVerticalInt - this.thicknessRubberInt,
        y: initialPositionInt + this.thicknessRubberInt - ridBaseThesholdInt,
      },
    ];
    rubProf.horizontal.push(rubberProfBase);
    //Orizzontale superiore
    rubberProfHight.ext = [
      {
        x: -center - compVerticalExt + this.thicknessRubberExt,
        y: positionRubber - this.thicknessRubberExt,
      },
      { x: -center - compVerticalExt, y: positionRubber },
      { x: center + compVerticalExt, y: positionRubber },
      {
        x: center + compVerticalExt - this.thicknessRubberExt,
        y: positionRubber - this.thicknessRubberExt,
      },
    ];
    rubberProfHight.int = [
      {
        x: -center - compVerticalInt + this.thicknessRubberInt,
        y: positionRubber - this.thicknessRubberInt,
      },
      { x: -center - compVerticalInt, y: positionRubber },
      { x: center + compVerticalInt, y: positionRubber },
      {
        x: center + compVerticalInt - this.thicknessRubberInt,
        y: positionRubber - this.thicknessRubberInt,
      },
    ];
    rubProf.horizontal.push(rubberProfHight);
    //Verticali
    rubberProfVertSx.ext = [
      {
        x: -center - compVerticalExt + this.thicknessRubberExt,
        y: positionRubber - this.thicknessRubberExt,
      },
      {
        x: -center - compVerticalExt + this.thicknessRubberExt,
        y: initialPositionExt + this.thicknessRubberExt - ridBaseThesholdExt,
      },
      { x: -center - compVerticalExt, y: initialPositionExt },
      { x: -center - compVerticalExt, y: positionRubber },
    ];
    rubberProfVertSx.int = [
      {
        x: -center - compVerticalInt + this.thicknessRubberInt,
        y: positionRubber - this.thicknessRubberInt,
      },
      {
        x: -center - compVerticalInt + this.thicknessRubberInt,
        y: initialPositionInt + this.thicknessRubberInt - ridBaseThesholdInt,
      },
      { x: -center - compVerticalInt, y: initialPositionInt },
      { x: -center - compVerticalInt, y: positionRubber },
    ];
    rubProf.vertical.push(rubberProfVertSx);

    rubberProfVertDx.ext = this.mirrorProfileX(rubberProfVertSx.ext);
    rubberProfVertDx.int = this.mirrorProfileX(rubberProfVertSx.int);
    rubProf.vertical.push(rubberProfVertDx);
    return rubProf;
  }



  /** array con tutti i punti dei profili */
  #getRubberShapes() {
  
    const rubberProfile = this.#getRubberProfile();
    const extShape = [];
    const intShape = [];
  
    for (const profile of rubberProfile.vertical) {
      const rubberProfileExtShape =
        BrdGlb_ShapeService.GetShapeFromArrayOfPoints(profile.ext);
      const rubberProfileIntShape =
        BrdGlb_ShapeService.GetShapeFromArrayOfPoints(profile.int);
      extShape.push(rubberProfileExtShape);
      intShape.push(rubberProfileIntShape);
    }
    for (const profile of rubberProfile.horizontal) {
      const rubberProfileExtShape =
        BrdGlb_ShapeService.GetShapeFromArrayOfPoints(profile.ext);
      const rubberProfileIntShape =
        BrdGlb_ShapeService.GetShapeFromArrayOfPoints(profile.int);
      extShape.push(rubberProfileExtShape);
      intShape.push(rubberProfileIntShape);
    }

    return { ext: extShape, int: intShape };
  }
  
  
  
  #buildRubberProfiles() {
    const rExt = [];
    const rInt = [];
    const rubberProfileGeometries = this.#getRubberShapes();
    rExt.push(rubberProfileGeometries.ext);
    rInt.push(rubberProfileGeometries.int);

    return { ext: rExt, int: rInt };
  }



  /** Funzione che mette in posizione la porta pedonale rispetto al centro */
  private positionWicketDoor(
    aconfig: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IWicketDoorConfig
  ) {
    const sectionLenght = aconfig.sectionLength;
    const position = aconfig.x;
    const dimensionWicketDoor = aconfig.w;
    const centerWicketDoor =
      -sectionLenght / 2 + dimensionWicketDoor / 2 + position;
    return centerWicketDoor;
  }

  
  
  //passa i parametri della PPI, larghezza, altezza, posizione, apertura, sequenza pannelli portone, modello
  buildWicketDoor(
    ascene: THREE.Scene,
    alogger: Uts.BrdUts_Logger,
    aconfig: Blm.TC.SeD.V.BrdBlm_TC_SeD_V_IWicketDoorConfig
  ) {
    // Alu Profiles
    const wdProfiles = new BrdGlb_TC_SeD_V_WD_Service(alogger, aconfig);
    //parametri di estrusione
    const parEstrGaskets = {
      depth: 3,
      steps: 1,
    };
    const parEstrRubber = {
      depth: 2,
      steps: 1,
    };
    //TODO creare funzione che sposta e ruota gli elementi di un valore che viene indicato una volta sola

    const positionWicketDoor= this.positionWicketDoor(aconfig)
    //Verticali
    const aluVerticalProfiles =
      wdProfiles.#buildVerticalWicketDoorAluProfiles();
    for (const geometry of aluVerticalProfiles.ext) {
      const extAluProfileGeometry = new THREE.ExtrudeGeometry(
        geometry,
        parEstrGaskets
      );
      extAluProfileGeometry.translate(0, -positionWicketDoor, -15);
      extAluProfileGeometry.rotateZ(Math.PI / 2);
      const mesh = new THREE.Mesh(
        extAluProfileGeometry,
        new THREE.MeshStandardMaterial({ color: 0xe7ebda })
      );
      ascene.add(mesh);
    }
    // for (const geometry of aluVerticalProfiles.int) {
    //   const intAluProfileGeometry = new THREE.ExtrudeGeometry(
    //     geometry,
    //     parEstrGaskets
    //   );
    //   intAluProfileGeometry.translate(10, -positionWicketDoor, -17 - 50); //quote corrette
    //   intAluProfileGeometry.rotateZ(Math.PI / 2);
    //   const mesh = new THREE.Mesh(
    //     intAluProfileGeometry,
    //     new THREE.MeshStandardMaterial({ color: 0xE7EBDA })
    //   );
    //   ascene.add(mesh);
    // }
    //Orizzontali
    const aluHorizontalProfiles =
      wdProfiles.#buildHorizontalWicketDoorAluProfiles();
    for (const geometry of aluHorizontalProfiles.ext) {
      const extAluProfileGeometry = new THREE.ExtrudeGeometry(
        geometry,
        parEstrGaskets
      );
      extAluProfileGeometry.translate(positionWicketDoor, 0, -15);
      const mesh = new THREE.Mesh(
        extAluProfileGeometry,
        new THREE.MeshStandardMaterial({ color: 0xe7ebda })
      );
      ascene.add(mesh);
    }
    // for (const geometry of aluHorizontalProfiles.int) {
    //   const intAluProfileGeometry = new THREE.ExtrudeGeometry(
    //     geometry,
    //     parEstrGaskets
    //   );
    //   intAluProfileGeometry.translate(positionWicketDoor,0, -17 - 50); //quote corrette
    //   const mesh = new THREE.Mesh(
    //     intAluProfileGeometry,
    //     new THREE.MeshStandardMaterial({ color: 0xE7EBDA })
    //   );
    //   ascene.add(mesh);
    // }
    //Guarnizione
    const rubberProfile = wdProfiles.#buildRubberProfiles();
    for (const geometry of rubberProfile.ext) {
      const extRubberGeometry = new THREE.ExtrudeGeometry(
        geometry,
        parEstrRubber
      );
      extRubberGeometry.translate(positionWicketDoor, 0, -17);
      const mesh = new THREE.Mesh(
        extRubberGeometry,
        new THREE.MeshStandardMaterial({ color: 0x202020 })
      );
      ascene.add(mesh);
    }
    // for (const geometry of rubberProfile.int) {
    //   const intRubberGeometry = new THREE.ExtrudeGeometry(
    //     geometry,
    //     parEstrRubber
    //   );
    //   intRubberGeometry.translate(positionWicketDoor, 20, -17 - 47);
    //   const mesh = new THREE.Mesh(
    //     intRubberGeometry,
    //     new THREE.MeshStandardMaterial({ color: 0x202020 })
    //   );
    //   ascene.add(mesh);
    // }
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
