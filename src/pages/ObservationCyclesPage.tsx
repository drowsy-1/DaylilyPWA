import { useState } from 'react';
import './ObservationCyclesPage.css';
import { useTraitData } from '../contexts/TraitDataContext';

interface ObservationTiming {
  year?: number;
  season?: string;
  month?: string;
  weeks?: string[];
  excludeFromAutomaticCycle?: boolean;
}

interface TraitObservationConfig {
  [key: string]: ObservationTiming;
}

function ObservationCyclesPage() {
  const { mergedTraitData } = useTraitData();

  // Initialize default timing from mergedTraitData
  const initializeDefaultTiming = (): TraitObservationConfig => {
    const defaultConfigs: TraitObservationConfig = {};

    mergedTraitData.forEach(area => {
      area.groups.forEach(group => {
        group.traits.forEach(trait => {
          if (trait.defaultTiming) {
            const traitKey = `trait-${trait.field}`;
            defaultConfigs[traitKey] = {
              year: trait.defaultTiming.year || 0,
              season: trait.defaultTiming.season,
              month: trait.defaultTiming.month,
              weeks: trait.defaultTiming.weeks,
              excludeFromAutomaticCycle: trait.defaultTiming.excludeFromAutomaticCycle || false
            };
          }
        });
      });
    });

    return defaultConfigs;
  };

  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [traitConfigs, setTraitConfigs] = useState<TraitObservationConfig>(() => initializeDefaultTiming());
  const [showTimeSelector, setShowTimeSelector] = useState<string | null>(null);
  const [hiddenFields, setHiddenFields] = useState<Set<string>>(new Set());
  const [showHiddenFields, setShowHiddenFields] = useState(false);
  const [showHideConfirmation, setShowHideConfirmation] = useState<string | null>(null);

  const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const toggleArea = (areaName: string) => {
    const newExpanded = new Set(expandedAreas);
    if (newExpanded.has(areaName)) {
      newExpanded.delete(areaName);
    } else {
      newExpanded.add(areaName);
    }
    setExpandedAreas(newExpanded);
  };

  const toggleGroup = (groupKey: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupKey)) {
      newExpanded.delete(groupKey);
    } else {
      newExpanded.add(groupKey);
    }
    setExpandedGroups(newExpanded);
  };

  const openTimeSelector = (traitKey: string) => {
    setShowTimeSelector(traitKey);
  };

  const closeTimeSelector = () => {
    setShowTimeSelector(null);
  };

  const updateTraitTiming = (traitKey: string, timing: ObservationTiming) => {
    setTraitConfigs(prev => ({
      ...prev,
      [traitKey]: timing
    }));
    closeTimeSelector();
  };

  const toggleExcludeFromCycle = (traitKey: string) => {
    setTraitConfigs(prev => ({
      ...prev,
      [traitKey]: {
        ...prev[traitKey],
        excludeFromAutomaticCycle: !prev[traitKey]?.excludeFromAutomaticCycle
      }
    }));
  };

  const toggleHideField = (traitKey: string) => {
    setHiddenFields(prev => {
      const newHidden = new Set(prev);
      if (newHidden.has(traitKey)) {
        newHidden.delete(traitKey);
      } else {
        newHidden.add(traitKey);
      }
      return newHidden;
    });
    setShowHideConfirmation(null);
  };

  const showHideConfirmationDialog = (traitKey: string) => {
    setShowHideConfirmation(traitKey);
  };

  const cancelHideConfirmation = () => {
    setShowHideConfirmation(null);
  };

  const resetToDefaultTiming = () => {
    setTraitConfigs(initializeDefaultTiming());
  };

  const getTimingDisplay = (timing?: ObservationTiming, traitField?: string) => {
    if (!timing) {
      // Check if there's a default timing for this trait
      const trait = findTraitByField(traitField);
      if (trait?.defaultTiming) {
        return 'Using default timing';
      }
      return 'Not configured';
    }
    
    let display = `Year ${timing.year || 0}`;
    if (timing.season) display += ` - ${timing.season}`;
    if (timing.month) display += ` - ${timing.month}`;
    if (timing.weeks && timing.weeks.length > 0) {
      display += ` - Week${timing.weeks.length > 1 ? 's' : ''} ${timing.weeks.join(', ')}`;
    }
    if (timing.excludeFromAutomaticCycle) {
      display += ' (Manual Only)';
    }
    return display;
  };

  const findTraitByField = (fieldName?: string) => {
    if (!fieldName) return null;

    for (const area of mergedTraitData) {
      for (const group of area.groups) {
        const trait = group.traits.find(t => t.field === fieldName);
        if (trait) return trait;
      }
    }
    return null;
  };

  return (
    <div className="observation-cycles-page">
      <div className="cycles-header">
        <h1>Observation Cycles</h1>
        <p>Configure when traits can be observed throughout the growing season</p>
      </div>

      <div className="cycles-controls">
        <div className="control-group">
          <label className="toggle-control">
            <input
              type="checkbox"
              checked={showHiddenFields}
              onChange={(e) => setShowHiddenFields(e.target.checked)}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-label">Show Hidden Fields</span>
          </label>
          
          <button 
            className="reset-defaults-btn"
            onClick={resetToDefaultTiming}
            title="Reset all traits to their default observation timing"
          >
            Reset to Defaults
          </button>
        </div>
        
        <div className="control-stats">
          <span className="stat-item">
            Total Traits: {mergedTraitData.reduce((sum, area) => sum + area.groups.reduce((groupSum, group) => groupSum + group.traits.length, 0), 0)}
          </span>
          <span className="stat-item">
            Hidden: {hiddenFields.size}
          </span>
          <span className="stat-item">
            Manual Only: {Object.values(traitConfigs).filter(config => config.excludeFromAutomaticCycle).length}
          </span>
        </div>
      </div>

      <div className="trait-areas">
        {mergedTraitData.map((area) => {
          const isAreaExpanded = expandedAreas.has(area.name);
          
          return (
            <div key={area.name} className="trait-area">
              <button
                className="area-header"
                onClick={() => toggleArea(area.name)}
              >
                <span className="expand-icon">{isAreaExpanded ? '▼' : '▶'}</span>
                <span className="area-name">{area.name}</span>
                <span className="area-count">({area.groups.reduce((sum, g) => sum + g.traits.length, 0)} traits)</span>
                <button 
                  className="timing-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openTimeSelector(`area-${area.name}`);
                  }}
                >
                  Set Timing
                </button>
              </button>

              {isAreaExpanded && (
                <div className="trait-groups">
                  {area.groups.map((group) => {
                    const groupKey = `${area.name}-${group.name}`;
                    const isGroupExpanded = expandedGroups.has(groupKey);

                    return (
                      <div key={groupKey} className="trait-group">
                        <button
                          className="group-header"
                          onClick={() => toggleGroup(groupKey)}
                        >
                          <span className="expand-icon">{isGroupExpanded ? '▼' : '▶'}</span>
                          <span className="group-name">{group.name}</span>
                          <span className="group-count">({group.traits.length})</span>
                          <button 
                            className="timing-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTimeSelector(`group-${groupKey}`);
                            }}
                          >
                            Set Timing
                          </button>
                        </button>

                        {isGroupExpanded && (
                          <div className="trait-list">
                            {group.traits.map((trait) => {
                              const traitKey = `trait-${trait.field}`;
                              const isHidden = hiddenFields.has(traitKey);
                              const config = traitConfigs[traitKey];
                              
                              // Skip hidden fields unless we're showing them
                              if (isHidden && !showHiddenFields) {
                                return null;
                              }
                              
                              return (
                                <div key={trait.field} className={`trait-item ${isHidden ? 'hidden-field' : ''}`}>
                                  <div className="trait-info">
                                    <span className="trait-name">{trait.label}</span>
                                    <span className="trait-timing">
                                      {getTimingDisplay(config, trait.field)}
                                    </span>
                                  </div>
                                  
                                  <div className="trait-controls">
                                    <button 
                                      className="timing-btn small"
                                      onClick={() => openTimeSelector(traitKey)}
                                    >
                                      Configure
                                    </button>
                                    
                                    <label className="mini-toggle">
                                      <input
                                        type="checkbox"
                                        checked={config?.excludeFromAutomaticCycle || false}
                                        onChange={() => toggleExcludeFromCycle(traitKey)}
                                        title="Exclude from automatic cycles"
                                      />
                                      <span className="mini-toggle-slider"></span>
                                      <span className="mini-toggle-label">Manual</span>
                                    </label>
                                    
                                    <button
                                      className={`hide-btn ${isHidden ? 'show-btn' : ''}`}
                                      onClick={() => isHidden ? toggleHideField(traitKey) : showHideConfirmationDialog(traitKey)}
                                      title={isHidden ? "Show field" : "Hide field"}
                                    >
                                      {isHidden ? 'Show' : 'Hide'}
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showHideConfirmation && (
        <HideConfirmationDialog
          traitKey={showHideConfirmation}
          onConfirm={() => toggleHideField(showHideConfirmation)}
          onCancel={cancelHideConfirmation}
          mergedTraitData={mergedTraitData}
        />
      )}

      {showTimeSelector && (
        <TimeSelector
          onClose={closeTimeSelector}
          onSave={(timing) => updateTraitTiming(showTimeSelector, timing)}
          currentTiming={traitConfigs[showTimeSelector]}
          seasons={seasons}
          months={months}
        />
      )}
    </div>
  );
}

interface HideConfirmationDialogProps {
  traitKey: string;
  onConfirm: () => void;
  onCancel: () => void;
  mergedTraitData: import('../utils/traitMerger').MergedTraitArea[];
}

function HideConfirmationDialog({ traitKey, onConfirm, onCancel, mergedTraitData }: HideConfirmationDialogProps) {
  // Extract trait name from traitKey (format: "trait-field_name")
  const traitField = traitKey.replace('trait-', '');

  // Find the trait label from mergedTraitData
  let traitLabel = traitField;
  for (const area of mergedTraitData) {
    for (const group of area.groups) {
      const trait = group.traits.find(t => t.field === traitField);
      if (trait) {
        traitLabel = trait.label;
        break;
      }
    }
  }

  return (
    <div className="confirmation-overlay" onClick={onCancel}>
      <div className="confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirmation-header">
          <h3>Hide Field</h3>
          <button className="close-btn" onClick={onCancel}>✕</button>
        </div>
        
        <div className="confirmation-content">
          <p><strong>Are you sure you want to hide "{traitLabel}"?</strong></p>
          <p>This field will not be available for editing or adding observations until you show it again using the "Show Hidden Fields" toggle.</p>
        </div>
        
        <div className="confirmation-actions">
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="confirm-btn" onClick={onConfirm}>Hide Field</button>
        </div>
      </div>
    </div>
  );
}

interface TimeSelectorProps {
  onClose: () => void;
  onSave: (timing: ObservationTiming) => void;
  currentTiming?: ObservationTiming;
  seasons: string[];
  months: string[];
}

function TimeSelector({ onClose, onSave, currentTiming, seasons, months }: TimeSelectorProps) {
  const [selectedYear, setSelectedYear] = useState(currentTiming?.year || 0);
  const [selectedSeason, setSelectedSeason] = useState(currentTiming?.season || '');
  const [selectedMonth, setSelectedMonth] = useState(currentTiming?.month || '');
  const [selectedWeeks, setSelectedWeeks] = useState<string[]>(currentTiming?.weeks || []);
  const [excludeFromCycle, setExcludeFromCycle] = useState(currentTiming?.excludeFromAutomaticCycle || false);
  const [showWeekSelector, setShowWeekSelector] = useState(false);
  const [availableYears, setAvailableYears] = useState([0, 1, 2, 3]);

  const weeks = ['W1', 'W2', 'W3', 'W4'];

  const addYear = () => {
    const nextYear = Math.max(...availableYears) + 1;
    setAvailableYears(prev => [...prev, nextYear]);
  };

  const handleSave = () => {
    onSave({
      year: selectedYear,
      season: selectedSeason || undefined,
      month: selectedMonth || undefined,
      weeks: selectedWeeks.length > 0 ? selectedWeeks : undefined,
      excludeFromAutomaticCycle: excludeFromCycle
    });
  };

  const toggleWeek = (week: string) => {
    setSelectedWeeks(prev => 
      prev.includes(week) 
        ? prev.filter(w => w !== week)
        : [...prev, week]
    );
  };

  const selectAllWeeks = () => {
    setSelectedWeeks(weeks);
  };

  const clearAllWeeks = () => {
    setSelectedWeeks([]);
  };

  return (
    <div className="time-selector-overlay" onClick={onClose}>
      <div className="time-selector-panel" onClick={(e) => e.stopPropagation()}>
        <div className="selector-header">
          <h3>Configure Observation Timing</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="cycle-options">
          <label className="cycle-toggle">
            <input
              type="checkbox"
              checked={excludeFromCycle}
              onChange={(e) => setExcludeFromCycle(e.target.checked)}
            />
            <span className="cycle-toggle-slider"></span>
            <span className="cycle-toggle-label">
              Exclude from Automatic Cycle
              <small>This trait will only be recorded manually</small>
            </span>
          </label>
        </div>

        <div className="time-grid">
          <div className="year-selector">
            <div className="year-header">
              <h4>Year</h4>
              <button className="add-year-btn" onClick={addYear}>+ Add Year</button>
            </div>
            <div className="year-buttons">
              {availableYears.map(year => (
                <button
                  key={year}
                  className={`year-btn ${selectedYear === year ? 'selected' : ''}`}
                  onClick={() => setSelectedYear(year)}
                >
                  Year {year}
                </button>
              ))}
            </div>
          </div>

          <div className="season-selector">
            <h4>Season</h4>
            <div className="season-buttons">
              {seasons.map(season => (
                <button
                  key={season}
                  className={`season-btn ${selectedSeason === season ? 'selected' : ''}`}
                  onClick={() => setSelectedSeason(season === selectedSeason ? '' : season)}
                >
                  {season.substring(0, 2)}
                </button>
              ))}
            </div>
          </div>

          <div className="month-selector">
            <h4>Month</h4>
            <div className="month-grid">
              {months.map((month) => (
                <button
                  key={month}
                  className={`month-btn ${selectedMonth === month ? 'selected' : ''}`}
                  onClick={() => {
                    if (selectedMonth === month) {
                      setSelectedMonth('');
                      setShowWeekSelector(false);
                      setSelectedWeeks([]);
                    } else {
                      setSelectedMonth(month);
                      setShowWeekSelector(true);
                    }
                  }}
                >
                  {month.substring(0, 3)}
                  {selectedMonth === month && (
                    <span className="week-indicator">
                      {selectedWeeks.length > 0 ? `(${selectedWeeks.length})` : ''}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {showWeekSelector && selectedMonth && (
            <div className="week-selector">
              <div className="week-header">
                <h4>Weeks in {selectedMonth}</h4>
                <div className="week-actions">
                  <button className="week-action-btn" onClick={selectAllWeeks}>All</button>
                  <button className="week-action-btn" onClick={clearAllWeeks}>Clear</button>
                </div>
              </div>
              <div className="week-buttons">
                {weeks.map(week => (
                  <button
                    key={week}
                    className={`week-btn ${selectedWeeks.includes(week) ? 'selected' : ''}`}
                    onClick={() => toggleWeek(week)}
                  >
                    {week}
                  </button>
                ))}
              </div>
              <div className="week-summary">
                Selected: {selectedWeeks.length > 0 ? selectedWeeks.join(', ') : 'None'}
              </div>
            </div>
          )}
        </div>

        <div className="selector-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="save-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default ObservationCyclesPage;