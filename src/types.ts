export type Page =
  | 'home'
  | 'trait-fields'
  | 'observation-cycles'
  | 'inventory'
  | 'crosses'
  | 'assigned-crosses'
  | 'add-note'
  | 'add-plant'
  | 'add-variety'
  | 'add-seedling'
  | 'add-seedling-group'
  | 'continue-variety'
  | 'continue-seedling'
  | 'continue-seedling-group'
  | 'trait-observation';

export type ParentType = 'inventory' | 'seedling' | 'unknown' | 'manual';

export interface CrossData {
  id: string;
  crossNumber: number;
  podParent: string;
  pollenParent: string;
  podParentType: ParentType;
  pollenParentType: ParentType;
  dateCreated: string;
  lastUsed?: string;
  notes?: string;
}

export interface CrossAssignment {
  id: string;
  crossId: string;
  year: number;
  crossCount: number;
  dateAssigned: string;
  dateCompleted?: string;
  completed: boolean;
}
