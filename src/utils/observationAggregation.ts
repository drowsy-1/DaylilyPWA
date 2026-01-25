import type { TraitObservation, MockVariety } from '../data/mockInventory';
import defaultDaylilyImage from '../assets/default-daylily.svg';

export interface AggregatedObservation {
  traitField: string;
  label?: string;
  currentValue: any;
  valueType: 'mean' | 'mode' | 'latest' | 'single';
  observations: TraitObservation[];
  range?: { min: number; max: number };
  valueCount?: Record<string, number>;
  hasConflicts: boolean;
}

export interface GroupedObservations {
  area: string;
  traits: AggregatedObservation[];
  observedCount: number;
}

/**
 * Calculate the mean of numeric values
 */
export function getMeanValue(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10; // Round to 1 decimal
}

/**
 * Get the mode (most common) value from an array
 */
export function getModeValue<T>(values: T[]): T | undefined {
  if (values.length === 0) return undefined;

  const counts = new Map<T, number>();
  let maxCount = 0;
  let mode: T | undefined;

  for (const value of values) {
    const count = (counts.get(value) || 0) + 1;
    counts.set(value, count);
    if (count > maxCount) {
      maxCount = count;
      mode = value;
    }
  }

  return mode;
}

/**
 * Get the min/max range from numeric values
 */
export function getValueRange(values: number[]): { min: number; max: number } | undefined {
  if (values.length === 0) return undefined;
  return {
    min: Math.min(...values),
    max: Math.max(...values)
  };
}

/**
 * Count occurrences of each value
 */
export function getValueCounts(values: any[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const value of values) {
    const key = String(value);
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

/**
 * Sort observations by date (newest first)
 */
export function sortObservationsByDate(observations: TraitObservation[]): TraitObservation[] {
  return [...observations].sort((a, b) =>
    new Date(b.observationDate).getTime() - new Date(a.observationDate).getTime()
  );
}

/**
 * Check if a value is numeric
 */
function isNumeric(value: any): boolean {
  return typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)));
}

/**
 * Aggregate observations for a single trait
 */
export function aggregateTraitObservations(
  traitField: string,
  observations: TraitObservation[]
): AggregatedObservation {
  const sorted = sortObservationsByDate(observations);
  const values = observations.map(o => o.value).filter(v => v !== null && v !== undefined);

  // Determine if values are numeric
  const numericValues = values.filter(isNumeric).map(Number);
  const isAllNumeric = numericValues.length === values.length && values.length > 0;

  let currentValue: any;
  let valueType: AggregatedObservation['valueType'];
  let range: { min: number; max: number } | undefined;
  let valueCount: Record<string, number> | undefined;

  if (observations.length === 1) {
    currentValue = observations[0].value;
    valueType = 'single';
  } else if (isAllNumeric) {
    currentValue = getMeanValue(numericValues);
    valueType = 'mean';
    range = getValueRange(numericValues);
  } else {
    currentValue = getModeValue(values);
    valueType = 'mode';
    valueCount = getValueCounts(values);
  }

  // Check for conflicts (different values)
  const uniqueValues = new Set(values.map(String));
  const hasConflicts = uniqueValues.size > 1;

  return {
    traitField,
    currentValue,
    valueType,
    observations: sorted,
    range,
    valueCount,
    hasConflicts
  };
}

/**
 * Extract all trait observations from a plant (from observationData, cycles, and individual observations)
 */
export function extractAllObservations(plant: MockVariety): Map<string, TraitObservation[]> {
  const observationMap = new Map<string, TraitObservation[]>();

  // Helper to add observation
  const addObservation = (traitField: string, obs: TraitObservation) => {
    if (!observationMap.has(traitField)) {
      observationMap.set(traitField, []);
    }
    observationMap.get(traitField)!.push(obs);
  };

  // Add individual trait observations
  for (const obs of plant.individualTraitObservations) {
    addObservation(obs.traitField, obs);
  }

  // Add observations from observation cycles
  for (const cycle of plant.observationCycles) {
    for (const [field, value] of Object.entries(cycle.observations)) {
      addObservation(field, {
        traitField: field,
        value,
        observationDate: cycle.startDate,
        notes: `From ${cycle.cycleName}`,
        excludeFromAutomaticCycle: false
      });
    }
  }

  // Add base observation data (static/registered values) as a single observation
  // Use a past date to indicate these are "original" values
  const baseDate = plant.acquisitionDate || '2000-01-01';
  for (const [field, value] of Object.entries(plant.observationData)) {
    if (value !== null && value !== undefined) {
      // Only add if we don't already have observations for this field
      // OR if this is a registered/static value that should be included
      if (!observationMap.has(field)) {
        addObservation(field, {
          traitField: field,
          value,
          observationDate: baseDate,
          notes: 'Registered/Base value',
          excludeFromAutomaticCycle: true
        });
      }
    }
  }

  return observationMap;
}

/**
 * Group aggregated observations by trait area
 */
export function groupObservationsByArea(
  observationMap: Map<string, TraitObservation[]>,
  traitData: any[]
): GroupedObservations[] {
  const groups: GroupedObservations[] = [];
  const assignedFields = new Set<string>();

  // Build area mapping from trait data
  for (const area of traitData) {
    const areaTraits: AggregatedObservation[] = [];

    for (const group of area.groups) {
      for (const trait of group.traits) {
        if (observationMap.has(trait.field)) {
          const observations = observationMap.get(trait.field)!;
          const aggregated = aggregateTraitObservations(trait.field, observations);
          aggregated.label = trait.label;
          areaTraits.push(aggregated);
          assignedFields.add(trait.field);
        }
      }
    }

    if (areaTraits.length > 0) {
      groups.push({
        area: area.name,
        traits: areaTraits,
        observedCount: areaTraits.length
      });
    }
  }

  // Add any unassigned fields to "Other" category
  const otherTraits: AggregatedObservation[] = [];
  for (const [field, observations] of observationMap) {
    if (!assignedFields.has(field)) {
      const aggregated = aggregateTraitObservations(field, observations);
      aggregated.label = field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      otherTraits.push(aggregated);
    }
  }

  if (otherTraits.length > 0) {
    groups.push({
      area: 'Other Observations',
      traits: otherTraits,
      observedCount: otherTraits.length
    });
  }

  return groups;
}

/**
 * Get all images from a plant (from cycles, observations, and any other sources)
 */
export interface PlantImage {
  url: string;
  source: 'cycle' | 'observation' | 'note' | 'base' | 'default';
  sourceId?: string;
  sourceName?: string;
  date?: string;
  traitField?: string;
  isDefault?: boolean; // True for placeholder images - not downloadable/publishable
}

export function extractAllImages(plant: MockVariety): PlantImage[] {
  const images: PlantImage[] = [];

  // Extract from observation cycles
  for (const cycle of plant.observationCycles) {
    for (const photo of cycle.photos) {
      images.push({
        url: photo,
        source: 'cycle',
        sourceId: `${cycle.year}-${cycle.cycleName}`,
        sourceName: cycle.cycleName,
        date: cycle.startDate
      });
    }
  }

  // Extract from individual trait observations
  for (const obs of plant.individualTraitObservations) {
    if (obs.photos) {
      for (const photo of obs.photos) {
        images.push({
          url: photo,
          source: 'observation',
          sourceId: `${obs.traitField}-${obs.observationDate}`,
          sourceName: obs.traitField.replace(/_/g, ' '),
          date: obs.observationDate,
          traitField: obs.traitField
        });
      }
    }
  }

  // Always add the default image at the end
  // This serves as a placeholder and appears last in the gallery
  images.push({
    url: defaultDaylilyImage,
    source: 'default',
    sourceName: 'Default Placeholder',
    isDefault: true
  });

  return images;
}

/**
 * Get a summary value for a specific field from a plant
 */
export function getSummaryValue(plant: MockVariety, field: string): any {
  // First check direct properties
  const directMapping: Record<string, keyof MockVariety> = {
    name: 'name',
    hybridizer: 'hybridizer',
    year: 'year',
    scape_height: 'scapeHeight',
    bloom_size: 'bloomSize',
    bloom_season: 'bloomSeason',
    ploidy: 'ploidy',
    foliage_type: 'foliageType',
    bloom_habit: 'bloomHabit',
    bud_count: 'budCount',
    branches: 'branches',
    color_description: 'colorDescription',
    parentage: 'parentage',
    form: 'form',
    awards: 'awards',
    rebloom: 'rebloom'
  };

  if (directMapping[field] && plant[directMapping[field]] !== undefined) {
    return plant[directMapping[field]];
  }

  // Check observation data
  if (plant.observationData[field] !== undefined) {
    return plant.observationData[field];
  }

  // Check for aggregated observation value
  const observations = extractAllObservations(plant);
  if (observations.has(field)) {
    const aggregated = aggregateTraitObservations(field, observations.get(field)!);
    return aggregated.currentValue;
  }

  return null;
}

/**
 * Format a value for display
 */
export function formatDisplayValue(value: any, field?: string): string {
  if (value === null || value === undefined) {
    return '—';
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (typeof value === 'number') {
    // Add units based on field name
    if (field?.includes('height') || field?.includes('size')) {
      return `${value}"`;
    }
    return String(value);
  }

  return String(value);
}
