import {BaseModel} from "./commun"
import { SousArticle } from "./data";
import { Direction, Parc, Type} from "./reference";

type Tc = any;
// Bareme type
export interface Bareme  extends BaseModel{
    designation?: string;
    starting_date?: string; // ISO date string
    ending_date?: string; // ISO date string
    accostage?: boolean;
}

// Regime type
export interface Regime  extends BaseModel{
    designation?: string;
    bareme?: number | Bareme; // Can be a numeric ID or an object
    methode_calcule?: "A la date d'accostage" | "A l'entéée du premier TC" | "A l'entrée du dernier TC";
    enterposage?: "hard" | "easy";
    color?: string;
    parc?: number | Parc; // Can be a numeric ID or an object
}


// Rubrique type
export interface Rubrique  extends BaseModel{
    code?: string;
    designation: string;
    type_calcule?: "Calcule par unité TC" | "Calcule par unité JOUR" | "Calcule par unité TC X JOUR" | "Calcule par unité ARTICLE" | "A la demande";
    categorie?: "Automatique" | "Clarck Intégral" | "Clarck Partiel" | "Dangereux" | "Dépotage" | "Manutentions humaines Intégral" | "Manutentions humaines Partiel" | "Préstation occasionnelle" | "Scanner" | "Visite" | "Groupage" | "Entreposage groupage";
    appliquer_pour?: "Client" | "Groupeur" | "Client et Groupeur";
    direction?: number | Direction; // Can be a numeric ID or an object
    code_comptable?: string;
}

// Prestation type
export interface Prestation  extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    rubrique?: number | Rubrique; // Can be a numeric ID or an object
    type_tc?: number | Type; // Can be a numeric ID or an object
    dangereux?: boolean;
    frigo?: boolean;
    prix?: number;
    groupage?: boolean;
}

// PrestationOccasionnelle type
export interface PrestationOccasionnelle  extends BaseModel{
    rubrique?: string;
    tc?: number | Tc; // Can be a numeric ID or an object
    date?: string; // ISO date string
    prix?: number;
}

// PrestationOccasionnelleGroupage type
export interface PrestationOccasionnelleGroupage  extends BaseModel{
    rubrique?: string;
    sous_article?: number | SousArticle; // Can be a numeric ID or an object
    date?: string; // ISO date string
    prix?: number;
}

// PrestationArticle type
export interface PrestationArticle  extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    rubrique?: number | Rubrique; // Can be a numeric ID or an object
    prix?: number;
    groupage?: boolean;
}

// Sejour type
export interface Sejour  extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    type_tc?: number | Type; // Can be a numeric ID or an object
    dangereux?: boolean;
    frigo?: boolean;
    jour_min?: number;
    jour_max?: number;
    prix?: number;
}

// SejourTcGroupage type
export interface SejourTcGroupage extends BaseModel {
    bareme?: number | Bareme; // Can be a numeric ID or an object
    type_tc?: number | Type; // Can be a numeric ID or an object
    dangereux?: boolean;
    frigo?: boolean;
    jour_min?: number;
    jour_max?: number;
    prix?: number;
}

// SejourSousArticleGroupage type
export interface SejourSousArticleGroupage extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    dangereux?: boolean;
    jour_min?: number;
    jour_max?: number;
    prix?: number;
}

// Branchement type
export interface Branchement  extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    type_tc?: number | Type; // Can be a numeric ID or an object
    jour_min?: number;
    jour_max?: number;
    prix?: number;
}

// PrestationGroupage type
export interface PrestationGroupage  extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    rubrique?: number | Rubrique; // Can be a numeric ID or an object
    dangereux?: boolean;
    prix?: number;
}

// PrestationVisiteGroupage type
export interface PrestationVisiteGroupage  extends BaseModel{
    bareme?: number | Bareme; // Can be a numeric ID or an object
    dangereux?: boolean;
    volume_min?: number;
    volume_max?: number;
    prix?: number;
}
