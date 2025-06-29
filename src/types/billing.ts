// Define base types

import  {Gros,Article, SousArticle} from "./data"
import {BaseModel} from "./commun"

// Define the Proforma model with foreign keys as both IDs and objects
export interface Proforma extends BaseModel {
    numero?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    gros?: number | Gros; // Foreign key to Gros, can be ID or object
    article?: number | Article; // Foreign key to Article, can be ID or object
    date_proforma?: string; // Date in YYYY-MM-DD format
    HT?: number;
    TVA?: number;
    TTC?: number;
    tva?: boolean;
    debeur?: boolean;
    DEBEUR?: number;
    remise?: boolean;
    REMISE?: number;
    TR?: number;
    valide?: boolean;
    trashed?: boolean;
    entreposage?: boolean;
}

// Define the Groupe model
export interface Groupe extends BaseModel {
    proforma?: number | Proforma; // Foreign key to Proforma, can be ID or object
    type?: number; // Foreign key to Type, can be ID or object
    dangereux?: boolean;
    frigo?: boolean;
    tcs?: number;
    enterposage?: number;
}

// Define the GroupeLigne model
export interface GroupeLigne extends BaseModel {
    groupe?: number | Groupe; // Foreign key to Groupe, can be ID or object
    tc?: number; // Foreign key to Tc, can be ID or object
}

// Define the LignePrestation model
export interface LignePrestation extends BaseModel {
    proforma?: number | Proforma; // Foreign key to Proforma, can be ID or object
    groupe?: number | Groupe; // Foreign key to Groupe, can be ID or object
    rubrique?: string;
    rubrique_object?: number; // Foreign key to Rubrique, can be ID or object
    tcs?: number;
    quantite?: number;
    tarif?: number;
    HT?: number;
    TVA?: number;
    TTC?: number;
    code_comptable?: string;
}

// Define the LignePrestationArticle model
export interface LignePrestationArticle extends BaseModel {
    proforma?: number | Proforma; // Foreign key to Proforma, can be ID or object
    rubrique?: string;
    tarif?: number;
    HT?: number;
    TVA?: number;
    TTC?: number;
    rubrique_object?: number; // Foreign key to Rubrique, can be ID or object
    code_comptable?: string;
}

// Define the BonCommande model
export interface BonCommande extends BaseModel {
    numero?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    article?: number | Article; // Foreign key to Article, can be ID or object
}

// Define the Commande model
export interface Commande extends BaseModel {
    bon_commande?: number | BonCommande; // Foreign key to BonCommande, can be ID or object
    tc?: number; // Foreign key to Tc, can be ID or object
    type?: 'Clarck Intégral' | 'Clarck Partiel' | 'Manutentions humaines Intégral' | 'Manutentions humaines Partiel';
    quantite?: number;
    observation?: string;
    rubrique_ob?: string;
}

// Define the Facture model
export interface Facture extends BaseModel {
    numero?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    proforma?: Proforma | number; // Foreign key to Proforma, can be ID or object
    HT?: number;
    TVA?: number;
    TTC?: number;
    TR?: number;
    DEBEUR?: number;
    timber?: number;
    paid?: boolean;
    a_terme?: boolean;
    paiements?:any[]
}

// Define the Paiement model
export interface Paiement extends BaseModel {
    facture?: number | Facture; // Foreign key to Facture, can be ID or object
    date?: string; // Date in YYYY-MM-DD format
    banque?: number; // Foreign key to Banque, can be ID or object
    mode?: 'Chèque' | 'Espèce';
    cheque?: string;
    montant?: any;
}

// Define the FactureComplementaire model
export interface FactureComplementaire extends BaseModel {
    facture?: number | Facture; // Foreign key to Facture, can be ID or object
    numero?: string;
    full_number?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    HT?: number;
    tva: boolean;
    TVA?: number;
    TTC?: number;
    timber?: number;
    paid?: boolean;
}

// Define the LigneFactureComplementaire model
export interface LigneFactureComplementaire extends BaseModel {
    facture_complementaire?: number | FactureComplementaire; // Foreign key to FactureComplementaire, can be ID or object
    rubrique?: string;
    date?: string; // Date in YYYY-MM-DD format
    tarif?: number;
    quantite?: number;
    HT?: number;
    TVA?: number;
    TTC?: number;
}

// Define the PaiementFactureComplementaire model
export interface PaiementFactureComplementaire extends BaseModel {
    facture_complementaire?: number | FactureComplementaire; // Foreign key to FactureComplementaire, can be ID or object
    date?: string; // Date in YYYY-MM-DD format
    banque?: number; // Foreign key to Banque, can be ID or object
    mode?: 'Chèque' | 'Espèce';
    cheque?: string;
    montant?: number;
}

// Define the FactureAvoire model
export interface FactureAvoire extends BaseModel {
    facture?: number | Facture; // Foreign key to Facture, can be ID or object
    numero?: string;
    full_number?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    HT?: number;
    tva?: boolean;
    TVA?: number;
    TTC?: number;
}

// Define the LigneFactureAvoire model
export interface LigneFactureAvoire extends BaseModel {
    facture_avoire?: number | FactureAvoire; // Foreign key to FactureAvoire, can be ID or object
    rubrique?: string;
    date?: string; // Date in YYYY-MM-DD format
    tarif?: number;
    quantite?: number;
    HT?: number;
    TVA?: number;
    TTC?: number;
}

// Define the BonSortie model
export interface BonSortie extends BaseModel {
    numero?: string;
    date_sortie?: string; // Date in YYYY-MM-DD format
    date_creation?: string; // Date in YYYY-MM-DD format
    facture?: number | Facture; // Foreign key to Facture, can be ID or object
    d10?: string;
    badge?: string;
    bon_sortie_items?:BonSortieItem[];
}

// Define the BonSortieItem model
export interface BonSortieItem extends BaseModel {
    bon_sortie?: number | BonSortie; // Foreign key to BonSortie, can be ID or object
    tc?: number; // Foreign key to Tc, can be ID or object
    matricule?: string;
}

// Define the FactureLibre model
export interface FactureLibre extends BaseModel {
    numero?: string;
    client?: number; // Foreign key to Client, can be ID or object
    date_creation?: string; // Date in YYYY-MM-DD format
    date_facture?: string; // Date in YYYY-MM-DD format
    type_dossier?: string;
    ref?: string;
    date?: string; // Date in YYYY-MM-DD format
    designation?: string;
    HT?: number;
    tva?: boolean;
    TVA?: number;
    TTC?: number;
    timber?: number;
    remise?: boolean;
    REMISE?: number;
    TR?: number;
    paid?: boolean;
}

// Define the LigneFactureLibre model
export interface LigneFactureLibre extends BaseModel {
    facture_libre?: number | FactureLibre; // Foreign key to FactureLibre, can be ID or object
    rubrique?: number; // Foreign key to Rubrique, can be ID or object
    tarif?: number;
    quantite?: number;
    HT?: number;
    TVA?: number;
    TTC?: number;
}

// Define the PaiementFactureLibre model
export interface PaiementFactureLibre extends BaseModel {
    facture_libre?: number | FactureLibre; // Foreign key to FactureLibre, can be ID or object
    date?: string; // Date in YYYY-MM-DD format
    banque?: number; // Foreign key to Banque, can be ID or object
    mode?: 'Chèque' | 'Espèce';
    cheque?: string;
    montant?: number;
}

// Define the ProformaGroupage model
export interface ProformaGroupage extends BaseModel {
    gros?: number | Gros; // Foreign key to Gros, can be ID or object
    article?: number | Article; // Foreign key to Article, can be ID or object
    sous_article?: number | SousArticle; // Foreign key to SousArticle, can be ID or object
    numero?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    date_proforma?: string; // Date in YYYY-MM-DD format
    HT?: number;
    TVA?: number;
    TTC?: number;
    debeur: boolean;
    DEBEUR?: number;
    tva?: boolean;
    remise?: boolean;
    REMISE?: number;
    TR?: number;
    valide?: boolean;
    trashed?: boolean;
    enterposage?: number;
}

// Define the LigneProformaGroupage model
export interface LigneProformaGroupage extends BaseModel {
    proforma?: number | ProformaGroupage; // Foreign key to ProformaGroupage, can be ID or object
    rubrique?: string;
    quantite?: number;
    tarif?: number;
    HT?: number;
    TVA?: number;
    TTC?: number;
    rubrique_object?: number; // Foreign key to Rubrique, can be ID or object
    code_comptable?: string;
}

// Define the FactureGroupage model
export interface FactureGroupage extends BaseModel {
    proforma?: number | ProformaGroupage; // Foreign key to ProformaGroupage, can be ID or object
    numero?: string;
    date_creation?: string; // Date in YYYY-MM-DD format
    HT?: number;
    TVA?: number;
    TTC?: number;
    TR?: number;
    DEBEUR?: number;
    timber?: number;
    paid?: boolean;
    a_terme?: boolean;
    paiementsgroupage?:any
}

// Define the PaiementGroupage model
export interface PaiementGroupage extends BaseModel {
    facture?: number | FactureGroupage; // Foreign key to FactureGroupage, can be ID or object
    date?: string; // Date in YYYY-MM-DD format
    banque?: number; // Foreign key to Banque, can be ID or object
    mode?: 'Chèque' | 'Espèce';
    cheque?: string;
    montant?: number;
}

// Define the BonSortieGroupage model
export interface BonSortieGroupage extends BaseModel {
    numero?: string;
    date_sortie?: string; // Date in YYYY-MM-DD format
    sous_article?: number | SousArticle; // Foreign key to SousArticle, can be ID or object
    date_creation?: string; // Date in YYYY-MM-DD format
    facture?: number | FactureGroupage; // Foreign key to FactureGroupage, can be ID or object
    d10?: string;
    badge?: string;
    matricule?: string;
}
