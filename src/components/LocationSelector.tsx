import { useState } from 'react';
import { useLocationConfig } from '../hooks/useLocationConfig';
import type { PlantLocation } from '../types';
import './LocationSelector.css';

interface LocationSelectorProps {
  value: PlantLocation;
  onChange: (location: PlantLocation) => void;
  compact?: boolean;
}

function LocationSelector({ value, onChange, compact = false }: LocationSelectorProps) {
  const { config, addValue, formatLocationShort } = useLocationConfig();
  const [newValueInputs, setNewValueInputs] = useState<Record<string, string>>({});
  const [showNewInput, setShowNewInput] = useState<string | null>(null);

  const enabledLevels = config.levels.filter(level => level.enabled);

  const handleChange = (key: string, newValue: string) => {
    onChange({ ...value, [key]: newValue || undefined });
  };

  const handleAddNew = (key: string) => {
    const newVal = newValueInputs[key];
    if (newVal?.trim()) {
      addValue(key as any, newVal.trim());
      handleChange(key, newVal.trim());
      setNewValueInputs(prev => ({ ...prev, [key]: '' }));
      setShowNewInput(null);
    }
  };

  const locationDisplay = formatLocationShort(value as PlantLocation);

  if (compact) {
    return (
      <div className="location-selector compact">
        <div className="location-display">
          {locationDisplay || 'No location set'}
        </div>
        <div className="location-fields-compact">
          {enabledLevels.map(level => (
            <div key={level.key} className="location-field-compact">
              <label>{level.label}</label>
              <select
                value={value[level.key as keyof PlantLocation] || ''}
                onChange={(e) => handleChange(level.key, e.target.value)}
              >
                <option value="">--</option>
                {level.values.map(val => (
                  <option key={val} value={val}>{val}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="location-selector">
      {enabledLevels.length === 0 ? (
        <div className="no-levels-message">
          No location levels configured. Set up your location structure in Location Setup.
        </div>
      ) : (
        <div className="location-fields">
          {enabledLevels.map(level => (
            <div key={level.key} className="location-field">
              <label className="field-label">{level.label}</label>

              {showNewInput === level.key ? (
                <div className="new-value-input-row">
                  <input
                    type="text"
                    className="new-value-input"
                    placeholder={`New ${level.label.toLowerCase()}...`}
                    value={newValueInputs[level.key] || ''}
                    onChange={(e) => setNewValueInputs(prev => ({ ...prev, [level.key]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddNew(level.key);
                      if (e.key === 'Escape') setShowNewInput(null);
                    }}
                    autoFocus
                  />
                  <button
                    className="confirm-new-btn"
                    onClick={() => handleAddNew(level.key)}
                    disabled={!newValueInputs[level.key]?.trim()}
                  >
                    Add
                  </button>
                  <button
                    className="cancel-new-btn"
                    onClick={() => setShowNewInput(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="select-row">
                  <select
                    className="location-select"
                    value={value[level.key as keyof PlantLocation] || ''}
                    onChange={(e) => handleChange(level.key, e.target.value)}
                  >
                    <option value="">Select {level.label.toLowerCase()}...</option>
                    {level.values.map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                  <button
                    className="add-new-btn"
                    onClick={() => setShowNewInput(level.key)}
                    title={`Add new ${level.label.toLowerCase()}`}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {locationDisplay && (
        <div className="location-preview">
          <span className="preview-label">Location:</span>
          <span className="preview-value">{locationDisplay}</span>
        </div>
      )}
    </div>
  );
}

export default LocationSelector;
