import { useState, useEffect, useCallback } from 'react';
import type { CustomTraitsStorage } from '../types';

const STORAGE_KEY = 'daylily_custom_traits';
const CURRENT_VERSION = 1;

const getEmptyStorage = (): CustomTraitsStorage => ({
  version: CURRENT_VERSION,
  customAreas: [],
  customGroups: {},
  customTraits: {}
});

export function useCustomTraits() {
  const [customTraitsData, setCustomTraitsData] = useState<CustomTraitsStorage | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CustomTraitsStorage;
        // Handle future version migrations here if needed
        if (parsed.version !== CURRENT_VERSION) {
          // For now, just update version - add migration logic as needed
          parsed.version = CURRENT_VERSION;
        }
        setCustomTraitsData(parsed);
      } else {
        setCustomTraitsData(getEmptyStorage());
      }
    } catch (error) {
      console.error('Failed to load custom traits from localStorage:', error);
      setCustomTraitsData(getEmptyStorage());
    }
    setIsLoaded(true);
  }, []);

  // Persist to localStorage
  const saveCustomTraits = useCallback((data: CustomTraitsStorage) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setCustomTraitsData(data);
    } catch (error) {
      console.error('Failed to save custom traits to localStorage:', error);
    }
  }, []);

  // Add a custom area
  const addCustomArea = useCallback((areaName: string, groupName: string) => {
    if (!customTraitsData) return;

    const newArea = {
      name: areaName,
      groups: [{
        name: groupName,
        traits: [],
        isCustom: true as const
      }],
      isCustom: true as const
    };

    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customAreas: [...customTraitsData.customAreas, newArea]
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Add a custom group to an existing area
  const addCustomGroup = useCallback((areaName: string, groupName: string) => {
    if (!customTraitsData) return;

    const newGroup = {
      name: groupName,
      traits: [],
      isCustom: true as const
    };

    const existingGroups = customTraitsData.customGroups[areaName] || [];

    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customGroups: {
        ...customTraitsData.customGroups,
        [areaName]: [...existingGroups, newGroup]
      }
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Add a custom trait
  const addCustomTrait = useCallback((
    areaName: string,
    groupName: string,
    trait: Omit<import('../types').CustomTrait, 'isCustom' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!customTraitsData) return;

    const key = `${areaName}::${groupName}`;
    const now = new Date().toISOString();

    const newTrait = {
      ...trait,
      isCustom: true as const,
      createdAt: now,
      updatedAt: now
    };

    const existingTraits = customTraitsData.customTraits[key] || [];

    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customTraits: {
        ...customTraitsData.customTraits,
        [key]: [...existingTraits, newTrait]
      }
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Add a trait to a custom area's group
  const addTraitToCustomArea = useCallback((
    areaName: string,
    groupName: string,
    trait: Omit<import('../types').CustomTrait, 'isCustom' | 'createdAt' | 'updatedAt'>
  ) => {
    if (!customTraitsData) return;

    const now = new Date().toISOString();
    const newTrait = {
      ...trait,
      isCustom: true as const,
      createdAt: now,
      updatedAt: now
    };

    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customAreas: customTraitsData.customAreas.map(area => {
        if (area.name === areaName) {
          return {
            ...area,
            groups: area.groups.map(group => {
              if (group.name === groupName) {
                return {
                  ...group,
                  traits: [...group.traits, newTrait]
                };
              }
              return group;
            })
          };
        }
        return area;
      })
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Update a custom trait
  const updateCustomTrait = useCallback((
    areaName: string,
    groupName: string,
    traitField: string,
    updates: Partial<Omit<import('../types').CustomTrait, 'isCustom' | 'createdAt'>>
  ) => {
    if (!customTraitsData) return;

    const key = `${areaName}::${groupName}`;
    const now = new Date().toISOString();

    // Check if it's in customTraits
    if (customTraitsData.customTraits[key]) {
      const updated: CustomTraitsStorage = {
        ...customTraitsData,
        customTraits: {
          ...customTraitsData.customTraits,
          [key]: customTraitsData.customTraits[key].map(trait =>
            trait.field === traitField
              ? { ...trait, ...updates, updatedAt: now }
              : trait
          )
        }
      };
      saveCustomTraits(updated);
      return;
    }

    // Check if it's in a custom area
    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customAreas: customTraitsData.customAreas.map(area => {
        if (area.name === areaName) {
          return {
            ...area,
            groups: area.groups.map(group => {
              if (group.name === groupName) {
                return {
                  ...group,
                  traits: group.traits.map(trait =>
                    trait.field === traitField
                      ? { ...trait, ...updates, updatedAt: now }
                      : trait
                  )
                };
              }
              return group;
            })
          };
        }
        return area;
      })
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Delete a custom trait
  const deleteCustomTrait = useCallback((
    areaName: string,
    groupName: string,
    traitField: string
  ) => {
    if (!customTraitsData) return;

    const key = `${areaName}::${groupName}`;

    // Check if it's in customTraits
    if (customTraitsData.customTraits[key]) {
      const filteredTraits = customTraitsData.customTraits[key].filter(
        trait => trait.field !== traitField
      );

      const updated: CustomTraitsStorage = {
        ...customTraitsData,
        customTraits: {
          ...customTraitsData.customTraits,
          [key]: filteredTraits
        }
      };

      // Clean up empty entries
      if (filteredTraits.length === 0) {
        delete updated.customTraits[key];
      }

      saveCustomTraits(updated);
      return;
    }

    // Check if it's in a custom area
    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customAreas: customTraitsData.customAreas.map(area => {
        if (area.name === areaName) {
          return {
            ...area,
            groups: area.groups.map(group => {
              if (group.name === groupName) {
                return {
                  ...group,
                  traits: group.traits.filter(trait => trait.field !== traitField)
                };
              }
              return group;
            })
          };
        }
        return area;
      })
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Delete a custom group
  const deleteCustomGroup = useCallback((areaName: string, groupName: string) => {
    if (!customTraitsData) return;

    // Remove from customGroups
    const updatedCustomGroups = { ...customTraitsData.customGroups };
    if (updatedCustomGroups[areaName]) {
      updatedCustomGroups[areaName] = updatedCustomGroups[areaName].filter(
        group => group.name !== groupName
      );
      if (updatedCustomGroups[areaName].length === 0) {
        delete updatedCustomGroups[areaName];
      }
    }

    // Remove any traits associated with this group
    const key = `${areaName}::${groupName}`;
    const updatedCustomTraits = { ...customTraitsData.customTraits };
    delete updatedCustomTraits[key];

    // Also check custom areas
    const updatedCustomAreas = customTraitsData.customAreas.map(area => {
      if (area.name === areaName) {
        return {
          ...area,
          groups: area.groups.filter(group => group.name !== groupName)
        };
      }
      return area;
    });

    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customAreas: updatedCustomAreas,
      customGroups: updatedCustomGroups,
      customTraits: updatedCustomTraits
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  // Delete a custom area
  const deleteCustomArea = useCallback((areaName: string) => {
    if (!customTraitsData) return;

    // Remove all associated traits
    const updatedCustomTraits = { ...customTraitsData.customTraits };
    Object.keys(updatedCustomTraits).forEach(key => {
      if (key.startsWith(`${areaName}::`)) {
        delete updatedCustomTraits[key];
      }
    });

    // Remove all associated groups
    const updatedCustomGroups = { ...customTraitsData.customGroups };
    delete updatedCustomGroups[areaName];

    // Remove the area
    const updatedCustomAreas = customTraitsData.customAreas.filter(
      area => area.name !== areaName
    );

    const updated: CustomTraitsStorage = {
      ...customTraitsData,
      customAreas: updatedCustomAreas,
      customGroups: updatedCustomGroups,
      customTraits: updatedCustomTraits
    };

    saveCustomTraits(updated);
  }, [customTraitsData, saveCustomTraits]);

  return {
    customTraitsData,
    isLoaded,
    saveCustomTraits,
    addCustomArea,
    addCustomGroup,
    addCustomTrait,
    addTraitToCustomArea,
    updateCustomTrait,
    deleteCustomTrait,
    deleteCustomGroup,
    deleteCustomArea
  };
}
