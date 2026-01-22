export type Page =
  | 'home'
  | 'trait-fields'
  | 'observation-cycles'
  | 'inventory'
  | 'crosses'
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
  notes?: string;
}
