import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import type { Page, CrossData, ParentType, CrossAssignment } from '../types';
import './CrossesPage.css';

interface CrossesPageProps {
  onNavigate: (page: Page, data?: unknown) => void;
  crosses: CrossData[];
  crossAssignments: CrossAssignment[];
  onSaveCross: (cross: CrossData) => void;
  onAssignCrosses: (crossIds: string[], year: number) => void;
}

interface AutocompleteSuggestion {
  value: string;
  label: string;
  type: ParentType;
  hybridizer?: string;
}

// Recursive type for nested parent values
type ParentValue =
  | { kind: 'simple'; value: string; parentType: ParentType }
  | { kind: 'cross'; podParent: ParentValue; pollenParent: ParentValue };

const SPECIAL_OPTIONS: AutocompleteSuggestion[] = [
  { value: 'Seedling', label: 'Seedling', type: 'seedling' },
  { value: 'Sdlg', label: 'Sdlg', type: 'seedling' },
  { value: 'Unknown', label: 'Unknown', type: 'unknown' },
];

// Normalize a ParentValue - fill empty values with "Unknown"
function normalizeParentValue(pv: ParentValue): ParentValue {
  if (pv.kind === 'simple') {
    const trimmed = pv.value.trim();
    if (!trimmed) {
      return { kind: 'simple', value: 'Unknown', parentType: 'unknown' };
    }
    return { ...pv, value: trimmed };
  }
  return {
    kind: 'cross',
    podParent: normalizeParentValue(pv.podParent),
    pollenParent: normalizeParentValue(pv.pollenParent)
  };
}

// Convert ParentValue to display string with proper parentheses
// Crosses are ALWAYS wrapped in parentheses for balanced output
function parentValueToString(pv: ParentValue): string {
  if (pv.kind === 'simple') {
    return pv.value || 'Unknown';
  }
  const podStr = parentValueToString(pv.podParent);
  const pollenStr = parentValueToString(pv.pollenParent);
  // Always wrap crosses in parentheses
  return `(${podStr} × ${pollenStr})`;
}

// Get a preview string (shows ? for empty)
function getPreviewString(pv: ParentValue): string {
  if (pv.kind === 'simple') {
    return pv.value.trim() || '?';
  }
  const podStr = getPreviewString(pv.podParent);
  const pollenStr = getPreviewString(pv.pollenParent);
  return `(${podStr} × ${pollenStr})`;
}

// Check if a ParentValue has any content
function hasContent(pv: ParentValue): boolean {
  if (pv.kind === 'simple') {
    return pv.value.trim() !== '';
  }
  return hasContent(pv.podParent) || hasContent(pv.pollenParent);
}

// Create empty simple parent
function createEmptySimple(): ParentValue {
  return { kind: 'simple', value: '', parentType: 'manual' };
}

// Create empty cross parent
function createEmptyCross(): ParentValue {
  return {
    kind: 'cross',
    podParent: createEmptySimple(),
    pollenParent: createEmptySimple()
  };
}

// Build inventory suggestions
const inventorySuggestions: AutocompleteSuggestion[] = mockInventoryData.map(item => ({
  value: item.name,
  label: item.name,
  type: 'inventory' as ParentType,
  hybridizer: item.hybridizer,
}));

// Filter suggestions based on input
function getFilteredSuggestions(input: string): AutocompleteSuggestion[] {
  const query = input.toLowerCase().trim();
  if (!query) return [];

  const results: AutocompleteSuggestion[] = [];

  const inventoryMatches = inventorySuggestions
    .filter(s => s.value.toLowerCase().includes(query))
    .slice(0, 6);
  results.push(...inventoryMatches);

  const specialMatches = SPECIAL_OPTIONS.filter(s =>
    s.value.toLowerCase().includes(query)
  );
  results.push(...specialMatches);

  return results.slice(0, 8);
}

// Nested Parent Input Component
interface ParentInputProps {
  label: string;
  value: ParentValue;
  onChange: (value: ParentValue) => void;
  depth?: number;
  autoFocus?: boolean;
}

function ParentInput({ label, value, onChange, depth = 0, autoFocus }: ParentInputProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isExpanded = value.kind === 'cross';

  const suggestions = useMemo(() => {
    if (value.kind === 'simple') {
      return getFilteredSuggestions(value.value);
    }
    return [];
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (newValue: string) => {
    onChange({ kind: 'simple', value: newValue, parentType: 'manual' });
    setShowSuggestions(true);
  };

  const handleSelect = (suggestion: AutocompleteSuggestion) => {
    onChange({ kind: 'simple', value: suggestion.value, parentType: suggestion.type });
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    } else if ((e.key === 'Tab' || e.key === 'Enter') && suggestions.length > 0 && showSuggestions) {
      e.preventDefault();
      handleSelect(suggestions[0]);
    }
  };

  const handleExpand = () => {
    // Convert simple to cross, preserving any existing value as pod parent
    if (value.kind === 'simple' && value.value.trim()) {
      onChange({
        kind: 'cross',
        podParent: value,
        pollenParent: createEmptySimple()
      });
    } else {
      onChange(createEmptyCross());
    }
  };

  const handleCollapse = () => {
    // Convert cross back to simple, using the string representation
    const normalized = normalizeParentValue(value);
    const str = parentValueToString(normalized);
    onChange({ kind: 'simple', value: str, parentType: 'manual' });
  };

  const handlePodChange = useCallback((newPod: ParentValue) => {
    if (value.kind === 'cross') {
      onChange({ ...value, podParent: newPod });
    }
  }, [value, onChange]);

  const handlePollenChange = useCallback((newPollen: ParentValue) => {
    if (value.kind === 'cross') {
      onChange({ ...value, pollenParent: newPollen });
    }
  }, [value, onChange]);

  if (isExpanded && value.kind === 'cross') {
    return (
      <div className={`parent-input-wrapper expanded depth-${Math.min(depth, 3)}`}>
        <div className="expanded-header">
          <label className="input-label">{label}</label>
          <button
            type="button"
            className="collapse-btn"
            onClick={handleCollapse}
            title="Collapse to simple"
          >
            −
          </button>
        </div>
        <div className="nested-cross-container">
          <div className="nested-cross-row">
            <ParentInput
              label="Pod"
              value={value.podParent}
              onChange={handlePodChange}
              depth={depth + 1}
              autoFocus
            />
          </div>
          <div className="nested-cross-divider">
            <span className="cross-symbol-nested">×</span>
          </div>
          <div className="nested-cross-row">
            <ParentInput
              label="Pollen"
              value={value.pollenParent}
              onChange={handlePollenChange}
              depth={depth + 1}
            />
          </div>
        </div>
      </div>
    );
  }

  // Simple input mode
  const simpleValue = value.kind === 'simple' ? value.value : '';

  return (
    <div className={`parent-input-wrapper simple depth-${Math.min(depth, 3)}`}>
      <div className="input-header">
        <label className="input-label">{label}</label>
        <button
          type="button"
          className="expand-btn"
          onClick={handleExpand}
          title="Expand to nested cross"
        >
          +
        </button>
      </div>
      <div className="autocomplete-container">
        <input
          ref={inputRef}
          type="text"
          className="parent-input"
          value={simpleValue}
          onChange={e => handleInputChange(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search or type..."
          autoComplete="off"
          autoFocus={autoFocus}
        />
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown" ref={dropdownRef}>
            {suggestions.map((suggestion, index) => (
              <button
                type="button"
                key={`${suggestion.value}-${index}`}
                className={`suggestion-item ${suggestion.type}`}
                onClick={() => handleSelect(suggestion)}
              >
                <span className="suggestion-name">{suggestion.label}</span>
                {suggestion.hybridizer && (
                  <span className="suggestion-hybridizer">{suggestion.hybridizer}</span>
                )}
                {suggestion.type === 'seedling' && (
                  <span className="suggestion-tag">seedling</span>
                )}
                {suggestion.type === 'unknown' && (
                  <span className="suggestion-tag">unknown</span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CrossesPage({ onNavigate, crosses, crossAssignments, onSaveCross, onAssignCrosses }: CrossesPageProps) {
  const [podParent, setPodParent] = useState<ParentValue>(createEmptySimple());
  const [pollenParent, setPollenParent] = useState<ParentValue>(createEmptySimple());
  const [error, setError] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Assign mode state
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [selectedCrossIds, setSelectedCrossIds] = useState<Set<string>>(new Set());
  const [selectedAssignYear, setSelectedAssignYear] = useState<number | null>(null);

  // Generate year options
  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => {
    const years: number[] = [];
    // Next year first, then current year, then 5 years back
    years.push(currentYear + 1);
    years.push(currentYear);
    for (let i = 1; i <= 5; i++) {
      years.push(currentYear - i);
    }
    return years;
  }, [currentYear]);

  // Get years that have assignments
  const yearsWithAssignments = useMemo(() => {
    const years = new Set<number>();
    crossAssignments.forEach(a => years.add(a.year));
    return years;
  }, [crossAssignments]);

  // Get assignment count per year
  const assignmentCountByYear = useMemo(() => {
    const counts = new Map<number, number>();
    crossAssignments.forEach(a => {
      counts.set(a.year, (counts.get(a.year) || 0) + 1);
    });
    return counts;
  }, [crossAssignments]);

  const handlePodChange = useCallback((value: ParentValue) => {
    setPodParent(value);
    setError(null);
  }, []);

  const handlePollenChange = useCallback((value: ParentValue) => {
    setPollenParent(value);
    setError(null);
  }, []);

  const getNextCrossNumber = (): number => {
    if (crosses.length === 0) return 1;
    const maxNumber = Math.max(...crosses.map(c => c.crossNumber));
    return maxNumber + 1;
  };

  // Normalize and get strings for comparison/display
  const normalizedPod = normalizeParentValue(podParent);
  const normalizedPollen = normalizeParentValue(pollenParent);
  const podString = parentValueToString(normalizedPod);
  const pollenString = parentValueToString(normalizedPollen);

  // Preview strings (show ? for empty)
  const podPreview = getPreviewString(podParent);
  const pollenPreview = getPreviewString(pollenParent);

  const isDuplicateCross = (): boolean => {
    return crosses.some(
      c => c.podParent.toLowerCase() === podString.toLowerCase() &&
           c.pollenParent.toLowerCase() === pollenString.toLowerCase()
    );
  };

  // Can create if either side has some content (empty will become Unknown)
  const canCreate = hasContent(podParent) || hasContent(pollenParent);

  const handleCreateCross = () => {
    if (isDuplicateCross()) {
      setError('This cross already exists');
      return;
    }

    const nextNumber = getNextCrossNumber();
    if (nextNumber > 9999) {
      setError('Maximum number of crosses reached (9999)');
      return;
    }

    // Determine parent types (use 'unknown' for normalized unknowns, 'manual' for complex)
    const podType = normalizedPod.kind === 'simple' ? normalizedPod.parentType : 'manual';
    const pollenType = normalizedPollen.kind === 'simple' ? normalizedPollen.parentType : 'manual';

    const newCross: CrossData = {
      id: crypto.randomUUID(),
      crossNumber: nextNumber,
      podParent: podString,
      pollenParent: pollenString,
      podParentType: podType,
      pollenParentType: pollenType,
      dateCreated: new Date().toISOString(),
    };

    onSaveCross(newCross);
    setPodParent(createEmptySimple());
    setPollenParent(createEmptySimple());
    setError(null);
  };

  const formatCrossNumber = (num: number): string => {
    return num.toString().padStart(4, '0');
  };

  const sortedCrosses = useMemo(() => {
    return [...crosses].sort((a, b) => b.crossNumber - a.crossNumber);
  }, [crosses]);

  // Filtered crosses based on search
  const filteredCrosses = useMemo(() => {
    if (!searchQuery.trim()) return sortedCrosses;
    const query = searchQuery.toLowerCase().trim();
    return sortedCrosses.filter(cross =>
      cross.podParent.toLowerCase().includes(query) ||
      cross.pollenParent.toLowerCase().includes(query) ||
      `${cross.podParent} × ${cross.pollenParent}`.toLowerCase().includes(query)
    );
  }, [sortedCrosses, searchQuery]);

  // Toggle cross selection in assign mode
  const toggleCrossSelection = (crossId: string) => {
    setSelectedCrossIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(crossId)) {
        newSet.delete(crossId);
      } else {
        newSet.add(crossId);
      }
      return newSet;
    });
  };

  // Handle assign button click
  const handleAssignClick = () => {
    if (isAssignMode && selectedCrossIds.size > 0 && selectedAssignYear !== null) {
      onAssignCrosses(Array.from(selectedCrossIds), selectedAssignYear);
      setIsAssignMode(false);
      setSelectedCrossIds(new Set());
      setSelectedAssignYear(null);
    } else {
      setIsAssignMode(!isAssignMode);
      if (!isAssignMode) {
        setSelectedCrossIds(new Set());
        setSelectedAssignYear(currentYear);
      }
    }
  };

  // Cancel assign mode
  const handleCancelAssign = () => {
    setIsAssignMode(false);
    setSelectedCrossIds(new Set());
    setSelectedAssignYear(null);
  };

  // Navigate to assigned crosses for a year
  const handleYearClick = (year: number) => {
    onNavigate('assigned-crosses', { year });
  };

  // Check if we have any nested content for showing preview
  const hasNestedContent = podParent.kind === 'cross' || pollenParent.kind === 'cross' ||
                          podPreview !== '?' || pollenPreview !== '?';

  return (
    <div className="crosses-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <span className="back-icon">←</span>
        </button>
        <h1>Crosses</h1>
        <div className="header-spacer"></div>
      </div>

      <div className="page-content">
        {/* Assigned Crosses Section */}
        <div className="assigned-crosses-section">
          <div className="section-header">
            <span className="section-title">Assigned Crosses</span>
          </div>
          <div className="year-buttons-row">
            {yearOptions.map(year => {
              const count = assignmentCountByYear.get(year) || 0;
              const isCurrentYear = year === currentYear;
              const hasAssignments = yearsWithAssignments.has(year);
              return (
                <button
                  key={year}
                  className={`year-btn ${isCurrentYear ? 'current' : ''} ${hasAssignments ? 'has-assignments' : ''}`}
                  onClick={() => handleYearClick(year)}
                >
                  <span className="year-label">{year}</span>
                  {count > 0 && <span className="year-count">{count}</span>}
                  {isCurrentYear && <span className="current-badge">Current</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Cross Input Form */}
        <div className="cross-form">
          <div className="form-title">New Cross</div>

          <div className="main-cross-container">
            <div className="main-cross-row">
              <ParentInput
                label="Pod Parent (Maternal)"
                value={podParent}
                onChange={handlePodChange}
              />
            </div>

            <div className="main-cross-divider">
              <span className="cross-symbol-main">×</span>
            </div>

            <div className="main-cross-row">
              <ParentInput
                label="Pollen Parent (Paternal)"
                value={pollenParent}
                onChange={handlePollenChange}
              />
            </div>
          </div>

          {/* Preview of cross string - shows balanced parentheses */}
          {hasNestedContent && (
            <div className="cross-preview">
              <div className="preview-label">Preview (empty fields → Unknown):</div>
              <div className="preview-text">
                ({podPreview} × {pollenPreview})
              </div>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button
            type="button"
            className="create-cross-btn"
            onClick={handleCreateCross}
            disabled={!canCreate}
          >
            Create Cross
          </button>
        </div>

        {/* Assign Crosses Button */}
        {crosses.length > 0 && (
          <div className="assign-section">
            {isAssignMode ? (
              <div className="assign-mode-controls">
                <div className="assign-year-selector">
                  <span className="assign-label">Assign to:</span>
                  <div className="assign-year-buttons">
                    {yearOptions.slice(0, 4).map(year => (
                      <button
                        key={year}
                        className={`assign-year-btn ${selectedAssignYear === year ? 'selected' : ''} ${year === currentYear ? 'current' : ''}`}
                        onClick={() => setSelectedAssignYear(year)}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="assign-actions">
                  <button
                    className="assign-confirm-btn"
                    onClick={handleAssignClick}
                    disabled={selectedCrossIds.size === 0}
                  >
                    Assign {selectedCrossIds.size > 0 ? `(${selectedCrossIds.size})` : ''}
                  </button>
                  <button className="assign-cancel-btn" onClick={handleCancelAssign}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button className="assign-crosses-btn" onClick={handleAssignClick}>
                Assign Crosses
              </button>
            )}
          </div>
        )}

        {/* Crosses List */}
        <div className="crosses-list-section">
          <div className="section-header">
            <span className="section-title">All Crosses</span>
            <span className="section-count">{filteredCrosses.length}{searchQuery && ` / ${crosses.length}`}</span>
          </div>

          {/* Search Field */}
          <div className="search-container">
            <input
              type="text"
              className="crosses-search-input"
              placeholder="Search crosses..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
                type="button"
              >
                ×
              </button>
            )}
          </div>

          {crosses.length === 0 ? (
            <div className="empty-state">
              <p>No crosses yet</p>
              <p className="empty-hint">Create your first cross above</p>
            </div>
          ) : filteredCrosses.length === 0 ? (
            <div className="empty-state">
              <p>No matches found</p>
              <p className="empty-hint">Try a different search term</p>
            </div>
          ) : (
            <div className="crosses-list">
              {filteredCrosses.map(cross => (
                <div
                  key={cross.id}
                  className={`cross-item ${isAssignMode ? 'selectable' : ''} ${selectedCrossIds.has(cross.id) ? 'selected' : ''}`}
                  onClick={isAssignMode ? () => toggleCrossSelection(cross.id) : undefined}
                >
                  {isAssignMode && (
                    <div className="cross-checkbox">
                      <div className={`checkbox ${selectedCrossIds.has(cross.id) ? 'checked' : ''}`}>
                        {selectedCrossIds.has(cross.id) && '✓'}
                      </div>
                    </div>
                  )}
                  <span className="cross-number">{formatCrossNumber(cross.crossNumber)}</span>
                  <div className="cross-parents">
                    <span className="cross-label">
                      ({cross.podParent} × {cross.pollenParent})
                    </span>
                    <div className="cross-dates">
                      <span className="cross-date">
                        Added: {new Date(cross.dateCreated).toLocaleDateString()}
                      </span>
                      {cross.lastUsed && (
                        <span className="cross-date last-used">
                          Last used: {new Date(cross.lastUsed).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
