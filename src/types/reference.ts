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

  export interface StructureType extends BaseModel {
    name?: string;
    color?: string;
  }

  export interface Structure extends BaseModel {
    name?: string;
    state?: string;
    parent?: Structure | number | null;
    children?: Structure[];
    positions?: Position[];
    edges?: StructureEdge[];
    manager?: Position;
    diagram_positions?: DiagramPosition[];
    type?:StructureType ;
  }

  export interface DiagramPosition extends BaseModel {
    content_type: 'position' | 'structure';
    object_id: number;
    main_structure: number;
    position_x: number;
    position_y: number;
  }

  export interface Position extends BaseModel {
    structure: Structure | number;
    title: string;
    grade: Grade; // Foreign key to Grade, can be ID or object
    formation?: string;
    quantity?: number;
    mission_principal?: string;
    experience?: string;
    abbreviation?: string;
    category?: string;
    position_x?: number;
    position_y?: number;
    initial_node?: boolean;
    parent?: Position;
    diagram_positions?: DiagramPosition[];
  }


  export interface PositionType extends BaseModel {
    structure: Structure | number;
    title: string;
    grade: Grade; // Foreign key to Grade, can be ID or object
    formation?: string;
    quantity?: number;
    mission_principal?: string;
    experience?: string;
    abbreviation?: string;
    category?: string;
    position_x?: number;
    position_y?: number;
    initial_node?: boolean;
    parent?: Position;
    diagram_positions?: DiagramPosition[];
  }

  export interface StructureEdge extends BaseModel {
    structure: number;
    source: GenericNode;
    target: GenericNode;
    edge_type: string;
  }

  export interface GenericNode {
    type: 'structure' | 'position';
    id: number;
    name: string;
    diagram_positions?: DiagramPosition[];
  }

  export interface OrganigramEdge extends BaseModel {
    structure: number;
    source: GenericNode;
    target: GenericNode;
    edge_type: string;
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