export type Page =
  | 'home'
  | 'trait-fields'
  | 'observation-cycles'
  | 'summary-fields'
  | 'inventory'
  | 'plant-detail'
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
  | 'trait-observation'
  | 'observation-history'
  | 'custom-trait-list'
  | 'add-custom-trait'
  | 'edit-custom-trait';

export type PlantType = 'variety' | 'seedling' | 'seedling-group';

export interface PlantDetailContext {
  plantType: PlantType;
  plantId: string;
}

// Default summary fields based on AHS database + rust resistance
export const DEFAULT_SUMMARY_FIELDS = [
  'name',
  'hybridizer',
  'year',
  'scape_height',
  'bloom_size',
  'bloom_season',
  'ploidy',
  'foliage_type',
  'bloom_habit',
  'bud_count',
  'branches',
  'color_description',
  'parentage',
  'form',
  'awards',
  'sculpting',
  'rebloom',
  'rust_resistance'
];

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

// Custom Trait Types
export interface CustomTrait {
  field: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'rating' | 'boolean';
  options?: string[];
  defaultTiming?: {
    year?: number;
    season?: string;
    month?: string;
    weeks?: string[];
    excludeFromAutomaticCycle?: boolean;
  };
  isCustom: true;
  createdAt: string;
  updatedAt: string;
}

export interface CustomTraitGroup {
  name: string;
  traits: CustomTrait[];
  isCustom: true;
}

export interface CustomTraitArea {
  name: string;
  groups: CustomTraitGroup[];
  isCustom: true;
}

export interface CustomTraitsStorage {
  version: number;
  customAreas: CustomTraitArea[];
  customGroups: Record<string, CustomTraitGroup[]>;
  customTraits: Record<string, CustomTrait[]>;
}
