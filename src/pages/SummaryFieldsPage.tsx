import { useState, useRef } from 'react';
import './SummaryFieldsPage.css';
import { traitData } from '../data/traitData';
import { DEFAULT_SUMMARY_FIELDS } from '../types';
import type { Page } from '../types';

interface SummaryFieldConfig {
  field: string;
  row: number; // 1, 2, or 3
}

interface SummaryFieldsPageProps {
  selectedFields: string[];
  onSave: (fields: string[]) => void;
  onNavigate: (page: Page) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

// Get all trait fields from traitData only
function getAllTraitFields() {
  const fields: { field: string; label: string; area: string; group: string; isNumeric?: boolean }[] = [];

  // Only add traits from traitData
  traitData.forEach(area => {
    area.groups.forEach(group => {
      group.traits.forEach(trait => {
        if (!fields.find(f => f.field === trait.field)) {
          fields.push({
            field: trait.field,
            label: trait.label,
            area: area.name,
            group: group.name,
            isNumeric: trait.type === 'number' || trait.type === 'rating'
          });
        }
      });
    });
  });

  return fields;
}

function SummaryFieldsPage({ selectedFields, onSave, onNavigate, isDark, onToggleTheme }: SummaryFieldsPageProps) {
  // Initialize with row info (numeric fields default to row 1, others to row 2)
  const allFields = getAllTraitFields();

  const initializeFieldConfigs = (fields: string[]): SummaryFieldConfig[] => {
    return fields.map(field => {
      const fieldInfo = allFields.find(f => f.field === field);
      return {
        field,
        row: fieldInfo?.isNumeric ? 1 : 2
      };
    });
  };

  const [fieldConfigs, setFieldConfigs] = useState<SummaryFieldConfig[]>(
    initializeFieldConfigs(selectedFields)
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAreas, setExpandedAreas] = useState<string[]>(['Basic Information']);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const selected = fieldConfigs.map(c => c.field);

  // Group fields by area
  const groupedFields = allFields.reduce((acc, field) => {
    if (!acc[field.area]) {
      acc[field.area] = [];
    }
    acc[field.area].push(field);
    return acc;
  }, {} as Record<string, typeof allFields>);

  // Filter fields by search
  const filteredAreas = Object.entries(groupedFields).map(([area, fields]) => ({
    area,
    fields: fields.filter(f =>
      f.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.field.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(a => a.fields.length > 0);

  const toggleField = (field: string) => {
    if (selected.includes(field)) {
      setFieldConfigs(prev => prev.filter(c => c.field !== field));
    } else {
      const fieldInfo = allFields.find(f => f.field === field);
      setFieldConfigs(prev => [...prev, {
        field,
        row: fieldInfo?.isNumeric ? 1 : 2
      }]);
    }
  };

  const updateFieldRow = (field: string, row: number) => {
    setFieldConfigs(prev => prev.map(c =>
      c.field === field ? { ...c, row } : c
    ));
  };

  const toggleArea = (area: string) => {
    setExpandedAreas(prev =>
      prev.includes(area)
        ? prev.filter(a => a !== area)
        : [...prev, area]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onNavigate('home');
  };

  const handleReset = () => {
    setFieldConfigs(initializeFieldConfigs(DEFAULT_SUMMARY_FIELDS));
  };

  const handleSelectAll = (areaFields: typeof allFields) => {
    const fieldIds = areaFields.map(f => f.field);
    const allSelected = fieldIds.every(f => selected.includes(f));

    if (allSelected) {
      setFieldConfigs(prev => prev.filter(c => !fieldIds.includes(c.field)));
    } else {
      const newFields = fieldIds.filter(f => !selected.includes(f));
      const newConfigs = newFields.map(field => {
        const fieldInfo = allFields.find(f => f.field === field);
        return {
          field,
          row: fieldInfo?.isNumeric ? 1 : 2
        };
      });
      setFieldConfigs(prev => [...prev, ...newConfigs]);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedIndex === null || dragOverIndex.current === null) return;
    if (draggedIndex === dragOverIndex.current) return;

    const newConfigs = [...fieldConfigs];
    const [removed] = newConfigs.splice(draggedIndex, 1);
    newConfigs.splice(dragOverIndex.current, 0, removed);
    setFieldConfigs(newConfigs);
    setDraggedIndex(null);
    dragOverIndex.current = null;
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    dragOverIndex.current = null;
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fieldConfigs.length) return;

    const newConfigs = [...fieldConfigs];
    [newConfigs[index], newConfigs[newIndex]] = [newConfigs[newIndex], newConfigs[index]];
    setFieldConfigs(newConfigs);
  };

  return (
    <div className="summary-fields-page">
      {/* Fixed Header */}
      <div className="fixed-header">
        <div className="header-content">
          <h1>Summary Fields</h1>
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
        <p className="header-description">Select and arrange fields for plant summaries</p>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <label className="search-label">Search Available Fields</label>
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Type to filter fields..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear" onClick={() => setSearchTerm('')}>×</button>
          )}
        </div>
      </div>

      {/* Selected Fields with Drag & Drop */}
      <div className="selected-section">
        <div className="selected-header">
          <h3>Selected Fields ({selected.length})</h3>
          <span className="drag-hint">Drag to reorder</span>
        </div>

        {fieldConfigs.length === 0 ? (
          <div className="no-selection">No fields selected</div>
        ) : (
          <div className="selected-list">
            {fieldConfigs.map((config, index) => {
              const field = allFields.find(f => f.field === config.field);
              return (
                <div
                  key={config.field}
                  className={`selected-item ${draggedIndex === index ? 'dragging' : ''}`}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={handleDrop}
                  onDragEnd={handleDragEnd}
                >
                  <div className="drag-handle">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="9" cy="6" r="2" />
                      <circle cx="15" cy="6" r="2" />
                      <circle cx="9" cy="12" r="2" />
                      <circle cx="15" cy="12" r="2" />
                      <circle cx="9" cy="18" r="2" />
                      <circle cx="15" cy="18" r="2" />
                    </svg>
                  </div>
                  <div className="item-info">
                    <span className="item-label">{field?.label || config.field}</span>
                    <span className="item-order">#{index + 1}</span>
                  </div>
                  <div className="row-selector">
                    <label className="row-label">Row:</label>
                    <select
                      value={config.row}
                      onChange={(e) => updateFieldRow(config.field, Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value={1}>1 (Numbers)</option>
                      <option value={2}>2 (Text)</option>
                      <option value={3}>3 (Extra)</option>
                    </select>
                  </div>
                  <div className="item-actions">
                    <button
                      className="move-btn"
                      onClick={() => moveField(index, 'up')}
                      disabled={index === 0}
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      className="move-btn"
                      onClick={() => moveField(index, 'down')}
                      disabled={index === fieldConfigs.length - 1}
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => toggleField(config.field)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Available Fields - styled like TraitFieldsPage */}
      <div className="available-section">
        <h3>Available Trait Fields</h3>
        <div className="trait-areas">
          {filteredAreas.map(({ area, fields }) => (
            <div key={area} className="trait-area">
              <button
                className="area-header"
                onClick={() => toggleArea(area)}
              >
                <span className="expand-icon">{expandedAreas.includes(area) ? '▼' : '▶'}</span>
                <span className="area-name">{area}</span>
                <span className="area-count">
                  ({fields.filter(f => selected.includes(f.field)).length}/{fields.length} selected)
                </span>
                <span
                  className="select-all-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAll(fields);
                  }}
                >
                  {fields.every(f => selected.includes(f.field)) ? 'Deselect All' : 'Select All'}
                </span>
              </button>

              {expandedAreas.includes(area) && (
                <div className="area-fields">
                  {fields.map(field => (
                    <label key={field.field} className="field-option">
                      <input
                        type="checkbox"
                        checked={selected.includes(field.field)}
                        onChange={() => toggleField(field.field)}
                      />
                      <span className="checkbox-custom">✓</span>
                      <span className="field-label">{field.label}</span>
                      {field.isNumeric && <span className="numeric-badge">#</span>}
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions at bottom of content */}
      <div className="summary-fields-actions">
        <button className="action-btn secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
        <button className="action-btn primary" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default SummaryFieldsPage;
