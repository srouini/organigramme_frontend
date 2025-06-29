import {BaseModel} from "./commun"
import {Gros,Article,SousArticle} from "./data"
import {Box,Transitaire} from "./reference"

export interface VisiteGroupage extends BaseModel {
    numero?: string;
    date_creation?: string;  // ISO date string
    date_visite?: string;    // ISO date string
    gros?: number | Gros;    // Foreign key to Gros, can be an ID or the actual object
    article?: number | Article;  // Optional, can be ID or object
    sous_article?: number | SousArticle;  // Optional, can be ID or object
    type_visite?: string;   // Should match the choices defined in Django
    transitaire?: number | Transitaire;  // Foreign key to Transitaire, can be ID or object
    badge?: string;
}

export interface PositionGroupage extends BaseModel {
    sous_article?: number | SousArticle;  // Foreign key to SousArticle, can be ID or object
    date?: string;  // ISO date string
    box?: number | Box;  // Foreign key to Box, can be ID or object
}