import { BaseModel } from "./commun";

  export interface User extends BaseModel {
    first_name:string;
    last_name:string;
    full_name:string;
  }


  export interface Grade extends BaseModel {
    name?: string;
    level?: string;
    category?: string;
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
    grade: Grade;  // Foreign key to Grade, can be ID or object
    formation?: string;
    mission_principal?: string;
    experience?: string;
    position_x?: number;
    position_y?: number;
    parent?: Position;
  }

  export interface Task extends BaseModel{
    description?: string;
  }

  export interface Mission extends BaseModel{
    description?: string;
  }

  export interface Competence extends BaseModel{
    description?: string;
  }