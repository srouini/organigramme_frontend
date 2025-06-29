import {Navire, Armateur, Port, Consignataire, Client, Transitaire} from "./reference"
import {BaseModel} from "./commun"
import { Bareme, Regime } from "./bareme";


// Gros Model
export interface Gros extends BaseModel {
    numero?: string;
    gros?: string;
    escale?: string;
    accostage?: string; // Use string for date
    port_emission?: Port | number; // ForeignKey as object
    port_reception?: Port | number; // ForeignKey as object
    navire?: Navire | number; // ForeignKey as object
    armateur?: Armateur | number; // ForeignKey as object
    consignataire?: Consignataire | number; // ForeignKey as object
    bareme?: number | Bareme; // ForeignKey IDs if not an object
    regime?: number | Regime; // ForeignKey IDs if not an object
}

// Article Model
export interface Article extends BaseModel {
    gros?: Gros | number; // ForeignKey as object
    numero?: number;
    groupage?: boolean;
    date_depotage?: string; // Use string for date/time
    depote?: boolean;
    observation_depotage?: string;
    bl?: string;
    designation?: string;
    client?: number | Client; // ForeignKey IDs
    transitaire?: number | Transitaire; // ForeignKey IDs
}

// Position Model
export interface Position extends BaseModel {
    parc?: number; // ForeignKey IDs
    zone?: number; // ForeignKey IDs
    tc?: number; // ForeignKey IDs
    ligne?: number;
    range?: number;
    garbage?: number;
    date_position?: string; // Use string for date
}

// BulletinsEscort Model
export interface BulletinsEscort extends BaseModel {
    bulletins?: string;
    numero?: string;
    date_creation?: string; // Use string for date
    gros?: Gros | number; // ForeignKey as object
    charge_chargement?: number; // ForeignKey IDs or object
    charge_reception?: number; // ForeignKey IDs or object
    loaded?: boolean;
    receved?: boolean;
}

// Tc Model
export interface Container extends BaseModel {
    article?: Article | number; // ForeignKey as object
    type_conteneur?: number; // ForeignKey IDs if not an object
    nature_conteneur?: number; // ForeignKey IDs if not an object
    matricule?: string;
    tar?: number;
    poids?: string;
    bulletins?: BulletinsEscort | number; // ForeignKey as object
    matricule_camion?: string;
    date_sortie_port?: string; // Use string for date/time
    date_entree_port_sec?: string; // Use string for date/time
    date_sortie_port_sec?: string; // Use string for date/time
    receved_by?: number; // ForeignKey IDs
    billed?: boolean;
    etat?: string;
    observation_chargement?: string;
    observation_reception?: string;
    observation_entree_port_sec?: string;
    observation_sortie_port_sec?: string;
    current_scelle?: number; // ForeignKey IDs
    receved?: boolean;
    depote?: boolean;
    date_depotage?: string; // Use string for date
}

// SousArticle Model
export interface SousArticle extends BaseModel {
    numero?: number;
    tc?: Container | number; // ForeignKey as object
    bl?: string;
    volume?: number;
    dangereux?: boolean;
    nombre_colis?: number;
    description?: string;
    surface?: number;
    quantite?: number;
    poids?: number;
    unite_de_visite?: string;
    unite_de_chargement?: string;
    unite_de_magasinage?: string;
    client?: number | Client; // ForeignKey IDs
    transitaire?: number | Transitaire; // ForeignKey IDs
    designation?: string;
    invoiced?: boolean;
    box?: number; // ForeignKey IDs
    billed?:boolean
}

// Visite Model
export interface Visite extends BaseModel {
    visite?: string;
    numero?: string;
    date_creation?: string; // Use string for date
    date?: string; // Use string for date
    valid?: boolean;
}
