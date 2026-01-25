import { useState, useMemo, useEffect } from 'react';
import './PlantDetailPage.css';
import type { Page, PlantType } from '../types';
import { mockInventoryData, type MockVariety } from '../data/mockInventory';
import { traitData } from '../data/traitData';
import {
  extractAllObservations,
  groupObservationsByArea,
  extractAllImages,
  getSummaryValue,
  formatDisplayValue
} from '../utils/observationAggregation';
import TraitObservationCard from '../components/TraitObservationCard';
import ImageGallery from '../components/ImageGallery';

interface PlantDetailPageProps {
  plantType: PlantType;
  plantId: string;
  summaryFields: string[];
  onNavigate: (page: Page) => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

// Fields that are shown in the hero section (not in summary grid)
const HERO_FIELDS = ['name', 'hybridizer', 'year', 'ploidy', 'parentage', 'color_description'];

function PlantDetailPage({
  plantType: _plantType,
  plantId,
  summaryFields,
  onNavigate,
  isDark,
  onToggleTheme
}: PlantDetailPageProps) {
  // _plantType is available for future use when we support different plant types
  // Initialize with all areas expanded - will be set after groupedObservations is computed
  const [expandedAreas, setExpandedAreas] = useState<string[] | null>(null);
  // Thumbnail selection state - stores the URL of the selected thumbnail image
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Find the plant in mock data
  const plant: MockVariety | undefined = useMemo(() => {
    return mockInventoryData.find(p =>
      p.name === plantId ||
      p.seedlingNum === plantId ||
      p.observationData.variety_name === plantId
    );
  }, [plantId]);

  // Extract and aggregate all observations
  const observationMap = useMemo(() => {
    if (!plant) return new Map();
    return extractAllObservations(plant);
  }, [plant]);

  // Group observations by area
  const groupedObservations = useMemo(() => {
    if (!plant) return [];
    return groupObservationsByArea(observationMap, traitData);
  }, [observationMap, plant]);

  // Initialize all areas as expanded by default
  useEffect(() => {
    if (groupedObservations.length > 0 && expandedAreas === null) {
      setExpandedAreas(groupedObservations.map(g => g.area));
    }
  }, [groupedObservations, expandedAreas]);

  // Extract all images
  const images = useMemo(() => {
    if (!plant) return [];
    return extractAllImages(plant);
  }, [plant]);

  // Get summary values - filter out hero fields
  const summaryData = useMemo(() => {
    if (!plant) return [];
    return summaryFields
      .filter(field => !HERO_FIELDS.includes(field))
      .map(field => ({
        field,
        label: getFieldLabel(field),
        value: getSummaryValue(plant, field),
        isNumeric: isNumericField(field)
      }))
      .filter(item => item.value !== null && item.value !== undefined);
  }, [plant, summaryFields]);

  // Group summary data by row (numeric fields first)
  const numericSummary = summaryData.filter(d => d.isNumeric);
  const textSummary = summaryData.filter(d => !d.isNumeric);

  const toggleArea = (area: string) => {
    setExpandedAreas(prev => {
      const current = prev || [];
      return current.includes(area)
        ? current.filter(a => a !== area)
        : [...current, area];
    });
  };

  const expandAll = () => {
    setExpandedAreas(groupedObservations.map(g => g.area));
  };

  const collapseAll = () => {
    setExpandedAreas([]);
  };

  // Helper to check if area is expanded
  const isAreaExpanded = (area: string) => {
    return expandedAreas?.includes(area) ?? false;
  };

  if (!plant) {
    return (
      <div className="plant-detail-page">
        <div className="page-header">
          <button className="back-btn" onClick={() => onNavigate('inventory')}>
            ← Back to Inventory
          </button>
          <h1>Plant Not Found</h1>
          <p>Could not find plant with ID: {plantId}</p>
        </div>
      </div>
    );
  }

  const isSeedling = plant.observationData.type === 'Seedling';
  const displayName = isSeedling
    ? plant.seedlingNum || plant.name
    : plant.name;

  const nickname = isSeedling ? (plant.observationData.nickname || plant.name) : null;

  return (
    <div className="plant-detail-page">
      {/* Header - sticky with back button and theme toggle */}
      <div className="page-header">
        <button className="back-btn" onClick={() => onNavigate('inventory')} aria-label="Back to Inventory">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
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

      {/* Hero Section - Key Identifiers */}
      <div className="hero-section">
        <div className="hero-image">
          <div className="placeholder-image">
            <svg width="80" height="80" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <defs>
                <path id="petal" d="M50 5C 42 22, 44 36, 46 52L 54 52C 56 36, 58 22, 50 5 Z" />
                <path id="sepal" d="M50 0C 38 18, 40 38, 44 56L 56 56C 60 38, 62 18, 50 0 Z" />
              </defs>
              <use href="#petal" transform="rotate(0 50 50)" />
              <use href="#sepal" transform="rotate(60 50 50)" />
              <use href="#petal" transform="rotate(120 50 50)" />
              <use href="#sepal" transform="rotate(180 50 50)" />
              <use href="#petal" transform="rotate(240 50 50)" />
              <use href="#sepal" transform="rotate(300 50 50)" />
              <circle cx="50" cy="50" r="4.5" />
            </svg>
          </div>
          <span className={`type-tag ${isSeedling ? 'seedling' : 'variety'}`}>
            {plant.observationData.type}
          </span>
        </div>

        <div className="hero-content">
          <h1 className="plant-name">{displayName}</h1>
          {nickname && <p className="plant-nickname">"{nickname}"</p>}

          <div className="hero-details">
            {!isSeedling && (
              <div className="detail-row hybridizer-row">
                <span className="detail-label">Hybridizer</span>
                <span className="detail-value">{plant.hybridizer}</span>
                {plant.year && (
                  <>
                    <span className="detail-separator">·</span>
                    <span className="detail-value year">{plant.year}</span>
                  </>
                )}
              </div>
            )}

            <div className="detail-row ploidy-row">
              <span className="ploidy-badge large">{plant.ploidy || 'Unknown Ploidy'}</span>
              {plant.inventoryStatus && (
                <span className={`status-badge ${plant.inventoryStatus.toLowerCase().replace(' ', '-')}`}>
                  {plant.inventoryStatus}
                </span>
              )}
            </div>

            {plant.locationInGarden && (
              <div className="detail-row location-row">
                <span className="location-icon">📍</span>
                <span className="location-value">{plant.locationInGarden}</span>
              </div>
            )}

            {plant.parentage && (
              <div className="detail-row parentage-row">
                <span className="parentage-value">{plant.parentage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Color Description - Prominent Display */}
      {plant.colorDescription && (
        <div className="color-description-banner">
          <p>{plant.colorDescription}</p>
        </div>
      )}

      {/* Summary Section - Numeric values first row */}
      {(numericSummary.length > 0 || textSummary.length > 0) && (
        <section className="detail-section summary-section">
          <h2 className="section-title">Summary</h2>

          {numericSummary.length > 0 && (
            <div className="summary-row numeric-row">
              {numericSummary.map(({ field, label, value }) => (
                <div key={field} className="summary-item numeric">
                  <span className="summary-value">{formatDisplayValue(value, field)}</span>
                  <span className="summary-label">{label}</span>
                </div>
              ))}
            </div>
          )}

          {textSummary.length > 0 && (
            <div className="summary-row text-row">
              {textSummary.map(({ field, label, value }) => (
                <div key={field} className="summary-item text">
                  <span className="summary-label">{label}</span>
                  <span className="summary-value">{formatDisplayValue(value, field)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Images Section */}
      <section className="detail-section">
        <h2 className="section-title">Photos</h2>
        <ImageGallery
          images={images}
          plantName={displayName}
          thumbnailUrl={thumbnailUrl || undefined}
          onSetThumbnail={setThumbnailUrl}
        />
      </section>

      {/* All Observations Section */}
      <section className="detail-section observations-section">
        <div className="section-header">
          <h2 className="section-title">All Observations</h2>
          <div className="section-actions">
            <button className="text-btn" onClick={expandAll}>Expand All</button>
            <button className="text-btn" onClick={collapseAll}>Collapse All</button>
          </div>
        </div>

        <div className="observations-areas">
          {groupedObservations.map(group => (
            <div key={group.area} className="observation-area">
              <button
                className="area-header"
                onClick={() => toggleArea(group.area)}
              >
                <span className="expand-icon">{isAreaExpanded(group.area) ? '▼' : '▶'}</span>
                <span className="area-name">{group.area}</span>
                <span className="area-count">({group.observedCount} traits observed)</span>
              </button>

              {isAreaExpanded(group.area) && (
                <div className="area-traits">
                  {group.traits.map(trait => (
                    <TraitObservationCard
                      key={trait.traitField}
                      observation={trait}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Notes Section */}
      {plant.notes && (
        <section className="detail-section">
          <h2 className="section-title">Notes</h2>
          <div className="notes-content">
            <p>{plant.notes}</p>
          </div>
        </section>
      )}

      {/* Observation Cycles Section */}
      {plant.observationCycles.length > 0 && (
        <section className="detail-section">
          <h2 className="section-title">Observation Cycles</h2>
          <div className="cycles-list">
            {plant.observationCycles.map((cycle, idx) => (
              <div key={idx} className="cycle-card">
                <div className="cycle-header">
                  <h3>{cycle.cycleName}</h3>
                  <span className={`cycle-status ${cycle.completed ? 'completed' : 'active'}`}>
                    {cycle.completed ? 'Completed' : 'Active'}
                  </span>
                </div>
                <div className="cycle-dates">
                  {cycle.year} · {new Date(cycle.startDate).toLocaleDateString()}
                  {cycle.endDate && ` - ${new Date(cycle.endDate).toLocaleDateString()}`}
                </div>
                {cycle.notes && <p className="cycle-notes">{cycle.notes}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Lineage Section */}
      <section className="detail-section">
        <h2 className="section-title">Lineage</h2>
        <div className="lineage-info">
          <div className="parents">
            <h4>Parents</h4>
            {plant.observationData.pod_parent && (
              <p><strong>Pod:</strong> {plant.observationData.pod_parent}</p>
            )}
            {plant.observationData.pollen_parent && (
              <p><strong>Pollen:</strong> {plant.observationData.pollen_parent}</p>
            )}
            {!plant.observationData.pod_parent && !plant.observationData.pollen_parent && (
              <p className="no-data">No parentage information available</p>
            )}
          </div>

          <div className="children-placeholder">
            <h4>Children & Descendants</h4>
            <div className="coming-soon">
              <span className="icon">🌱</span>
              <p>Coming soon</p>
              <p className="subtext">Track seedlings and descendants from this plant</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper function to get human-readable labels for fields
function getFieldLabel(field: string): string {
  const labels: Record<string, string> = {
    name: 'Name',
    hybridizer: 'Hybridizer',
    year: 'Year',
    scape_height: 'Height',
    bloom_size: 'Bloom',
    bloom_season: 'Season',
    ploidy: 'Ploidy',
    foliage_type: 'Foliage',
    bloom_habit: 'Bloom Habit',
    bud_count: 'Buds',
    branches: 'Branches',
    color_description: 'Color',
    parentage: 'Parentage',
    form: 'Form',
    awards: 'Awards',
    sculpting: 'Sculpting',
    rebloom: 'Rebloom',
    rust_resistance: 'Rust'
  };

  return labels[field] || field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Helper to determine if a field is numeric
function isNumericField(field: string): boolean {
  const numericFields = [
    'scape_height', 'bloom_size', 'bud_count', 'branches',
    'foliage_height', 'fan_count', 'branch_count', 'bud_count_per_scape'
  ];
  return numericFields.includes(field);
}

export default PlantDetailPage;
