import { traitData } from '../data/traitData';
import type { Trait, TraitGroup, TraitArea } from '../data/traitData';
import type { CustomTraitsStorage, CustomTrait } from '../types';

// Extended types for merged data with isCustom flag
export interface MergedTrait extends Trait {
  isCustom?: boolean;
}

export interface MergedTraitGroup extends Omit<TraitGroup, 'traits'> {
  traits: MergedTrait[];
  isCustom?: boolean;
}

export interface MergedTraitArea extends Omit<TraitArea, 'groups'> {
  groups: MergedTraitGroup[];
  isCustom?: boolean;
}

/**
 * Merges custom traits with default traitData
 * Custom traits/groups/areas are appended after defaults
 */
export function getMergedTraitData(customTraits: CustomTraitsStorage | null): MergedTraitArea[] {
  // Deep clone default traits and mark as not custom
  const merged: MergedTraitArea[] = traitData.map(area => ({
    ...area,
    isCustom: false,
    groups: area.groups.map(group => ({
      ...group,
      isCustom: false,
      traits: group.traits.map(trait => ({ ...trait, isCustom: false }))
    }))
  }));

  if (!customTraits) {
    return merged;
  }

  // Add custom traits to existing groups
  for (const [key, traits] of Object.entries(customTraits.customTraits)) {
    const [areaName, groupName] = key.split('::');
    const area = merged.find(a => a.name === areaName);
    if (area) {
      const group = area.groups.find(g => g.name === groupName);
      if (group) {
        group.traits.push(...traits.map(t => convertCustomTrait(t)));
      }
    }
  }

  // Add custom groups to existing areas
  for (const [areaName, groups] of Object.entries(customTraits.customGroups)) {
    const area = merged.find(a => a.name === areaName);
    if (area) {
      area.groups.push(...groups.map(g => ({
        name: g.name,
        isCustom: true,
        traits: g.traits.map(t => convertCustomTrait(t))
      })));
    }
  }

  // Add entirely new custom areas at the end
  for (const customArea of customTraits.customAreas) {
    merged.push({
      name: customArea.name,
      isCustom: true,
      groups: customArea.groups.map(g => ({
        name: g.name,
        isCustom: true,
        traits: g.traits.map(t => convertCustomTrait(t))
      }))
    });
  }

  return merged;
}

/**
 * Convert CustomTrait to MergedTrait format
 */
function convertCustomTrait(customTrait: CustomTrait): MergedTrait {
  return {
    field: customTrait.field,
    label: customTrait.label,
    type: customTrait.type,
    options: customTrait.options,
    defaultTiming: customTrait.defaultTiming,
    isCustom: true
  };
}

/**
 * Get all trait fields from merged data as a flat array
 */
export function getAllMergedTraitFields(mergedData: MergedTraitArea[]): {
  field: string;
  label: string;
  area: string;
  group: string;
  type?: string;
  isCustom?: boolean;
  isNumeric?: boolean;
}[] {
  const fields: {
    field: string;
    label: string;
    area: string;
    group: string;
    type?: string;
    isCustom?: boolean;
    isNumeric?: boolean;
  }[] = [];

  for (const area of mergedData) {
    for (const group of area.groups) {
      for (const trait of group.traits) {
        fields.push({
          field: trait.field,
          label: trait.label,
          area: area.name,
          group: group.name,
          type: trait.type,
          isCustom: trait.isCustom,
          isNumeric: trait.type === 'number' || trait.type === 'rating'
        });
      }
    }
  }

  return fields;
}

/**
 * Find a trait by field name in merged data
 */
export function findTraitByField(
  mergedData: MergedTraitArea[],
  field: string
): MergedTrait | undefined {
  for (const area of mergedData) {
    for (const group of area.groups) {
      const trait = group.traits.find(t => t.field === field);
      if (trait) return trait;
    }
  }
  return undefined;
}

/**
 * Get trait label by field name
 */
export function getTraitLabel(mergedData: MergedTraitArea[], field: string): string {
  const trait = findTraitByField(mergedData, field);
  if (trait) return trait.label;
  // Fallback to auto-formatting
  return field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Check if a field name is already in use
 */
export function isFieldNameTaken(mergedData: MergedTraitArea[], fieldName: string): boolean {
  return !!findTraitByField(mergedData, fieldName);
}

/**
 * Generate a unique field name from a label
 */
export function generateFieldName(label: string, existingFields: Set<string>): string {
  const base = 'custom_' + label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

  let field = base;
  let counter = 1;

  while (existingFields.has(field)) {
    field = `${base}_${counter}`;
    counter++;
  }

  return field;
}

/**
 * Get all existing field names as a Set
 */
export function getAllFieldNames(mergedData: MergedTraitArea[]): Set<string> {
  const fields = new Set<string>();
  for (const area of mergedData) {
    for (const group of area.groups) {
      for (const trait of group.traits) {
        fields.add(trait.field);
      }
    }
  }
  return fields;
}
