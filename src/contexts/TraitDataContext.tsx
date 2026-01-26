import { createContext, useContext, useMemo } from 'react';
import { traitData } from '../data/traitData';
import type { TraitArea } from '../data/traitData';
import { getMergedTraitData } from '../utils/traitMerger';
import type { MergedTraitArea } from '../utils/traitMerger';
import { useCustomTraits } from '../hooks/useCustomTraits';
import type { CustomTraitsStorage, CustomTrait } from '../types';

interface TraitDataContextValue {
  // Merged trait data (default + custom)
  mergedTraitData: MergedTraitArea[];
  // Raw custom traits storage
  customTraitsData: CustomTraitsStorage | null;
  // Whether data has loaded from localStorage
  isLoaded: boolean;
  // Default trait data (unmodified)
  defaultTraitData: TraitArea[];
  // Save custom traits (replaces entire storage)
  saveCustomTraits: (data: CustomTraitsStorage) => void;
  // Add a new custom area
  addCustomArea: (areaName: string, groupName: string) => void;
  // Add a custom group to an existing area
  addCustomGroup: (areaName: string, groupName: string) => void;
  // Add a custom trait to an existing group
  addCustomTrait: (
    areaName: string,
    groupName: string,
    trait: Omit<CustomTrait, 'isCustom' | 'createdAt' | 'updatedAt'>
  ) => void;
  // Add a trait to a custom area's group
  addTraitToCustomArea: (
    areaName: string,
    groupName: string,
    trait: Omit<CustomTrait, 'isCustom' | 'createdAt' | 'updatedAt'>
  ) => void;
  // Update a custom trait
  updateCustomTrait: (
    areaName: string,
    groupName: string,
    traitField: string,
    updates: Partial<Omit<CustomTrait, 'isCustom' | 'createdAt'>>
  ) => void;
  // Delete a custom trait
  deleteCustomTrait: (areaName: string, groupName: string, traitField: string) => void;
  // Delete a custom group
  deleteCustomGroup: (areaName: string, groupName: string) => void;
  // Delete a custom area
  deleteCustomArea: (areaName: string) => void;
}

const TraitDataContext = createContext<TraitDataContextValue | null>(null);

interface TraitDataProviderProps {
  children: React.ReactNode;
}

export function TraitDataProvider({ children }: TraitDataProviderProps) {
  const {
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
  } = useCustomTraits();

  // Memoize merged trait data to avoid recalculating on every render
  const mergedTraitData = useMemo(
    () => getMergedTraitData(customTraitsData),
    [customTraitsData]
  );

  const value: TraitDataContextValue = {
    mergedTraitData,
    customTraitsData,
    isLoaded,
    defaultTraitData: traitData,
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

  return (
    <TraitDataContext.Provider value={value}>
      {children}
    </TraitDataContext.Provider>
  );
}

export function useTraitData() {
  const context = useContext(TraitDataContext);
  if (!context) {
    throw new Error('useTraitData must be used within a TraitDataProvider');
  }
  return context;
}

// Export the context for testing or advanced usage
export { TraitDataContext };
