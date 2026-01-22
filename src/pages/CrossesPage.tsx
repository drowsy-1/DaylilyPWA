import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import type { Page, CrossData, ParentType } from '../types';
import './CrossesPage.css';

interface CrossesPageProps {
  onNavigate: (page: Page) => void;
  crosses: CrossData[];
  onSaveCross: (cross: CrossData) => void;
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

export default function CrossesPage({ onNavigate, crosses, onSaveCross }: CrossesPageProps) {
  const [podParent, setPodParent] = useState<ParentValue>(createEmptySimple());
  const [pollenParent, setPollenParent] = useState<ParentValue>(createEmptySimple());
  const [error, setError] = useState<string | null>(null);

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

        {/* Crosses List */}
        <div className="crosses-list-section">
          <div className="section-header">
            <span className="section-title">All Crosses</span>
            <span className="section-count">{crosses.length}</span>
          </div>

          {crosses.length === 0 ? (
            <div className="empty-state">
              <p>No crosses yet</p>
              <p className="empty-hint">Create your first cross above</p>
            </div>
          ) : (
            <div className="crosses-list">
              {sortedCrosses.map(cross => (
                <div key={cross.id} className="cross-item">
                  <span className="cross-number">{formatCrossNumber(cross.crossNumber)}</span>
                  <div className="cross-parents">
                    <span className="cross-label">
                      ({cross.podParent} × {cross.pollenParent})
                    </span>
                    <span className="cross-date">
                      {new Date(cross.dateCreated).toLocaleDateString()}
                    </span>
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
