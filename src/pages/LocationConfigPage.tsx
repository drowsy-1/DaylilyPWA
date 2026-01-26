import { useState } from 'react';
import { useLocationConfig } from '../hooks/useLocationConfig';
import type { Page, LocationLevelKey } from '../types';
import './LocationConfigPage.css';

interface LocationConfigPageProps {
  onNavigate: (page: Page) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

function LocationConfigPage({ onNavigate, isDark, onToggleTheme }: LocationConfigPageProps) {
  const {
    config,
    toggleLevel,
    updateLabel,
    addValue,
    removeValue,
    renameValue,
    resetToDefaults,
  } = useLocationConfig();

  const [expandedLevels, setExpandedLevels] = useState<Set<string>>(new Set(['section', 'bed']));
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<{ level: string; value: string } | null>(null);
  const [newValues, setNewValues] = useState<Record<string, string>>({});

  const toggleExpanded = (key: string) => {
    const newExpanded = new Set(expandedLevels);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedLevels(newExpanded);
  };

  const handleAddValue = (key: LocationLevelKey) => {
    const value = newValues[key];
    if (value?.trim()) {
      addValue(key, value.trim());
      setNewValues(prev => ({ ...prev, [key]: '' }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, key: LocationLevelKey) => {
    if (e.key === 'Enter') {
      handleAddValue(key);
    }
  };

  return (
    <div className="location-config-page">
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1>Location Setup</h1>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {isDark ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      <div className="page-content">
        <div className="page-intro">
          <p>Configure how you organize plant locations in your garden. Enable levels you use and add your specific values.</p>
        </div>

        <div className="levels-list">
          {config.levels.map((level) => (
            <div key={level.key} className={`level-card ${level.enabled ? 'enabled' : 'disabled'}`}>
              <div className="level-header">
                <div className="level-toggle">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={level.enabled}
                      onChange={() => toggleLevel(level.key)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="level-info" onClick={() => level.enabled && toggleExpanded(level.key)}>
                  {editingLabel === level.key ? (
                    <input
                      type="text"
                      className="label-edit-input"
                      value={level.label}
                      onChange={(e) => updateLabel(level.key, e.target.value)}
                      onBlur={() => setEditingLabel(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingLabel(null)}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <span className="level-label">{level.label}</span>
                  )}
                  <span className="level-count">
                    {level.values.length} value{level.values.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="level-actions">
                  <button
                    className="edit-label-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingLabel(editingLabel === level.key ? null : level.key);
                    }}
                    title="Rename level"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  {level.enabled && (
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpanded(level.key)}
                    >
                      {expandedLevels.has(level.key) ? '▼' : '▶'}
                    </button>
                  )}
                </div>
              </div>

              {level.enabled && expandedLevels.has(level.key) && (
                <div className="level-content">
                  {level.key === 'garden' && (
                    <div className="level-hint">
                      Use this if you manage multiple garden locations or properties.
                    </div>
                  )}

                  <div className="values-section">
                    <div className="add-value-row">
                      <input
                        type="text"
                        className="add-value-input"
                        placeholder={`Add ${level.label.toLowerCase()}...`}
                        value={newValues[level.key] || ''}
                        onChange={(e) => setNewValues(prev => ({ ...prev, [level.key]: e.target.value }))}
                        onKeyDown={(e) => handleKeyDown(e, level.key)}
                      />
                      <button
                        className="add-value-btn"
                        onClick={() => handleAddValue(level.key)}
                        disabled={!newValues[level.key]?.trim()}
                      >
                        Add
                      </button>
                    </div>

                    {level.values.length > 0 ? (
                      <div className="values-list">
                        {level.values.map((value) => (
                          <div key={value} className="value-item">
                            {editingValue?.level === level.key && editingValue?.value === value ? (
                              <input
                                type="text"
                                className="value-edit-input"
                                defaultValue={value}
                                onBlur={(e) => {
                                  if (e.target.value.trim() && e.target.value !== value) {
                                    renameValue(level.key, value, e.target.value);
                                  }
                                  setEditingValue(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    const target = e.target as HTMLInputElement;
                                    if (target.value.trim() && target.value !== value) {
                                      renameValue(level.key, value, target.value);
                                    }
                                    setEditingValue(null);
                                  } else if (e.key === 'Escape') {
                                    setEditingValue(null);
                                  }
                                }}
                                autoFocus
                              />
                            ) : (
                              <>
                                <span className="value-name">{value}</span>
                                <div className="value-actions">
                                  <button
                                    className="value-edit-btn"
                                    onClick={() => setEditingValue({ level: level.key, value })}
                                    title="Edit"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                    </svg>
                                  </button>
                                  <button
                                    className="value-delete-btn"
                                    onClick={() => removeValue(level.key, value)}
                                    title="Delete"
                                  >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <path d="M18 6L6 18M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-values">
                        No {level.label.toLowerCase()}s added yet
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="page-actions">
          <button className="reset-btn" onClick={resetToDefaults}>
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
}

export default LocationConfigPage;
