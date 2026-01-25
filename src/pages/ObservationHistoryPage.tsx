import { useState, useMemo } from 'react';
import { mockInventoryData } from '../data/mockInventory';
import { traitData } from '../data/traitData';
import ObservationHistoryCard from '../components/ObservationHistoryCard';
import type { FlattenedObservation } from '../components/ObservationHistoryCard';
import type { Page } from '../types';
import './ObservationHistoryPage.css';

interface ReturnContext {
  page: Page;
  data?: unknown;
}

interface ObservationHistoryPageProps {
  onNavigate: (page: Page, data?: unknown) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  initialFilters?: Partial<ObservationHistoryFilters>;
  returnTo?: ReturnContext;
}

interface ObservationHistoryFilters {
  year: string;
  season: string;
  month: string;
  type: string;
  varietyName: string;
  hybridizer: string;
  location: string;
  seedlingNumberOrNickname: string;
  selectedTraits: string[];
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SEASONS = ['Spring', 'Summer', 'Fall', 'Winter'];

const SEASON_MONTHS: Record<string, number[]> = {
  'Spring': [2, 3, 4],      // Mar, Apr, May
  'Summer': [5, 6, 7],      // Jun, Jul, Aug
  'Fall': [8, 9, 10],       // Sep, Oct, Nov
  'Winter': [11, 0, 1]      // Dec, Jan, Feb
};

// Aggregate all observations from all plants
function aggregateAllObservations(): FlattenedObservation[] {
  const allObservations: FlattenedObservation[] = [];

  for (const plant of mockInventoryData) {
    const plantType = plant.observationData.type === 'Seedling' ? 'seedling' : 'variety';

    // Add individual trait observations
    for (const obs of plant.individualTraitObservations) {
      allObservations.push({
        plantName: plant.name,
        plantId: plant.name,
        plantType: plantType as 'seedling' | 'variety',
        hybridizer: plant.hybridizer,
        seedlingNum: plant.seedlingNum,
        nickname: plant.observationData.nickname || null,
        location: plant.locationInGarden,
        observationDate: obs.observationDate,
        source: 'individual',
        traitValues: { [obs.traitField]: obs.value },
        observer: obs.observer,
        conditions: obs.conditions,
        notes: obs.notes,
        photos: obs.photos
      });
    }

    // Add observations from observation cycles
    for (const cycle of plant.observationCycles) {
      if (Object.keys(cycle.observations).length > 0) {
        allObservations.push({
          plantName: plant.name,
          plantId: plant.name,
          plantType: plantType as 'seedling' | 'variety',
          hybridizer: plant.hybridizer,
          seedlingNum: plant.seedlingNum,
          nickname: plant.observationData.nickname || null,
          location: plant.locationInGarden,
          observationDate: cycle.startDate,
          source: 'cycle',
          cycleName: cycle.cycleName,
          traitValues: cycle.observations,
          notes: cycle.notes,
          photos: cycle.photos
        });
      }
    }
  }

  // Sort by date descending (most recent first)
  return allObservations.sort((a, b) =>
    new Date(b.observationDate).getTime() - new Date(a.observationDate).getTime()
  );
}

// Get unique years from observations
function getAvailableYears(observations: FlattenedObservation[]): string[] {
  const years = new Set(observations.map(obs =>
    new Date(obs.observationDate).getFullYear().toString()
  ));
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
}

// Get all trait options grouped by area
function getAllTraitOptions(): Array<{ field: string; label: string; area: string }> {
  const options: Array<{ field: string; label: string; area: string }> = [];

  for (const area of traitData) {
    for (const group of area.groups) {
      for (const trait of group.traits) {
        options.push({
          field: trait.field,
          label: trait.label,
          area: area.name
        });
      }
    }
  }

  return options;
}

function ObservationHistoryPage({ onNavigate, isDark, onToggleTheme, initialFilters, returnTo }: ObservationHistoryPageProps) {
  const [filters, setFilters] = useState<ObservationHistoryFilters>({
    year: initialFilters?.year || '',
    season: initialFilters?.season || '',
    month: initialFilters?.month || '',
    type: initialFilters?.type || '',
    varietyName: initialFilters?.varietyName || '',
    hybridizer: initialFilters?.hybridizer || '',
    location: initialFilters?.location || '',
    seedlingNumberOrNickname: initialFilters?.seedlingNumberOrNickname || '',
    selectedTraits: initialFilters?.selectedTraits || []
  });

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());

  // Aggregate all observations
  const allObservations = useMemo(() => aggregateAllObservations(), []);
  const availableYears = useMemo(() => getAvailableYears(allObservations), [allObservations]);
  const traitOptions = useMemo(() => getAllTraitOptions(), []);

  // Group trait options by area
  const traitsByArea = useMemo(() => {
    const grouped: Record<string, Array<{ field: string; label: string }>> = {};
    for (const opt of traitOptions) {
      if (!grouped[opt.area]) {
        grouped[opt.area] = [];
      }
      grouped[opt.area].push({ field: opt.field, label: opt.label });
    }
    return grouped;
  }, [traitOptions]);

  // Apply filters
  const filteredObservations = useMemo(() => {
    return allObservations.filter(obs => {
      const date = new Date(obs.observationDate);

      // Year filter
      if (filters.year && date.getFullYear().toString() !== filters.year) {
        return false;
      }

      // Season filter
      if (filters.season) {
        const month = date.getMonth();
        if (!SEASON_MONTHS[filters.season]?.includes(month)) {
          return false;
        }
      }

      // Month filter
      if (filters.month) {
        if (MONTHS[date.getMonth()] !== filters.month) {
          return false;
        }
      }

      // Type filter
      if (filters.type && obs.plantType !== filters.type) {
        return false;
      }

      // Variety name search
      if (filters.varietyName) {
        const searchLower = filters.varietyName.toLowerCase();
        if (!obs.plantName.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Hybridizer search
      if (filters.hybridizer) {
        const searchLower = filters.hybridizer.toLowerCase();
        if (!obs.hybridizer.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Location search
      if (filters.location) {
        const searchLower = filters.location.toLowerCase();
        if (!obs.location?.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Seedling number/nickname search
      if (filters.seedlingNumberOrNickname) {
        const searchLower = filters.seedlingNumberOrNickname.toLowerCase();
        const matchesSeedlingNum = obs.seedlingNum?.toLowerCase().includes(searchLower);
        const matchesNickname = obs.nickname?.toLowerCase().includes(searchLower);
        if (!matchesSeedlingNum && !matchesNickname) {
          return false;
        }
      }

      return true;
    });
  }, [allObservations, filters]);

  const handleFilterChange = (field: keyof ObservationHistoryFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleTraitToggle = (traitField: string) => {
    setFilters(prev => ({
      ...prev,
      selectedTraits: prev.selectedTraits.includes(traitField)
        ? prev.selectedTraits.filter(t => t !== traitField)
        : [...prev.selectedTraits, traitField]
    }));
  };

  const handleAreaToggle = (area: string) => {
    setExpandedAreas(prev => {
      const next = new Set(prev);
      if (next.has(area)) {
        next.delete(area);
      } else {
        next.add(area);
      }
      return next;
    });
  };

  const handleSelectAllAreaTraits = (area: string) => {
    const areaTraits = traitsByArea[area]?.map(t => t.field) || [];
    const allSelected = areaTraits.every(t => filters.selectedTraits.includes(t));

    if (allSelected) {
      // Deselect all traits in this area
      setFilters(prev => ({
        ...prev,
        selectedTraits: prev.selectedTraits.filter(t => !areaTraits.includes(t))
      }));
    } else {
      // Select all traits in this area
      setFilters(prev => ({
        ...prev,
        selectedTraits: [...new Set([...prev.selectedTraits, ...areaTraits])]
      }));
    }
  };

  const handleClearFilters = () => {
    setFilters({
      year: '',
      season: '',
      month: '',
      type: '',
      varietyName: '',
      hybridizer: '',
      location: '',
      seedlingNumberOrNickname: '',
      selectedTraits: []
    });
  };

  const handleNavigateToPlant = (plantId: string) => {
    onNavigate('plant-detail', { plantId, plantType: 'variety' });
  };

  const activeFilterCount = [
    filters.year,
    filters.season,
    filters.month,
    filters.type,
    filters.varietyName,
    filters.hybridizer,
    filters.location,
    filters.seedlingNumberOrNickname
  ].filter(Boolean).length + (filters.selectedTraits.length > 0 ? 1 : 0);

  return (
    <div className="observation-history-page">
      {/* Integrated Header */}
      <div className="page-header">
        <button
          className="back-btn"
          onClick={() => returnTo ? onNavigate(returnTo.page, returnTo.data) : onNavigate('home')}
          aria-label={returnTo ? 'Go back' : 'Back to Home'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="page-title">
          <h1>Observation History</h1>
        </div>
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

      {/* Basic Filters */}
      <div className="basic-filters">
        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Year</label>
            <select
              className="filter-input"
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Season</label>
            <select
              className="filter-input"
              value={filters.season}
              onChange={(e) => handleFilterChange('season', e.target.value)}
            >
              <option value="">All Seasons</option>
              {SEASONS.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Month</label>
            <select
              className="filter-input"
              value={filters.month}
              onChange={(e) => handleFilterChange('month', e.target.value)}
            >
              <option value="">All Months</option>
              {MONTHS.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Type</label>
            <select
              className="filter-input"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              <option value="variety">Varieties</option>
              <option value="seedling">Seedlings</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Variety Name</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search variety..."
              value={filters.varietyName}
              onChange={(e) => handleFilterChange('varietyName', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Hybridizer</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search hybridizer..."
              value={filters.hybridizer}
              onChange={(e) => handleFilterChange('hybridizer', e.target.value)}
            />
          </div>
        </div>

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Location</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Seedling # / Nickname</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Search..."
              value={filters.seedlingNumberOrNickname}
              onChange={(e) => handleFilterChange('seedlingNumberOrNickname', e.target.value)}
            />
          </div>
        </div>

        {activeFilterCount > 0 && (
          <button className="clear-filters-btn" onClick={handleClearFilters}>
            Clear All Filters ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Advanced Filters - Trait Selection */}
      <div className="advanced-filters-section">
        <button
          className="advanced-filters-toggle"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <span className="expand-icon">{showAdvancedFilters ? '▼' : '▶'}</span>
          <span className="section-name">Advanced Filters - Select Traits to Display</span>
          {filters.selectedTraits.length > 0 && (
            <span className="section-count">{filters.selectedTraits.length} selected</span>
          )}
        </button>

        {showAdvancedFilters && (
          <div className="advanced-filters-panel">
            <p className="trait-selector-hint">
              Select specific traits to show in expanded observation cards. If none selected, key traits will be shown.
            </p>
            <div className="trait-areas">
              {Object.entries(traitsByArea).map(([area, traits]) => {
                const areaSelected = traits.filter(t => filters.selectedTraits.includes(t.field)).length;
                const isExpanded = expandedAreas.has(area);

                return (
                  <div key={area} className="trait-area">
                    <div className="trait-area-header">
                      <button
                        className="trait-area-toggle"
                        onClick={() => handleAreaToggle(area)}
                      >
                        <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                        <span className="area-name">{area}</span>
                        {areaSelected > 0 && (
                          <span className="area-count">({areaSelected}/{traits.length})</span>
                        )}
                      </button>
                      {isExpanded && (
                        <button
                          className="select-all-btn"
                          onClick={() => handleSelectAllAreaTraits(area)}
                        >
                          {areaSelected === traits.length ? 'Deselect All' : 'Select All'}
                        </button>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="trait-checkboxes">
                        {traits.map(trait => (
                          <label key={trait.field} className="checkbox-option">
                            <input
                              type="checkbox"
                              checked={filters.selectedTraits.includes(trait.field)}
                              onChange={() => handleTraitToggle(trait.field)}
                            />
                            <span className="checkbox-custom">✓</span>
                            <span>{trait.label}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="results-summary">
        <span>Showing {filteredObservations.length} observation{filteredObservations.length !== 1 ? 's' : ''}</span>
        {allObservations.length !== filteredObservations.length && (
          <span className="filtered-notice"> (filtered from {allObservations.length} total)</span>
        )}
      </div>

      {/* Observation List */}
      <div className="observation-list">
        {filteredObservations.map((obs, index) => (
          <ObservationHistoryCard
            key={`${obs.plantId}-${obs.observationDate}-${index}`}
            observation={obs}
            selectedTraits={filters.selectedTraits}
            onNavigateToPlant={handleNavigateToPlant}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredObservations.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No observations found</h3>
          <p>Try adjusting your filters or add some observations</p>
        </div>
      )}
    </div>
  );
}

export default ObservationHistoryPage;
