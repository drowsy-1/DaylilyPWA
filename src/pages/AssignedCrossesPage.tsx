import { useState, useMemo } from 'react';
import type { Page, CrossData, CrossAssignment, ParentType } from '../types';
import { mockInventoryData } from '../data/mockInventory';
import './AssignedCrossesPage.css';

interface AssignedCrossesPageProps {
  year: number;
  crosses: CrossData[];
  crossAssignments: CrossAssignment[];
  onNavigate: (page: Page) => void;
  onSaveCross: (cross: CrossData) => void;
  onUpdateCrossCount: (assignmentId: string, count: number) => void;
  onAssignCrosses: (crossIds: string[], year: number) => void;
}

interface AutocompleteSuggestion {
  value: string;
  label: string;
  type: ParentType;
  hybridizer?: string;
}

const SPECIAL_OPTIONS: AutocompleteSuggestion[] = [
  { value: 'Seedling', label: 'Seedling', type: 'seedling' },
  { value: 'Sdlg', label: 'Sdlg', type: 'seedling' },
  { value: 'Unknown', label: 'Unknown', type: 'unknown' },
];

const inventorySuggestions: AutocompleteSuggestion[] = mockInventoryData.map(item => ({
  value: item.name,
  label: item.name,
  type: 'inventory' as ParentType,
  hybridizer: item.hybridizer,
}));

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

export default function AssignedCrossesPage({
  year,
  crosses,
  crossAssignments,
  onNavigate,
  onSaveCross,
  onUpdateCrossCount,
  onAssignCrosses,
}: AssignedCrossesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [crossCount, setCrossCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);

  // Track session work: crossId -> count added this session
  const [sessionCounts, setSessionCounts] = useState<Map<string, number>>(new Map());

  // Calculate total crosses made this session
  const sessionTotal = useMemo(() => {
    let total = 0;
    sessionCounts.forEach(count => {
      total += count;
    });
    return total;
  }, [sessionCounts]);

  // Add new cross modal state
  const [podParent, setPodParent] = useState('');
  const [pollenParent, setPollenParent] = useState('');
  const [podSuggestions, setPodSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [pollenSuggestions, setPollenSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showPodSuggestions, setShowPodSuggestions] = useState(false);
  const [showPollenSuggestions, setShowPollenSuggestions] = useState(false);

  // Get assignments for this year with cross data
  const yearAssignments = useMemo(() => {
    return crossAssignments
      .filter(a => a.year === year)
      .map(a => ({
        ...a,
        cross: crosses.find(c => c.id === a.crossId),
      }))
      .filter(a => a.cross !== undefined);
  }, [crossAssignments, crosses, year]);

  // Filter by search
  const filteredAssignments = useMemo(() => {
    if (!searchQuery.trim()) return yearAssignments;
    const query = searchQuery.toLowerCase().trim();
    return yearAssignments.filter(a => {
      if (!a.cross) return false;
      return (
        a.cross.podParent.toLowerCase().includes(query) ||
        a.cross.pollenParent.toLowerCase().includes(query)
      );
    });
  }, [yearAssignments, searchQuery]);

  // Get selected cross info
  const selectedAssignment = useMemo(() => {
    if (!selectedAssignmentId) return null;
    return yearAssignments.find(a => a.id === selectedAssignmentId) || null;
  }, [yearAssignments, selectedAssignmentId]);

  // Store initial count when selecting to calculate session delta
  const [initialCount, setInitialCount] = useState(0);

  const handleSelectCross = (assignmentId: string) => {
    const assignment = yearAssignments.find(a => a.id === assignmentId);
    const currentCount = assignment?.crossCount || 0;
    setSelectedAssignmentId(assignmentId);
    setCrossCount(currentCount);
    setInitialCount(currentCount); // Remember starting point
  };

  const handleNumberPadInput = (num: number) => {
    // Append digit to build number (up to 3 digits)
    const newCount = parseInt(`${crossCount}${num}`.slice(-3), 10);
    setCrossCount(newCount);
  };

  const handleClearCount = () => {
    setCrossCount(0);
  };

  const handleIncrement = () => {
    setCrossCount(prev => Math.min(prev + 1, 999));
  };

  const handleDecrement = () => {
    setCrossCount(prev => Math.max(prev - 1, 0));
  };

  const handleCrossedConfirm = () => {
    if (selectedAssignmentId) {
      // Save the count directly (user can adjust up or down)
      onUpdateCrossCount(selectedAssignmentId, crossCount);

      // Calculate how many were added/changed this session for this cross
      const delta = crossCount - initialCount;

      // Track session counts (accumulate if same cross worked multiple times)
      setSessionCounts(prev => {
        const newMap = new Map(prev);
        const existingDelta = newMap.get(selectedAssignmentId) || 0;
        newMap.set(selectedAssignmentId, existingDelta + delta);
        return newMap;
      });

      setSelectedAssignmentId(null);
      setCrossCount(0);
      setInitialCount(0);
    }
  };

  const handleCloseModal = () => {
    setSelectedAssignmentId(null);
    setCrossCount(0);
  };

  const handleCompleteAll = () => {
    // Just show achievement for this session and return
    // Don't mark anything as "complete" since crosses can be repeated
    if (sessionCounts.size > 0) {
      setShowAchievement(true);
    } else {
      onNavigate('crosses');
    }
  };

  const handleAchievementClose = () => {
    setShowAchievement(false);
    onNavigate('crosses');
  };

  // Add new cross handlers
  const handlePodChange = (value: string) => {
    setPodParent(value);
    setPodSuggestions(getFilteredSuggestions(value));
    setShowPodSuggestions(true);
  };

  const handlePollenChange = (value: string) => {
    setPollenParent(value);
    setPollenSuggestions(getFilteredSuggestions(value));
    setShowPollenSuggestions(true);
  };

  const handleSelectPodSuggestion = (suggestion: AutocompleteSuggestion) => {
    setPodParent(suggestion.value);
    setShowPodSuggestions(false);
  };

  const handleSelectPollenSuggestion = (suggestion: AutocompleteSuggestion) => {
    setPollenParent(suggestion.value);
    setShowPollenSuggestions(false);
  };

  const handleCreateCross = () => {
    if (!podParent.trim() && !pollenParent.trim()) return;

    const podString = podParent.trim() || 'Unknown';
    const pollenString = pollenParent.trim() || 'Unknown';

    const nextNumber = crosses.length === 0 ? 1 : Math.max(...crosses.map(c => c.crossNumber)) + 1;

    const newCross: CrossData = {
      id: crypto.randomUUID(),
      crossNumber: nextNumber,
      podParent: podString,
      pollenParent: pollenString,
      podParentType: 'manual',
      pollenParentType: 'manual',
      dateCreated: new Date().toISOString(),
    };

    onSaveCross(newCross);
    onAssignCrosses([newCross.id], year);

    setPodParent('');
    setPollenParent('');
    setShowAddModal(false);
  };

  const todayDate = new Date().toLocaleDateString();

  return (
    <div className="assigned-crosses-page">
      {/* Header */}
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('crosses')}>
          <span className="back-icon">←</span>
        </button>
        <div className="header-content">
          <h1>To Do: Crosses ({year})</h1>
          <span className="header-date">date: {todayDate}</span>
        </div>
        <div className="header-spacer"></div>
      </div>

      <div className="page-layout">
        {/* Left Column - List */}
        <div className="list-column">
          {/* Search */}
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="search"
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

          {/* Add New Button */}
          <button className="add-new-btn" onClick={() => setShowAddModal(true)}>
            Add new
          </button>

          {/* Crosses List */}
          <div className="crosses-list">
            {filteredAssignments.length === 0 ? (
              <div className="empty-state">
                <p>No crosses assigned for {year}</p>
                <p className="empty-hint">Assign crosses from the main page</p>
              </div>
            ) : (
              filteredAssignments.map(assignment => {
                const sessionDelta = sessionCounts.get(assignment.id) || 0;
                const workedThisSession = sessionCounts.has(assignment.id);
                return (
                  <div
                    key={assignment.id}
                    className={`cross-row ${selectedAssignmentId === assignment.id ? 'selected' : ''} ${workedThisSession ? 'worked' : ''}`}
                    onClick={() => handleSelectCross(assignment.id)}
                  >
                    <div className="cross-checkbox">
                      <div className={`checkbox ${workedThisSession ? 'checked' : ''}`}>
                        {workedThisSession && '✓'}
                      </div>
                    </div>
                    <div className="cross-info">
                      <span className="cross-label">
                        ({assignment.cross?.podParent} × {assignment.cross?.pollenParent})
                      </span>
                      <div className="cross-counts">
                        {assignment.crossCount > 0 && (
                          <span className="cross-count-badge">Total: {assignment.crossCount}</span>
                        )}
                        {sessionDelta !== 0 && (
                          <span className={`session-delta ${sessionDelta > 0 ? 'positive' : 'negative'}`}>
                            {sessionDelta > 0 ? '+' : ''}{sessionDelta} this session
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Crossed Button */}
          <button className="crossed-all-btn" onClick={handleCompleteAll}>
            Crossed
          </button>
        </div>

        {/* Right Column - Count Input (Desktop) */}
        <div className={`count-column ${selectedAssignmentId ? 'visible' : ''}`}>
          {selectedAssignment && (
            <div className="count-panel">
              <button className="close-btn" onClick={handleCloseModal}>×</button>
              <div className="cross-display">
                <span className="cross-label-heading">cross:</span>
                <span className="cross-label-value">
                  ({selectedAssignment.cross?.podParent} × {selectedAssignment.cross?.pollenParent})
                </span>
              </div>

              <div className="count-controls">
                <button className="count-btn minus" onClick={handleDecrement}>−</button>
                <button className="count-display" onClick={handleClearCount} title="Tap to clear">
                  {crossCount}
                </button>
                <button className="count-btn plus" onClick={handleIncrement}>+</button>
              </div>

              <button className="crossed-btn" onClick={handleCrossedConfirm}>
                Crossed
              </button>

              <div className="number-pad">
                {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                  <button
                    key={num}
                    className="num-btn"
                    onClick={() => handleNumberPadInput(num)}
                  >
                    {num}
                  </button>
                ))}
                <button className="num-btn clear-btn" onClick={handleClearCount}>C</button>
                <button className="num-btn" onClick={() => handleNumberPadInput(0)}>0</button>
                <div className="num-spacer"></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Modal for Count Input */}
      {selectedAssignmentId && (
        <div className="mobile-modal-overlay count-modal-overlay" onClick={handleCloseModal}>
          <div className="mobile-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseModal}>×</button>
            <div className="cross-display">
              <span className="cross-label-heading">cross:</span>
              <span className="cross-label-value">
                ({selectedAssignment?.cross?.podParent} × {selectedAssignment?.cross?.pollenParent})
              </span>
            </div>

            <div className="count-controls">
              <button className="count-btn minus" onClick={handleDecrement}>−</button>
              <button className="count-display" onClick={handleClearCount} title="Tap to clear">
                {crossCount}
              </button>
              <button className="count-btn plus" onClick={handleIncrement}>+</button>
            </div>

            <button className="crossed-btn" onClick={handleCrossedConfirm}>
              Crossed
            </button>

            <div className="number-pad">
              {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(num => (
                <button
                  key={num}
                  className="num-btn"
                  onClick={() => handleNumberPadInput(num)}
                >
                  {num}
                </button>
              ))}
              <button className="num-btn clear-btn" onClick={handleClearCount}>C</button>
              <button className="num-btn" onClick={() => handleNumberPadInput(0)}>0</button>
              <div className="num-spacer"></div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Cross Modal */}
      {showAddModal && (
        <div className="mobile-modal-overlay add-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAddModal(false)}>×</button>
            <h2>New Cross</h2>

            <div className="input-group">
              <label>Pod Parent (Maternal)</label>
              <div className="autocomplete-container">
                <input
                  type="text"
                  value={podParent}
                  onChange={e => handlePodChange(e.target.value)}
                  onFocus={() => setShowPodSuggestions(true)}
                  placeholder="Search or type..."
                />
                {showPodSuggestions && podSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {podSuggestions.map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-item"
                        onClick={() => handleSelectPodSuggestion(s)}
                      >
                        {s.label}
                        {s.hybridizer && <span className="hybridizer">{s.hybridizer}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="cross-divider">×</div>

            <div className="input-group">
              <label>Pollen Parent (Paternal)</label>
              <div className="autocomplete-container">
                <input
                  type="text"
                  value={pollenParent}
                  onChange={e => handlePollenChange(e.target.value)}
                  onFocus={() => setShowPollenSuggestions(true)}
                  placeholder="Search or type..."
                />
                {showPollenSuggestions && pollenSuggestions.length > 0 && (
                  <div className="suggestions-dropdown">
                    {pollenSuggestions.map((s, i) => (
                      <button
                        key={i}
                        className="suggestion-item"
                        onClick={() => handleSelectPollenSuggestion(s)}
                      >
                        {s.label}
                        {s.hybridizer && <span className="hybridizer">{s.hybridizer}</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              className="create-btn"
              onClick={handleCreateCross}
              disabled={!podParent.trim() && !pollenParent.trim()}
            >
              Create & Add
            </button>
          </div>
        </div>
      )}

      {/* Achievement Screen */}
      {showAchievement && (
        <div className="achievement-overlay" onClick={handleAchievementClose}>
          <div className="achievement-content">
            <div className="achievement-icon">🌸</div>
            <h2>Great work!</h2>
            <p className="achievement-total">{sessionTotal} crosses completed</p>
            <p className="achievement-detail">across {sessionCounts.size} cross{sessionCounts.size !== 1 ? 'es' : ''}</p>
            <button className="achievement-btn" onClick={handleAchievementClose}>
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
