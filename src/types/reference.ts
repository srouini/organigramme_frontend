import { Bareme } from "./bareme";
import { BaseModel } from "./commun";

  export interface Pays extends BaseModel {
    code?: number;
    alpha2?: string;
    alpha3?: string;
    nom_fr_fr?: string;
    nom_en_gb?: string;
  }
  
  export interface Port extends BaseModel {
    raison_sociale?: string;
    code?: string;
    pays?: number | Pays;  // Foreign key to Pays, can be ID or object
  }
  
  export interface Type extends BaseModel {
    designation?: string;
  }
  
  export interface Transitaire extends BaseModel {
    raison_sociale?: string;
    adress?: string;
    email?: string;
    tel?: string;
    soumis_tva?: boolean;
  }
  
  export interface Groupeur extends BaseModel {
    raison_sociale?: string;
    adress?: string;
    email?: string;
    tel?: string;
    soumis_tva?: boolean;
  }
  
  export interface Navire extends BaseModel {
    nom?: string;
    code?: string;
  }
  
  export interface Armateur extends BaseModel {
    raison_sociale?: string;
    code?: string;
  }
  
  export interface Consignataire extends BaseModel {
    raison_sociale?: string;
    code?: string;
  }
  
  export interface Agent extends BaseModel {
    nom?: string;
    prenom?: string;
  }
  
  export interface Client extends BaseModel {
    raison_sociale?: string;
    adress?: string;
    email?: string;
    tel?: string;
    code?: string;
    RC?: string;
    NIF?: string;
    AI?: string;
    NIS?: string;
    soumis_tva?: boolean;
    bareme?: number | Bareme;  // Foreign key to Bareme, can be ID or object
  }
  
  export interface Profile extends BaseModel {
    layout?: string;
    siderMenuType?: string;
    colorPrimary?: string;
  }
  

  export interface Parc extends BaseModel {
    designation?: string;
  }
  
  export interface Box extends BaseModel {
    designation?: string;
    parc?: number | Parc;  // Foreign key to Parc, can be ID or object
  }
  
  export interface Zone extends BaseModel {
    parc?: number | Parc;  // Foreign key to Parc, can be ID or object
    zone?: string;
    lignes?: number;
    ranges?: number;
    gerbage?: number;
  }
  
  export interface Banque extends BaseModel {
    raison_sociale?: string;
    adress?: string;
    email?: string;
    tel?: string;
  }
  
  export interface Direction extends BaseModel {
    nom?: string;
    code?: string;
    couleur?: string;
  }
  
  export interface ContainerType extends BaseModel {
    designation:string
    couleur:string
  }

  export interface Nature extends BaseModel {
    designation:string
    couleur:string
  }

  export interface AgentDouane {
    id: number;
    full_name: string;
    code: string;
    active: boolean;
  }

  export interface User extends BaseModel {
    first_name:string;
    last_name:string;
    full_name:string;
  }


  export interface Grade extends BaseModel {
    name?: string;
    level?: string;
    color?: string;
    description?: string;
  }

  export interface Organigram extends BaseModel{
    name?: string;
    state?: string;
  }

  export interface Position extends BaseModel{
    organigram : Organigram;
    title: string;
    grade: number | Grade;  // Foreign key to Grade, can be ID or object
    position_x?: number;
    position_y?: number;
  }
