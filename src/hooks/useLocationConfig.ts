import { useState, useEffect, useCallback } from 'react';
import type { LocationConfig, LocationLevel, LocationLevelKey, PlantLocation } from '../types';
import { DEFAULT_LOCATION_CONFIG } from '../types';

const STORAGE_KEY = 'daylily_location_config';

export function useLocationConfig() {
  const [config, setConfig] = useState<LocationConfig>(DEFAULT_LOCATION_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as LocationConfig;
        setConfig(parsed);
      }
    } catch (error) {
      console.error('Failed to load location config:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  const saveConfig = useCallback((newConfig: LocationConfig) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
      setConfig(newConfig);
    } catch (error) {
      console.error('Failed to save location config:', error);
    }
  }, []);

  // Update a specific level
  const updateLevel = useCallback((key: LocationLevelKey, updates: Partial<LocationLevel>) => {
    const newConfig = {
      ...config,
      levels: config.levels.map(level =>
        level.key === key ? { ...level, ...updates } : level
      ),
    };
    saveConfig(newConfig);
  }, [config, saveConfig]);

  // Toggle level enabled/disabled
  const toggleLevel = useCallback((key: LocationLevelKey) => {
    const level = config.levels.find(l => l.key === key);
    if (level) {
      updateLevel(key, { enabled: !level.enabled });
    }
  }, [config.levels, updateLevel]);

  // Update level label (custom name)
  const updateLabel = useCallback((key: LocationLevelKey, label: string) => {
    updateLevel(key, { label });
  }, [updateLevel]);

  // Add a value to a level
  const addValue = useCallback((key: LocationLevelKey, value: string) => {
    const level = config.levels.find(l => l.key === key);
    if (level && value.trim() && !level.values.includes(value.trim())) {
      updateLevel(key, { values: [...level.values, value.trim()] });
    }
  }, [config.levels, updateLevel]);

  // Remove a value from a level
  const removeValue = useCallback((key: LocationLevelKey, value: string) => {
    const level = config.levels.find(l => l.key === key);
    if (level) {
      updateLevel(key, { values: level.values.filter(v => v !== value) });
    }
  }, [config.levels, updateLevel]);

  // Rename a value at a level
  const renameValue = useCallback((key: LocationLevelKey, oldValue: string, newValue: string) => {
    const level = config.levels.find(l => l.key === key);
    if (level && newValue.trim()) {
      updateLevel(key, {
        values: level.values.map(v => v === oldValue ? newValue.trim() : v)
      });
    }
  }, [config.levels, updateLevel]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    saveConfig(DEFAULT_LOCATION_CONFIG);
  }, [saveConfig]);

  // Get enabled levels only
  const getEnabledLevels = useCallback(() => {
    return config.levels.filter(level => level.enabled);
  }, [config.levels]);

  // Format a location object into a display string
  const formatLocation = useCallback((location: PlantLocation) => {
    const parts: string[] = [];
    config.levels.forEach(level => {
      const value = location[level.key as keyof PlantLocation];
      if (level.enabled && value) {
        parts.push(`${level.label}: ${value}`);
      }
    });
    return parts.join(' > ');
  }, [config.levels]);

  // Format a location object into a short string (values only)
  const formatLocationShort = useCallback((location: PlantLocation) => {
    const parts: string[] = [];
    config.levels.forEach(level => {
      const value = location[level.key as keyof PlantLocation];
      if (level.enabled && value) {
        parts.push(value);
      }
    });
    return parts.join(' / ');
  }, [config.levels]);

  return {
    config,
    isLoaded,
    saveConfig,
    updateLevel,
    toggleLevel,
    updateLabel,
    addValue,
    removeValue,
    renameValue,
    resetToDefaults,
    getEnabledLevels,
    formatLocation,
    formatLocationShort,
  };
}
